import { Navbar } from "@/components/ui/navbar";
import { APP_NAME } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface BlogData {
  title: string;
  description: string;
  date: string;
  tags: string[];
  sections: { heading: string; content: string }[];
}

function getBlogPost(slug: string): BlogData | null {
  const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} | ${APP_NAME} Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{post.description}</p>

          <div className="flex flex-wrap gap-2 mb-12">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="prose prose-lg max-w-none">
            {post.sections.map((section, i) => (
              <div key={i} className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">{section.heading}</h2>
                <div
                  className="text-muted-foreground leading-relaxed whitespace-pre-line"
                >
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Ready to try {APP_NAME}?</h3>
            <p className="text-muted-foreground mb-4">
              Start converting for free. No signup required.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              Try it free
            </Link>
          </div>
        </div>
      </article>

      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
