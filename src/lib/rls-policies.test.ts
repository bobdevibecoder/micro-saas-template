/**
 * Regression Test: RLS Policies with Service Role Validation
 * 
 * This test verifies that RLS policies are properly configured:
 * 1. Only service_role can access the users and conversions tables
 * 2. Policies don't use USING (true) for anon/authenticated roles
 * 3. Schema has proper RLS enforcement
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("RLS Policies Security", () => {
  const schemaPath = resolve(__dirname, "../../supabase/schema.sql");
  const schemaContent = readFileSync(schemaPath, "utf-8");

  it("should not have USING (true) policies without service_role restriction", () => {
    // Check that no policy uses USING (true) without TO service_role
    const lines = schemaContent.split("\n");
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip comments
      if (line.trim().startsWith("--")) continue;
      
      // Check for USING (true) patterns
      if (line.includes("USING (true)") || line.includes("USING(true)")) {
        // Look for TO service_role in nearby lines (same policy block)
        const contextStart = Math.max(0, i - 5);
        const contextEnd = Math.min(lines.length, i + 2);
        const context = lines.slice(contextStart, contextEnd).join("\n");
        
        // Must have TO service_role to be secure
        expect(context).toContain("TO service_role");
      }
    }
  });

  it("should have RLS enabled on users table", () => {
    expect(schemaContent).toContain("ALTER TABLE users ENABLE ROW LEVEL SECURITY");
  });

  it("should have RLS enabled on conversions table", () => {
    expect(schemaContent).toContain("ALTER TABLE conversions ENABLE ROW LEVEL SECURITY");
  });

  it("should have service role policies for users table", () => {
    expect(schemaContent).toContain('"Service role can manage users"');
    expect(schemaContent).toContain("TO service_role");
  });

  it("should have service role policies for conversions table", () => {
    expect(schemaContent).toContain('"Service role can manage conversions"');
  });

  it("should drop old permissive policies if they exist", () => {
    // Ensure we're cleaning up old insecure policies
    expect(schemaContent).toContain('DROP POLICY IF EXISTS "Users can view own data" ON users');
    expect(schemaContent).toContain('DROP POLICY IF EXISTS "Users can update own data" ON users');
    expect(schemaContent).toContain('DROP POLICY IF EXISTS "Users can view own conversions" ON conversions');
    expect(schemaContent).toContain('DROP POLICY IF EXISTS "Users can insert own conversions" ON conversions');
  });

  it("should not contain permissive policies for anon or authenticated roles", () => {
    // Ensure no policies grant access to anon or authenticated roles
    const lines = schemaContent.split("\n");
    
    for (const line of lines) {
      // Skip comments
      if (line.trim().startsWith("--")) continue;
      
      // Should not have TO anon or TO authenticated
      if (line.includes("TO anon") || line.includes("TO authenticated")) {
        expect.fail(`Found permissive role grant in line: ${line}`);
      }
    }
  });
});
