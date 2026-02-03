import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/sign-up`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  // Add blog posts
  const blogDir = path.join(process.cwd(), "src/content/blog");
  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(blogDir, file), "utf8"));
        routes.push({
          url: `${BASE_URL}/blog/${file.replace(".json", "")}`,
          lastModified: new Date(data.date),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      } catch {
        // skip invalid files
      }
    }
  }

  return routes;
}
