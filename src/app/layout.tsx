import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appName = process.env.NEXT_PUBLIC_APP_NAME || "ConvertFlow";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkConfigured =
  clerkKey && clerkKey !== "pk_test_placeholder" && clerkKey.startsWith("pk_");

export const metadata: Metadata = {
  title: `${appName} — JSON & CSV Converter`,
  description:
    "Convert JSON to CSV and CSV to JSON instantly. Free online converter with API access for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const body = (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );

  if (clerkConfigured) {
    return <ClerkProvider>{body}</ClerkProvider>;
  }

  return body;
}
