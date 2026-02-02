"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/ui/navbar";
import { HeroConverter } from "@/components/landing/hero-converter";
import { Key, Copy, Check, RefreshCw, BarChart3, Crown, AlertCircle } from "lucide-react";
import Link from "next/link";

interface UserStats {
  plan: "free" | "pro";
  conversionsToday: number;
  totalConversions: number;
  apiKey: string | null;
  remaining: number | "unlimited";
  limit: number | "unlimited";
}

export function DashboardContent() {
  const { user } = useUser();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  // Fetch user stats on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/user/stats");
        if (res.ok) {
          const data: UserStats = await res.json();
          setStats(data);
          if (data.apiKey) setApiKey(data.apiKey);
        }
      } catch {
        // Stats will stay null, showing defaults
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  const generateKey = async () => {
    setGenerating(true);
    setGenError("");
    try {
      const res = await fetch("/api/v1/generate-key", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.apiKey) {
        setApiKey(data.apiKey);
      } else {
        setGenError(data.error || "Failed to generate key");
      }
    } catch {
      setGenError("Network error");
    }
    setGenerating(false);
  };

  const copyKey = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const plan = stats?.plan || "free";
  const conversionsToday = stats?.conversionsToday ?? 0;
  const totalConversions = stats?.totalConversions ?? 0;
  const limit = plan === "pro" ? "∞" : "10";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Convert data and manage your API access.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 mb-8 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Today&apos;s Conversions</span>
            </div>
            <p className="text-2xl font-bold">
              {loading ? "—" : `${conversionsToday} / ${limit}`}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Total Conversions</span>
            </div>
            <p className="text-2xl font-bold">
              {loading ? "—" : totalConversions.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-2">
              {plan === "pro" ? (
                <Crown className="h-5 w-5 text-warning" />
              ) : (
                <Key className="h-5 w-5 text-primary" />
              )}
              <span className="text-sm text-muted-foreground">Plan</span>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold capitalize">{loading ? "—" : plan}</p>
              {!loading && plan === "free" && (
                <Link
                  href="/pricing"
                  className="text-xs text-primary hover:underline"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Converter */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Converter</h2>
          <HeroConverter />
        </div>

        {/* API Key section */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Key className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">API Access</h2>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary font-medium">
              Pro
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Use the REST API to convert data programmatically. Available on the Pro plan.
          </p>

          {apiKey ? (
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-muted px-4 py-2.5 font-mono text-sm">
                {apiKey}
              </code>
              <button
                onClick={copyKey}
                className="rounded-lg bg-muted p-2.5 hover:bg-border transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={generateKey}
                disabled={generating}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {generating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Key className="h-4 w-4" />
                )}
                Generate API Key
              </button>
              {genError && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {genError}
                </div>
              )}
            </div>
          )}

          {/* API usage example */}
          <div className="mt-6 rounded-lg bg-muted p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Example Request</p>
            <pre className="text-xs font-mono overflow-x-auto">
{`curl -X POST ${process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app"}/api/v1/convert \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"data": [{"name":"Alice","age":30}], "to": "csv"}'`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
