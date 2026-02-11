import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter for edge runtime
// In production, use Redis or similar for distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute

function getClientIdentifier(req: NextRequest): string {
  // Use IP address as identifier, fallback to a default if not available
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || 
             req.headers.get("x-real-ip") || 
             "unknown";
  return ip;
}

function isRateLimited(identifier: string): { limited: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First request or window expired, create new entry
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
    rateLimitMap.set(identifier, newEntry);
    return { limited: false, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime: newEntry.resetTime };
  }

  // Increment count
  entry.count++;
  rateLimitMap.set(identifier, entry);

  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count);
  const limited = entry.count > RATE_LIMIT_MAX_REQUESTS;

  return { limited, remaining, resetTime: entry.resetTime };
}

export function rateLimitMiddleware(req: NextRequest): NextResponse | null {
  const identifier = getClientIdentifier(req);
  const { limited, remaining, resetTime } = isRateLimited(identifier);

  if (limited) {
    const response = NextResponse.json(
      { 
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later."
      },
      { status: 429 }
    );
    
    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX_REQUESTS));
    response.headers.set("X-RateLimit-Remaining", "0");
    response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetTime / 1000)));
    response.headers.set("Retry-After", String(Math.ceil((resetTime - Date.now()) / 1000)));
    
    return response;
  }

  // Return null to continue to next middleware/handler
  return null;
}

// Cleanup old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);
