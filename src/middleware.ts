import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimitMiddleware } from "@/lib/rate-limit";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isApiRoute = createRouteMatcher(["/api/(.*)"]);

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkConfigured =
  clerkKey && clerkKey !== "pk_test_placeholder" && clerkKey.startsWith("pk_");

function noopMiddleware(_req: NextRequest) {
  return NextResponse.next();
}

function combinedMiddleware(req: NextRequest) {
  // Apply rate limiting to API routes first
  if (isApiRoute(req)) {
    const rateLimitResponse = rateLimitMiddleware(req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  // Continue to Clerk middleware for protected routes
  return NextResponse.next();
}

export default clerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      // Apply rate limiting to API routes
      if (isApiRoute(req)) {
        const rateLimitResponse = rateLimitMiddleware(req);
        if (rateLimitResponse) {
          return rateLimitResponse;
        }
      }

      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    })
  : combinedMiddleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
