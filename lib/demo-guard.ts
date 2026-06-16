import { createClient } from "@supabase/supabase-js";

// Lazy init : évite l'erreur "supabaseUrl is required" au build Next.js
function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const MAX_REQUESTS_PER_HOUR = 10;
const MAX_TOKENS_PER_DAY = 50_000;

export interface GuardResult {
  allowed: boolean;
  reason?: "rate_limit" | "daily_cap";
}

export async function checkDemoGuard(ip: string): Promise<GuardResult> {
  const sb = getSupabase();
  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const dayStart = new Date(now.toISOString().split("T")[0]).toISOString();

  const { count: hourlyCount } = await sb
    .from("demo_events")
    .select("*", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", hourAgo);

  if ((hourlyCount ?? 0) >= MAX_REQUESTS_PER_HOUR) {
    return { allowed: false, reason: "rate_limit" };
  }

  const { data: tokenRows } = await sb
    .from("demo_events")
    .select("tokens_used")
    .gte("created_at", dayStart);

  const dailyTokens = (tokenRows ?? []).reduce(
    (sum, row) => sum + (row.tokens_used ?? 0),
    0
  );

  if (dailyTokens >= MAX_TOKENS_PER_DAY) {
    return { allowed: false, reason: "daily_cap" };
  }

  return { allowed: true };
}

export async function logDemoEvent(
  ip: string,
  tokensUsed: number
): Promise<void> {
  await getSupabase()
    .from("demo_events")
    .insert({ ip, tokens_used: tokensUsed });
}
