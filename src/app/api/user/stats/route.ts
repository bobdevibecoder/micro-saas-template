import { NextResponse } from "next/server";
import { supabase, getOrCreateUser } from "@/lib/supabase";

export async function GET() {
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

  // Get total conversions count
  const { count: totalConversions } = await supabase
    .from("conversions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", dbUser.id);

  // Check daily limits
  const resetAt = new Date(dbUser.conversions_reset_at);
  const now = new Date();
  let conversionsToday = dbUser.conversions_today;

  // If the reset time has passed, the counter resets
  if (now > resetAt) {
    conversionsToday = 0;
  }

  const limit = dbUser.plan === "pro" ? Infinity : 10;
  const remaining = dbUser.plan === "pro" ? "unlimited" : Math.max(0, 10 - conversionsToday);

  return NextResponse.json({
    plan: dbUser.plan,
    conversionsToday,
    totalConversions: totalConversions ?? 0,
    apiKey: dbUser.api_key,
    remaining,
    limit: dbUser.plan === "pro" ? "unlimited" : limit,
  });
}
