import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "articles");
export const GUIDES_DIR = path.join(process.cwd(), "src", "content", "GuideArticles");

export type Frontmatter = {
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  category?: string;
};


export function getGuideSlugs(): string[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getGuideSourceBySlug(slug: string): string | null {
  const p = path.join(GUIDES_DIR, `${slug}.mdx`);  
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf-8");
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith(".mdx"))
    .map(f => f.replace(/\.mdx$/, ""));
}

export async function getPostBySlug(slug: string): Promise<{ frontmatter: Frontmatter; Content: React.ReactNode }> {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  console.log(filePath);
  
  const source = fs.readFileSync(filePath, "utf-8");
  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source,
    options: { parseFrontmatter: true },
    components: {}
  });
  return { frontmatter, Content: content };
}

export function getAllPostsMeta() {
  const slugs = getAllSlugs();  
  console.log(slugs);
  
  const items = slugs.map(slug => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), "utf-8");
    const { data } = matter(raw);
    return { slug, ...(data as Frontmatter) };
  });
  return items.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
