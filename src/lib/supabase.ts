import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// Server-side client (use in API routes and server components)
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Types for our database tables
export interface DbUser {
  id: string;
  clerk_id: string;
  email: string | null;
  plan: "free" | "pro";
  api_key: string | null;
  stripe_customer_id: string | null;
  conversions_today: number;
  conversions_reset_at: string;
  created_at: string;
}

export interface DbConversion {
  id: string;
  user_id: string;
  direction: "json_to_csv" | "csv_to_json";
  input_size: number;
  created_at: string;
}

// Helper: get or create user by Clerk ID
export async function getOrCreateUser(clerkId: string, email?: string | null): Promise<DbUser> {
  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .single();

  if (existing) return existing as DbUser;

  const { data: created, error } = await supabase
    .from("users")
    .insert({ clerk_id: clerkId, email: email || null })
    .select()
    .single();

  if (error) throw new Error(`Failed to create user: ${error.message}`);
  return created as DbUser;
}

// Helper: log a conversion
export async function logConversion(
  userId: string,
  direction: "json_to_csv" | "csv_to_json",
  inputSize: number
) {
  await supabase.from("conversions").insert({
    user_id: userId,
    direction,
    input_size: inputSize,
  });
}

// Helper: check daily conversion limit
export async function checkConversionLimit(user: DbUser): Promise<{
  allowed: boolean;
  remaining: number;
}> {
  if (user.plan === "pro") return { allowed: true, remaining: Infinity };

  const resetAt = new Date(user.conversions_reset_at);
  const now = new Date();

  // Reset counter if it's a new day
  if (now > resetAt) {
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    await supabase
      .from("users")
      .update({ conversions_today: 0, conversions_reset_at: tomorrow.toISOString() })
      .eq("id", user.id);
    return { allowed: true, remaining: 10 };
  }

  const remaining = 10 - user.conversions_today;
  return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
}

// Helper: increment conversion counter
export async function incrementConversions(userId: string) {
  await supabase.rpc("increment_conversions", { user_row_id: userId });
}
