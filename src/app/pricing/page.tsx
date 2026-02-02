import { Navbar } from "@/components/ui/navbar";
import { APP_NAME } from "@/lib/utils";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for quick one-off conversions",
    features: [
      "10 conversions per day",
      "1MB max file size",
      "JSON to CSV",
      "CSV to JSON",
      "Browser-based (private)",
      "Copy & download output",
    ],
    cta: "Get Started Free",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For developers and teams who need more",
    features: [
      "Unlimited conversions",
      "50MB max file size",
      "JSON to CSV",
      "CSV to JSON",
      "REST API access",
      "API key management",
      "Conversion history",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    href: "/sign-up",
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you need more power.
          </p>
        </div>

        <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="mb-4 inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}

              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors w-full ${
                  plan.highlighted
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "border border-border hover:bg-muted"
                }`}
              >
                {plan.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/sign-in" className="hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
