import { Navbar } from "@/components/ui/navbar";
import { APP_NAME } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
}

function getBlogPosts(): BlogPost[] {
  const blogDir = path.join(process.cwd(), "src/content/blog");
  if (!fs.existsSync(blogDir)) return [];

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".json"));
  const posts: BlogPost[] = files
    .map((file) => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(blogDir, file), "utf8"));
        return {
          slug: file.replace(".json", ""),
          title: data.title,
          description: data.description,
          date: data.date,
          tags: data.tags || [],
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean) as BlogPost[];

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Tips, guides, and updates from the {APP_NAME} team.
          </p>

          {posts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-muted-foreground mb-3">{post.description}</p>
                  <div className="flex items-center gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="ml-auto text-sm text-primary flex items-center gap-1">
                      Read more <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
