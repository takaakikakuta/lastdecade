// components/ManualSidebar.tsx
import Link from "next/link";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Article = {
  slug: string;
  title: string;
  date?: string;
  thumbnail?: string;
  views?: number;
};

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "articles");

// content/articles 配下から記事一覧を読み込む（サブディレクトリ対応）
function getArticles() {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const walk = (dir: string, base = ""): any[] => {
    return fs.readdirSync(dir).flatMap((file) => {
      const full = path.join(dir, file);
      const rel = path.join(base, file);
      if (fs.statSync(full).isDirectory()) {
        return walk(full, rel);
      }
      if (file.endsWith(".mdx")) {
        const raw = fs.readFileSync(full, "utf-8");
        const { data } = matter(raw);
        return [
          {
            slug: rel.replace(/\\.mdx$/, ""),
            title: data.title || file.replace(/\\.mdx$/, ""),
            excerpt: data.excerpt || "",
            date: data.date || "",
          },
        ];
      }
      return [];
    });
  };

  return walk(CONTENT_DIR).sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
}

export default function SideBar({
  className = "",
}: {
  className?: string;
}) {

      const articles = getArticles();
  const recent = articles.slice(0, 6);
  const popular = [...articles]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0) || +new Date(b.date || 0) - +new Date(a.date || 0))
    .slice(0, 6);

  return (
    <aside className={`space-y-6 ${className}`}>
      {/* 新着記事 */}
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">新着記事</h3>
        <ul className="space-y-3">
          {recent.map((a) => (
            <li key={a.slug} className="flex gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                {a.thumbnail ? (
                  <Image src={a.thumbnail} alt={a.title} fill sizes="48px" className="object-cover" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-xs text-zinc-400">
                    No img
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <Link
                  href={`/articles/${a.slug}`}
                  className="line-clamp-2 hover:underline underline-offset-4"
                >
                  {a.title}
                </Link>
                {a.date && <div className="text-xs text-zinc-500 mt-0.5">{a.date}</div>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 人気記事 */}
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">人気記事</h3>
        <ul className="space-y-2">
          {popular.map((a, i) => (
            <li key={a.slug} className="flex items-start gap-2">
              <span className="mt-0.5 text-xs w-5 text-zinc-500">{i + 1}.</span>
              <div className="min-w-0">
                <Link
                  href={`/articles/${a.slug}`}
                  className="line-clamp-2 hover:underline underline-offset-4"
                >
                  {a.title}
                </Link>
                <div className="text-xs text-zinc-500">
                  {typeof a.views === "number"
                    ? `${a.views.toLocaleString()} views`
                    : (a.date || "")}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
