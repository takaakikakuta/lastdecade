"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

/**
 * 実践ガイド一覧ページ（public/guides.json から取得）
 * - /public/guides.json を fetch して表示
 * - 検索 / カテゴリ / ページネーション / レスポンシブ対応
 * - 画像ホバーで scale-110
 */
export type GuidePost = {
  slug: string;
  title: string;
  excerpt?: string;
  cover?: string; // 16:9 推奨
  date?: string; // ISO string
  tags?: string[];
  category?: string; // 例: "はじめ方" / "注意点" / "リスク対策"
  readMinutes?: number;
  author?: string;
  words?: number;
};

const PAGE_SIZE = 9;

export default function Page() {
  const [posts, setPosts] = useState<GuidePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // public/guides.json を取得
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/guide.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as GuidePost[];
        setPosts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message ?? "読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // カテゴリ候補（先頭は「すべて」）
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.category && set.add(p.category));
    return ["すべて", ...Array.from(set)];
  }, [posts]);

  // UI 状態
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("すべて");
  const [page, setPage] = useState(1);

  // 並び替え（新しい順）
  const sorted = useMemo(() => {
    return [...posts].sort((a, b) => {
      const ta = a.date ? +new Date(a.date) : 0;
      const tb = b.date ? +new Date(b.date) : 0;
      return tb - ta;
    });
  }, [posts]);

  // 絞り込み
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sorted.filter((p) => {
      const byCat = cat === "すべて" || p.category === cat;
      if (!byCat) return false;
      if (!needle) return true;
      const hay = `${p.title} ${p.excerpt ?? ""} ${(p.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [sorted, q, cat]);

  // ページング
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const handleChangePage = (next: number) => {
    if (next < 1 || next > totalPages) return;
    setPage(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <section className="mx-auto max-w-screen-xl px-4">
        {/* ヘッダー */}
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">実践ガイド</h2>
            <p className="mt-1 text-sm text-neutral-600">始め方・注意点・リスク対策など、編集部が体系化。</p>
          </div>
          {/* 検索 */}
          <div className="relative w-full sm:w-80">
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="キーワード検索"
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              aria-label="実践ガイド検索"
            />
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
          </div>
        </div>

        {/* カテゴリタブ */}
        <div className="mb-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCat(c);
                setPage(1);
              }}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                cat === c
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* 状態表示 */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <div className="aspect-[16/9] bg-neutral-200" />
                <div className="p-4">
                  <div className="mb-2 h-3 w-24 rounded bg-neutral-200" />
                  <div className="h-4 w-3/4 rounded bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        )}
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">読み込みに失敗しました：{error}</p>
        )}

        {/* グリッド */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((p) => (
              <GuideCard key={p.slug} post={p} />
            ))}
          </div>
        )}

        {/* ページネーション */}
        {!loading && !error && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => handleChangePage(current - 1)}
              className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm disabled:opacity-40"
              disabled={current <= 1}
            >
              前へ
            </button>
            <span className="text-sm text-neutral-600">
              {current} / {totalPages}
            </span>
            <button
              onClick={() => handleChangePage(current + 1)}
              className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm disabled:opacity-40"
              disabled={current >= totalPages}
            >
              次へ
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function GuideCard({ post }: { post: GuidePost }) {
  const img = post.cover || "/images/placeholder-16x9.jpg";
  const minutes = post.readMinutes ?? Math.max(2, Math.round((post.words ?? 800) / 500));

  return (
    <Link
      href={`/guides/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition"
      aria-label={post.title}
    >
      {/* 画像 */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={img}
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>

      {/* テキスト */}
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
              {new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(post.date))}
            </time>
          )}
        </div>
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-neutral-900">{post.title}</h3>
        {post.excerpt && <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{post.excerpt}</p>}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t} className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-700">#{t}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
