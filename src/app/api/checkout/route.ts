import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { APP_URL } from "@/lib/utils";

export async function POST() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkConfigured =
    clerkKey && clerkKey !== "pk_test_placeholder" && clerkKey.startsWith("pk_");

  if (!clerkConfigured) {
    return NextResponse.json(
      { error: "Auth not configured. Set up Clerk first." },
      { status: 503 }
    );
  }

  const { auth, currentUser } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = await createCheckoutSession(
      userId,
      user.emailAddresses[0]?.emailAddress || "",
      `${APP_URL}/dashboard?upgraded=true`,
      `${APP_URL}/pricing`
    );

    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
