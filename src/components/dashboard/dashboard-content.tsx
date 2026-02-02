"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/ui/navbar";
import { HeroConverter } from "@/components/landing/hero-converter";
import { Key, Copy, Check, RefreshCw, BarChart3 } from "lucide-react";

export function DashboardContent() {
  const { user } = useUser();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateKey = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/v1/generate-key", { method: "POST" });
      const data = await res.json();
      if (data.apiKey) setApiKey(data.apiKey);
    } catch {
      // handle error silently
    }
    setGenerating(false);
  };

  const copyKey = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <p className="text-2xl font-bold">0 / 10</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Total Conversions</span>
            </div>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Key className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Plan</span>
            </div>
            <p className="text-2xl font-bold">Free</p>
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
