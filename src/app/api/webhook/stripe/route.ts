import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const clerkUserId = session.metadata?.clerk_user_id;
      const customerId = session.customer as string;

      if (clerkUserId) {
        // Upgrade user to Pro in Supabase
        const { error } = await supabase
          .from("users")
          .update({
            plan: "pro",
            stripe_customer_id: customerId,
          })
          .eq("clerk_id", clerkUserId);

        if (error) {
          console.error(`Failed to upgrade user ${clerkUserId}: ${error.message}`);
        } else {
          console.log(`User ${clerkUserId} upgraded to Pro. Stripe customer: ${customerId}`);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Downgrade user to Free and revoke API key
      const { error } = await supabase
        .from("users")
        .update({
          plan: "free",
          api_key: null,
        })
        .eq("stripe_customer_id", customerId);

      if (error) {
        console.error(`Failed to downgrade customer ${customerId}: ${error.message}`);
      } else {
        console.log(`Subscription cancelled, customer ${customerId} downgraded to Free`);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const status = subscription.status;
      const customerId = subscription.customer as string;

      if (status === "past_due" || status === "unpaid") {
        // Downgrade user on payment failure
        const { error } = await supabase
          .from("users")
          .update({
            plan: "free",
            api_key: null,
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error(`Failed to handle payment issue for ${customerId}: ${error.message}`);
        } else {
          console.log(`Payment issue for customer ${customerId}, downgraded to Free`);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
