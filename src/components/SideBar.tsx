// components/ManualSidebar.tsx
import Link from "next/link";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";

export type Article = {
  slug: string;
  title: string;
  date?: string;
  excerpt?: string;
  cover?: string;       // ← JSONのキーに合わせる（サムネ）
  views?: number;
};

const TOPICS_JSON = path.join(process.cwd(), "public", "topics.json");

function getArticles(): Article[] {
  if (!fs.existsSync(TOPICS_JSON)) return [];

  const raw = fs.readFileSync(TOPICS_JSON, "utf-8");
  const list = JSON.parse(raw) as any[];

  // JSONのキー → Article に合わせて整形
  const items: Article[] = list.map((a) => ({
    slug: a.slug,
    title: a.title,
    date: a.date ?? "",
    excerpt: a.excerpt ?? "",
    cover: a.cover ?? "",
    views: a.views, // JSONに無ければ undefined のままでOK
  }));

  // 新しい順にソート
  return items.sort((a, b) => +new Date(b.date ?? 0) - +new Date(a.date ?? 0));
}

export default function SideBar({ className = "" }: { className?: string }) {
  const articles = getArticles();
  const recent = articles.slice(0, 6);
  const popular = [...articles]
    .sort(
      (a, b) =>
        (b.views ?? 0) - (a.views ?? 0) ||
        +new Date(b.date ?? 0) - +new Date(a.date ?? 0)
    )
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
                {a.cover ? (
                  <Image
                    src={a.cover}
                    alt={a.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-xs text-zinc-400">
                    No img
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <Link
                  // ルーティングに合わせて /articles か /topics に変更
                  href={`/topics/${a.slug}`}
                  className="line-clamp-2 hover:underline underline-offset-4"
                >
                  {a.title}
                </Link>
                {a.date && (
                  <div className="text-xs text-zinc-500 mt-0.5">{a.date}</div>
                )}
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
                  {typeof a.views === "number" ? `${a.views.toLocaleString()} views` : (a.date ?? "")}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
