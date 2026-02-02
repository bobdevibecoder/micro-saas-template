import { NextRequest, NextResponse } from "next/server";
import { jsonToCsv, csvToJson } from "@/lib/converter";

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

    // TODO: Validate API key against Supabase when connected
    // For now, accept any non-empty key for development
    if (!apiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
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

    if (to === "csv") {
      // data should be a JSON array or string
      const input = typeof data === "string" ? data : JSON.stringify(data);
      result = jsonToCsv(input);
    } else {
      // data should be a CSV string
      if (typeof data !== "string") {
        return NextResponse.json(
          { error: "For CSV to JSON conversion, 'data' must be a CSV string." },
          { status: 400 }
        );
      }
      result = csvToJson(data);
    }

    return NextResponse.json({
      success: true,
      format: to,
      result: to === "json" ? JSON.parse(result) : result,
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
