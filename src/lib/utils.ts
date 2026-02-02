export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "cf_";
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "ConvertFlow";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    conversionsPerDay: 10,
    maxFileSize: 1 * 1024 * 1024, // 1MB
    apiAccess: false,
  },
  pro: {
    name: "Pro",
    price: 19,
    conversionsPerDay: Infinity,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    apiAccess: true,
  },
} as const;
