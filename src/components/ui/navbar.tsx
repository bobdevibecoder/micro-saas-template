"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { APP_NAME } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white text-sm font-bold shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            CF
          </span>
          <span className="group-hover:text-primary transition-colors">{APP_NAME}</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </Link>

          <SignedOut>
            <Link
              href="/sign-in"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="btn-glow flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
