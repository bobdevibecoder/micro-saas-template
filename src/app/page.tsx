import { Navbar } from "@/components/ui/navbar";
import { HeroConverter } from "@/components/landing/hero-converter";
import { APP_NAME } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Code, Globe, Sparkles, Lock, BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        {/* Background effects */}
        <div className="hero-gradient" />
        <div className="grid-pattern" />
        <div className="orb w-96 h-96 bg-primary/20 -top-48 -left-48" />
        <div className="orb w-72 h-72 bg-accent/15 -top-24 -right-24" style={{ animationDelay: '2s' }} />

        <div className="relative mx-auto max-w-6xl text-center">
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-sm text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>100% client-side &mdash; your data never leaves your browser</span>
          </div>

          <h1 className="animate-fade-in-delay-1 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Convert{" "}
            <span className="gradient-text">JSON</span>
            {" "}&amp;{" "}
            <span className="gradient-text">CSV</span>
            <br />
            <span className="text-muted-foreground text-4xl md:text-5xl lg:text-6xl">in milliseconds</span>
          </h1>

          <p className="animate-fade-in-delay-2 mx-auto max-w-2xl text-lg text-muted-foreground mb-14">
            The fastest, most private way to transform your data. Paste, convert, download.
            No uploads, no tracking, no nonsense.
          </p>

          {/* Live converter demo */}
          <div className="animate-fade-in-delay-3">
            <HeroConverter />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-t border-border/50 py-8 px-4">
        <div className="mx-auto max-w-4xl grid grid-cols-3 gap-8 text-center">
          {[
            { value: "100%", label: "Client-Side" },
            { value: "<1ms", label: "Conversion Speed" },
            { value: "0", label: "Data Stored" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative border-t border-border/50 py-24 px-4">
        <div className="hero-gradient opacity-50" />
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why developers choose{" "}
              <span className="gradient-text">{APP_NAME}</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built for speed, privacy, and developer experience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Instant Conversion",
                desc: "Sub-millisecond transforms. Everything runs locally in your browser with zero latency.",
                color: "text-yellow-400",
              },
              {
                icon: Shield,
                title: "Privacy First",
                desc: "Your data never touches a server. Zero tracking, zero storage, zero compromise.",
                color: "text-emerald-400",
              },
              {
                icon: Code,
                title: "REST API",
                desc: "Pro users get a full REST API with key-based auth. Integrate into any workflow or pipeline.",
                color: "text-blue-400",
              },
              {
                icon: Globe,
                title: "Handle Any Format",
                desc: "Nested objects, special characters, multi-line values, unicode — all handled correctly.",
                color: "text-purple-400",
              },
              {
                icon: Lock,
                title: "No Account Needed",
                desc: "Start converting immediately. No sign-up, no email, no friction. Just paste and go.",
                color: "text-rose-400",
              },
              {
                icon: BarChart3,
                title: "Batch Processing",
                desc: "Pro tier supports files up to 50MB with bulk conversion and export options.",
                color: "text-cyan-400",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="card-glow group rounded-2xl border border-border/50 bg-card/50 p-7 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-border/50 py-24 px-4">
        <div className="orb w-64 h-64 bg-primary/10 bottom-0 left-1/4" />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for <span className="gradient-text">unlimited</span> power?
          </h2>
          <p className="text-muted-foreground mb-10 text-lg">
            Upgrade to Pro for unlimited conversions, 50MB file support, batch processing, and full API access.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="btn-glow flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-white hover:bg-primary-hover transition-all"
            >
              View Pricing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-up"
              className="rounded-xl border border-border px-8 py-4 text-sm font-medium hover:bg-muted hover:border-primary/50 transition-all"
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 px-4">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white text-xs font-bold">CF</span>
            <span>&copy; {new Date().getFullYear()} {APP_NAME}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/sign-in" className="hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
