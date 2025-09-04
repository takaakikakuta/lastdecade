// app/interviews/page.tsx
import Image from "next/image";
import Link from "next/link";
import path from "node:path";
import fs from "node:fs/promises";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar"; // 使い回しの器（任意）

export const revalidate = 3600; // 1時間ごとに再検証（必要に応じて調整）

type AffiliateCTA = {
  label: string;
  href: string;
  start?: number;
  end?: number;
};
export type InterviewPost = {
  slug: string;
  title: string;
  excerpt?: string;
  thumbnail?: string;
  video?: string; // 今回は使わない
  date?: string;
  tags?: string[];
  category?: string;
  author?: string;
  ctas?: AffiliateCTA[];
};

const PAGE_SIZE = 9;

async function loadPosts(): Promise<InterviewPost[]> {
  const file = path.join(process.cwd(), "public", "interviews.json");
  try {
    const buf = await fs.readFile(file, "utf-8");
    const data = JSON.parse(buf) as unknown;
    if (!Array.isArray(data)) return [];
    // 日付降順で揃えておく
    return [...(data as InterviewPost[])].sort((a, b) => {
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
    if (v == null || v === "") next.delete(k);
    else next.set(k, v);
  });
  return `?${next.toString()}`;
}

type SP = { q?: string; cat?: string; page?: string };

// ★ Next.js 15 では searchParams が Promise なので async/await で受ける
export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SP>;
}) {
  const sp = (await searchParams) ?? {};
  const q = (sp.q ?? "").toString().trim().toLowerCase();
  const cat = (sp.cat ?? "すべて").toString();
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const posts = await loadPosts();

  // カテゴリ一覧
  const categories = ["すべて", ...uniq(posts.map((p) => p.category).filter(Boolean) as string[])];

  // フィルタ
  const filtered = posts.filter((p) => {
    const inCat = cat === "すべて" || p.category === cat;
    if (!inCat) return false;
    if (!q) return true;
    const hay = `${p.title} ${p.excerpt ?? ""} ${(p.tags ?? []).join(" ")}`.toLowerCase();
    return hay.includes(q);
  });

  // ページネーション
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  // 検索・カテゴリ維持用
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
              インタビュー
            </h1>
            <p className="mt-1 text-sm text-neutral-600">インタビューは匿名性を担保するため、生成AIによる音声で製作しております。</p>
          </div>

          {/* 検索（GET） */}
          <form className="relative w-full sm:w-80" action="/interviews" method="GET">
            <input
              name="q"
              defaultValue={q}
              placeholder="インタビューを検索"
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              aria-label="インタビュー検索"
            />
            {/* cat を維持 */}
            {cat && cat !== "すべて" && <input type="hidden" name="cat" value={cat} />}
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-3.5-3.5" />
            </svg>
          </form>
        </div>

        {/* 2カラム：本文 2/3 + Sidebar 1/3 */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 本文 2/3 */}
          <div className="lg:col-span-2">
            {/* カテゴリタブ（リンク） */}
            <div className="mb-5 flex flex-wrap gap-2">
              {categories.map((c) => {
                const sp2 = new URLSearchParams(baseParams);
                if (c === "すべて") {
                  sp2.delete("cat");
                } else {
                  sp2.set("cat", c);
                }
                sp2.delete("page");
                const href = `?${sp2.toString()}`;
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

            {/* グリッド */}
            {pageItems.length === 0 ? (
              <p className="rounded-xl border border-neutral-200 bg-white p-5 text-sm text-neutral-600">
                該当するインタビューは見つかりませんでした。
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {pageItems.map((p) => (
                  <InterviewCard key={p.slug} post={p} />
                ))}
              </div>
            )}

            {/* ページネーション（リンク） */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {/* Prev */}
                {currentPage > 1 ? (
                  <Link
                    href={buildQuery(baseParams, { page: String(currentPage - 1) })}
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
                  {currentPage} / {totalPages}
                </span>

                {/* Next */}
                {currentPage < totalPages ? (
                  <Link
                    href={buildQuery(baseParams, { page: String(currentPage + 1) })}
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

          {/* サイドバー 1/3（使い回し例） */}
          <SideBar className="lg:col-span-1" />
        </div>
      </main>
    </>
  );
}

function InterviewCard({ post }: { post: InterviewPost }) {
  const img = post.thumbnail || "/images/placeholder-16x9.jpg";
  const dt = post.date ? new Date(post.date) : null;
  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <Link href={`/interviews/${post.slug}`} className="group block">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={img}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
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
            {dt && (
              <time dateTime={dt.toISOString()} className="text-[11px] text-neutral-500">
                {new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(dt)}
              </time>
            )}
          </div>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-neutral-900">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{post.excerpt}</p>
          )}
          <div className="mt-3 text-sm font-medium text-neutral-700 underline underline-offset-4">
            詳細ページへ →
          </div>
        </div>
      </Link>
    </article>
  );
}
