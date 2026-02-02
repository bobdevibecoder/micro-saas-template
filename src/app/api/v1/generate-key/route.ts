import { NextResponse } from "next/server";
import { generateApiKey } from "@/lib/utils";
import { supabase, getOrCreateUser } from "@/lib/supabase";

export async function POST() {
  // Authenticate with Clerk
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkConfigured =
    clerkKey && clerkKey !== "pk_test_placeholder" && clerkKey.startsWith("pk_");

  if (!clerkConfigured) {
    return NextResponse.json(
      { error: "Auth not configured" },
      { status: 503 }
    );
  }

  const { auth, currentUser } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || null;

  // Get or create the user in Supabase
  const dbUser = await getOrCreateUser(userId, email);

  // Check if user is on Pro plan
  if (dbUser.plan !== "pro") {
    return NextResponse.json(
      { error: "API keys require a Pro plan. Upgrade at /pricing" },
      { status: 403 }
    );
  }

  // If user already has an API key, return it
  if (dbUser.api_key) {
    return NextResponse.json({ apiKey: dbUser.api_key });
  }

  // Generate a new key and save to Supabase
  const apiKey = generateApiKey();

  const { error } = await supabase
    .from("users")
    .update({ api_key: apiKey })
    .eq("id", dbUser.id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to save API key" },
      { status: 500 }
    );
  }

  return NextResponse.json({ apiKey });
}
