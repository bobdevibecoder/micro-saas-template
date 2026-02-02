import { Navbar } from "@/components/ui/navbar";
import { HeroConverter } from "@/components/landing/hero-converter";
import { APP_NAME } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Code, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Zap className="h-3.5 w-3.5" /> Free to use &mdash; no signup required
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Convert{" "}
            <span className="text-primary">JSON</span>
            {" "}&amp;{" "}
            <span className="text-primary">CSV</span>
            {" "}Instantly
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-12">
            Paste, convert, download. The fastest way to transform data between JSON and CSV formats.
            Free for 10 conversions/day, or upgrade for unlimited access + API.
          </p>

          {/* Live converter demo */}
          <HeroConverter />
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold mb-12">
            Why {APP_NAME}?
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                title: "Instant Conversion",
                desc: "Convert in milliseconds. No file uploads to external servers — everything runs in your browser.",
              },
              {
                icon: Shield,
                title: "Privacy First",
                desc: "Your data never leaves your browser for free-tier conversions. Zero tracking, zero storage.",
              },
              {
                icon: Code,
                title: "REST API",
                desc: "Pro users get a full REST API with key-based auth. Integrate conversions into any workflow.",
              },
              {
                icon: Globe,
                title: "Handle Any Format",
                desc: "Nested objects, special characters, multi-line values — all handled correctly.",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-border bg-card p-6">
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Need More?</h2>
          <p className="text-muted-foreground mb-8">
            Upgrade to Pro for unlimited conversions, 50MB file support, and full API access
            at just $19/month.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              View Pricing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/sign-in" className="hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
