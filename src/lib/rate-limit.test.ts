/**
 * Regression Test: Rate Limiting Middleware
 * 
 * This test verifies that the rate limiting middleware:
 * 1. Allows requests under the rate limit
 * 2. Returns 429 status when rate limit is exceeded
 * 3. Includes proper rate limit headers
 */

import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { rateLimitMiddleware } from "@/lib/rate-limit";

// Mock NextRequest
function createMockRequest(ip: string = "127.0.0.1"): NextRequest {
  return {
    headers: new Headers({
      "x-forwarded-for": ip,
    }),
    url: "http://localhost:3000/api/test",
  } as unknown as NextRequest;
}

describe("Rate Limiting Middleware", () => {
  beforeEach(() => {
    // Clear any existing rate limit entries between tests
    // Note: In a real test environment, you might need to reset the module
  });

  it("should allow requests under the rate limit", () => {
    const req = createMockRequest("192.168.1.1");
    const response = rateLimitMiddleware(req);
    
    // Should return null (continue to next handler) for first request
    expect(response).toBeNull();
  });

  it("should return 429 status when rate limit is exceeded", () => {
    const ip = "192.168.1.2";
    
    // Send 101 requests (limit is 100)
    for (let i = 0; i < 100; i++) {
      const req = createMockRequest(ip);
      const response = rateLimitMiddleware(req);
      
      // First 100 should pass
      if (i < 100) {
        expect(response).toBeNull();
      }
    }
    
    // 101st request should be rate limited
    const req = createMockRequest(ip);
    const response = rateLimitMiddleware(req);
    
    expect(response).not.toBeNull();
    expect(response?.status).toBe(429);
  });

  it("should include rate limit headers in 429 response", () => {
    const ip = "192.168.1.3";
    
    // Exhaust the rate limit
    for (let i = 0; i < 101; i++) {
      const req = createMockRequest(ip);
      rateLimitMiddleware(req);
    }
    
    const req = createMockRequest(ip);
    const response = rateLimitMiddleware(req);
    
    expect(response).not.toBeNull();
    expect(response?.headers.get("X-RateLimit-Limit")).toBe("100");
    expect(response?.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(response?.headers.get("Retry-After")).toBeDefined();
  });

  it("should return proper error message when rate limited", async () => {
    const ip = "192.168.1.4";
    
    // Exhaust the rate limit
    for (let i = 0; i < 101; i++) {
      const req = createMockRequest(ip);
      rateLimitMiddleware(req);
    }
    
    const req = createMockRequest(ip);
    const response = rateLimitMiddleware(req);
    
    expect(response).not.toBeNull();
    const body = await response?.json();
    expect(body.error).toBe("Too many requests");
    expect(body.message).toBe("Rate limit exceeded. Please try again later.");
  });

  it("should track different IPs separately", () => {
    const ip1 = "192.168.1.5";
    const ip2 = "192.168.1.6";
    
    // Exhaust rate limit for ip1
    for (let i = 0; i < 101; i++) {
      const req = createMockRequest(ip1);
      rateLimitMiddleware(req);
    }
    
    // ip1 should be rate limited
    const req1 = createMockRequest(ip1);
    expect(rateLimitMiddleware(req1)).not.toBeNull();
    
    // ip2 should still be allowed
    const req2 = createMockRequest(ip2);
    expect(rateLimitMiddleware(req2)).toBeNull();
  });
});
