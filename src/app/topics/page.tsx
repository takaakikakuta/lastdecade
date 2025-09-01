// app/topics/page.tsx
import Image from "next/image";
import Link from "next/link";
import path from "node:path";
import fs from "node:fs/promises";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

export const revalidate = 3600; // 1時間ごとにISR更新

export type GuidePost = {
  slug: string;
  title: string;
  excerpt?: string;
  cover?: string; // 16:9 推奨
  date?: string; // ISO string
  tags?: string[];
  category?: string;
  readMinutes?: number;
  author?: string;
  words?: number;
};

const PAGE_SIZE = 9;

async function loadPosts(): Promise<GuidePost[]> {
  const file = path.join(process.cwd(), "public", "topics.json");
  try {
    const buf = await fs.readFile(file, "utf-8");
    const data = JSON.parse(buf) as GuidePost[];
    if (!Array.isArray(data)) return [];
    // 新しい順にソート
    return [...data].sort((a, b) => {
      const ta = a.date ? +new Date(a.date) : 0;
      const tb = b.date ? +new Date(b.date) : 0;
      return tb - ta;
    });
  } catch {
    return [];
  }
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function buildQuery(base: URLSearchParams, patch: Record<string, string | undefined>) {
  const next = new URLSearchParams(base);
  Object.entries(patch).forEach(([k, v]) => {
    if (!v || v === "") next.delete(k);
    else next.set(k, v);
  });
  return `?${next.toString()}`;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { q?: string; cat?: string; page?: string };
}) {
  const q = (searchParams?.q ?? "").trim().toLowerCase();
  const cat = (searchParams?.cat ?? "すべて").toString();
  const page = Math.max(1, parseInt(searchParams?.page ?? "1", 10) || 1);

  const posts = await loadPosts();

  // カテゴリ一覧
  const categories = ["すべて", ...uniq(posts.map((p) => p.category).filter(Boolean) as string[])];

  // 絞り込み
  const filtered = posts.filter((p) => {
    const inCat = cat === "すべて" || p.category === cat;
    if (!inCat) return false;
    if (!q) return true;
    const hay = `${p.title} ${p.excerpt ?? ""} ${(p.tags ?? []).join(" ")}`.toLowerCase();
    return hay.includes(q);
  });

  // ページング
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const baseParams = new URLSearchParams();
  if (q) baseParams.set("q", q);
  if (cat && cat !== "すべて") baseParams.set("cat", cat);

  return (
    <>
      <Header />
      <main className="mx-auto container px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
              トピックス
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              始め方・注意点・リスク対策など、編集部が体系化。
            </p>
          </div>

          {/* 検索フォーム */}
          <form className="relative w-full sm:w-80" action="/topics" method="GET">
            <input
              name="q"
              defaultValue={q}
              placeholder="キーワード検索"
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            />
            {cat && cat !== "すべて" && <input type="hidden" name="cat" value={cat} />}
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-3.5-3.5" />
            </svg>
          </form>
        </div>

        {/* 2カラム */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 本文 */}
          <div className="lg:col-span-2">
            {/* カテゴリタブ */}
            <div className="mb-5 flex flex-wrap gap-2">
              {categories.map((c) => {
                const sp = new URLSearchParams(baseParams);
                if (c === "すべて") sp.delete("cat");
                else sp.set("cat", c);
                sp.delete("page");
                const href = `?${sp.toString()}`;
                const active = cat === c || (c === "すべて" && !baseParams.get("cat"));
                return (
                  <Link
                    key={c}
                    href={href}
                    className={`rounded-full border px-3 py-1 text-sm transition ${
                      active
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50"
                    }`}
                  >
                    {c}
                  </Link>
                );
              })}
            </div>

            {/* 投稿一覧 */}
            {pageItems.length === 0 ? (
              <p className="rounded-xl border border-neutral-200 bg-white p-5 text-sm text-neutral-600">
                該当するガイドは見つかりませんでした。
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {pageItems.map((p) => (
                  <GuideCard key={p.slug} post={p} />
                ))}
              </div>
            )}

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {current > 1 ? (
                  <Link
                    href={buildQuery(baseParams, { page: String(current - 1) })}
                    className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm"
                  >
                    前へ
                  </Link>
                ) : (
                  <span className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-400">
                    前へ
                  </span>
                )}
                <span className="text-sm text-neutral-600">
                  {current} / {totalPages}
                </span>
                {current < totalPages ? (
                  <Link
                    href={buildQuery(baseParams, { page: String(current + 1) })}
                    className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm"
                  >
                    次へ
                  </Link>
                ) : (
                  <span className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-400">
                    次へ
                  </span>
                )}
              </div>
            )}
          </div>

          {/* サイドバー */}
          <SideBar className="lg:col-span-1" />
        </div>
      </main>
    </>
  );
}

function GuideCard({ post }: { post: GuidePost }) {
  const img = post.cover || "/images/placeholder-16x9.jpg";
  const minutes = post.readMinutes ?? Math.max(2, Math.round((post.words ?? 800) / 500));

  return (
    <Link
      href={`/topics/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={img}
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>
      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {post.category && (
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
              {post.category}
            </span>
          )}
          <span className="text-[11px] text-neutral-500">{minutes}分で読める</span>
          {post.date && (
            <time dateTime={post.date} className="text-[11px] text-neutral-500">
              {new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(
                new Date(post.date)
              )}
            </time>
          )}
        </div>
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-neutral-900">
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{post.excerpt}</p>}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t} className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-700">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
