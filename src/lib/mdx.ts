// src/lib/mdx.ts
import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "articles");
const TOPICS_DIR = path.join(process.cwd(), "src", "content", "topics");
export const GUIDES_DIR = path.join(process.cwd(), "src", "content", "GuideArticles");

// ===== Types =====
export type Frontmatter = {
  title: string;
  date: string;         // ISO推奨
  excerpt?: string;
  thumbnail?: string;       // あるなら
  tags?: string[];
  category?: string;
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  thumbnail?: string;
  tags?: string[];
  category?: string;
};

export type CompiledPost = {
  slug: string;
  frontmatter: Frontmatter;
  Content: React.ReactNode; // compileMDX の content
};

// ===== Utils =====
function safeRead(filePath: string) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

function getSlugsIn(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

// ===== Guides =====
export function getGuideSlugs(): string[] {
  return getSlugsIn(GUIDES_DIR);
}

export function getGuideSourceBySlug(slug: string): string | null {
  const p = path.join(GUIDES_DIR, `${slug}.mdx`);
  return safeRead(p);
}

// ===== Articles (MDX) =====
// ===== Articles & Topics (MDX) =====
export function getAllSlugs(): string[] {
  return [...getSlugsIn(CONTENT_DIR), ...getSlugsIn(TOPICS_DIR)];
}

export async function getPostBySlug(slug: string): Promise<CompiledPost | null> {
  // CONTENT_DIR と TOPICS_DIR を順に探す
  const dirs = [CONTENT_DIR, TOPICS_DIR];
  let filePath: string | null = null;

  for (const dir of dirs) {
    const candidate = path.join(dir, `${slug}.mdx`);
    if (fs.existsSync(candidate)) {
      filePath = candidate;
      break;
    }
  }
  if (!filePath) return null;

  const source = safeRead(filePath);
  if (!source) return null;

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source,
    options: { parseFrontmatter: true },
    components: {},
  });

  return { slug, frontmatter, Content: content };
}

export function getAllPostsMeta(): PostMeta[] {
  const dirs = [CONTENT_DIR, TOPICS_DIR];
  const items: PostMeta[] = [];

  for (const dir of dirs) {
    const slugs = getSlugsIn(dir);
    slugs.forEach((slug) => {
      const raw = safeRead(path.join(dir, `${slug}.mdx`));
      if (!raw) return;
      const { data } = matter(raw);
      console.log(data);
      
      const fm = data as Partial<Frontmatter>;
      items.push({
        slug,
        title: fm.title ?? slug,
        date: fm.date ?? "1970-01-01",
        excerpt: fm.excerpt ?? "",
        thumbnail: fm.thumbnail ?? "",
        tags: fm.tags,
        category: fm.category,
      });
    });
  }

  // 日付降順
  items.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return items;
}

export function getPostMetaBySlug(slug: string): PostMeta | null {
  const all = getAllPostsMeta();
  return all.find((p) => p.slug === slug) ?? null;
}

