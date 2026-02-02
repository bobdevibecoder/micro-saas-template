import { NextResponse } from "next/server";
import { generateApiKey } from "@/lib/utils";

export async function POST() {
  // When Clerk is configured, authenticate the user
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkConfigured =
    clerkKey && clerkKey !== "pk_test_placeholder" && clerkKey.startsWith("pk_");

  if (clerkConfigured) {
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // TODO: Check user plan (Pro only) and save to Supabase when connected
  const apiKey = generateApiKey();

  return NextResponse.json({ apiKey });
}
