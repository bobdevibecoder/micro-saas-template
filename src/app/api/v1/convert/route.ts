import { NextRequest, NextResponse } from "next/server";
import { jsonToCsv, csvToJson } from "@/lib/converter";
import { supabase, checkConversionLimit, incrementConversions, logConversion } from "@/lib/supabase";
import type { DbUser } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    // Check for API key
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header. Use: Bearer YOUR_API_KEY" },
        { status: 401 }
      );
    }

    const apiKey = authHeader.replace("Bearer ", "");
    if (!apiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Validate API key against Supabase
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("api_key", apiKey)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const dbUser = user as DbUser;

    // Only Pro users can use the API
    if (dbUser.plan !== "pro") {
      return NextResponse.json(
        { error: "API access requires a Pro plan. Upgrade at /pricing" },
        { status: 403 }
      );
    }

    // Check rate limits (Pro = unlimited, but still track)
    const { allowed, remaining } = await checkConversionLimit(dbUser);
    if (!allowed) {
      return NextResponse.json(
        { error: "Daily conversion limit reached." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { data, to } = body;

    if (!data) {
      return NextResponse.json(
        { error: "Missing 'data' field. Provide the data to convert." },
        { status: 400 }
      );
    }

    if (!to || !["csv", "json"].includes(to)) {
      return NextResponse.json(
        { error: "Missing or invalid 'to' field. Use 'csv' or 'json'." },
        { status: 400 }
      );
    }

    let result: string;
    const direction: "json_to_csv" | "csv_to_json" = to === "csv" ? "json_to_csv" : "csv_to_json";

    if (to === "csv") {
      const input = typeof data === "string" ? data : JSON.stringify(data);
      result = jsonToCsv(input);
    } else {
      if (typeof data !== "string") {
        return NextResponse.json(
          { error: "For CSV to JSON conversion, 'data' must be a CSV string." },
          { status: 400 }
        );
      }
      result = csvToJson(data);
    }

    // Log the conversion and increment counter
    const inputSize = typeof data === "string" ? data.length : JSON.stringify(data).length;
    await Promise.all([
      logConversion(dbUser.id, direction, inputSize),
      incrementConversions(dbUser.id),
    ]);

    return NextResponse.json({
      success: true,
      format: to,
      result: to === "json" ? JSON.parse(result) : result,
      remaining: remaining === Infinity ? "unlimited" : remaining - 1,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Conversion failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    service: "ConvertFlow API",
    version: "1.0",
    endpoints: {
      "POST /api/v1/convert": {
        description: "Convert between JSON and CSV",
        body: {
          data: "string | array — the data to convert",
          to: "'csv' | 'json' — target format",
        },
        headers: {
          Authorization: "Bearer YOUR_API_KEY",
        },
      },
    },
  });
}
