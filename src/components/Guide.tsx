import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * 最新インタビュー 4件グリッド
 * - レスポンシブ：1col -> 2col(sm) -> 4col(lg)
 * - ホバーで画像を 1.1 倍スケール
 * - props.items は 4件以上OK。日付で並べ替えて上位4件のみ表示
 */
export type InterviewItem = {
  slug: string;
  title: string;
  cover?: string; // 画像URL（省略時はプレースホルダー）
  date?: string;  // ISO 文字列想定
};

export default function Guide({ items }: { items: InterviewItem[] }) {
  const sorted = [...(items || [])].sort((a, b) => {
    const ta = a.date ? +new Date(a.date) : 0;
    const tb = b.date ? +new Date(b.date) : 0;
    return tb - ta;
  });
  const top4 = sorted.slice(0, 4);

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-4">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
          実践ガイド
        </h2>
        <Link href="/guide" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          すべて見る →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {top4.map((post) => (
          <GuideCard key={post.slug} item={post} />)
        )}
      </div>
    </section>
  );
}

function GuideCard({ item }: { item: InterviewItem }) {
  const img = item.cover || "/images/placeholder-16x9.jpg";

  return (
    <Link
      href={`/interviews/${item.slug}`}
      aria-label={item.title}
      className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition"
    >
      {/* image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={img}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
        />
        {/* 角のグローを少しだけ */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-black/0" />
      </div>

      {/* title */}
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-neutral-900">
          {item.title}
        </h3>
        {item.date ? (
          <time dateTime={item.date} className="mt-1 block text-[11px] text-neutral-500">
            {new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(item.date))}
          </time>
        ) : null}
      </div>
    </Link>
  );
}
