"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";

/**
 * 用語集（Glossary）コンポーネント
 * - Next.js(App Router) / React / Tailwind
 * - 検索 / カテゴリ絞り込み / 50音インデックス / ハッシュリンク
 * - JSON-LD(DefinedTerm) 出力オプション
 * - 依存ライブラリなし（アイコンは inline SVG）
 *
 * 使い方:
 * <Glossary
 *   title="パパ活 用語集"
 *   items={[
 *     { term: "顔合わせ", reading: "かおあわせ", slug: "kaoawase", desc: <p>初回に条件や相性を確認する短い面談のこと。</p>, category: "初回" },
 *     { term: "お手当", reading: "おてあて", slug: "oteate", desc: <p>デートの対価として支払われる金銭や物品。</p>, category: "お金" },
 *   ]}
 *   jsonLd
 * />
 */

// ここを GlossaryItem[] に
const items: GlossaryItem[] = [
  { term: "顔合わせ", reading: "かおあわせ", desc: <p>初回に条件や相性を確認する短い面談。</p>, category: "初回", badge: "重要" },
  { term: "お手当", reading: "おてあて", desc: <p>デートの対価として支払われる金銭や物品。</p>, category: "お金" },
  // ...
];

export type GlossaryItem = {
  /** 表示名 */
  term: string;
  /** よみがな（ソート/索引に使用。カタカナでもOK） */
  reading?: string;
  /** URLフラグメントに使うスラッグ（任意。未指定なら term を正規化） */
  slug?: string;
  /** 本文 */
  desc: React.ReactNode;
  /** カテゴリ（絞り込み用） */
  category?: string;
  /** 同義語・別称 */
  synonyms?: string[];
  /** 表示用バッジ（例: NEW, 重要） */
  badge?: string;
  /** 更新日（表示任意） */
  updatedAt?: string; // YYYY-MM-DD
};

export type GlossaryProps = {
  items: GlossaryItem[];
  title?: string;
  className?: string;
  /** 検索ボックスの表示 */
  searchable?: boolean;
  /** カテゴリフィルタの表示 */
  filterable?: boolean;
  /** JSON-LD(DefinedTerm) を出力 */
  jsonLd?: boolean;
  /** インデックス(50音)の表示 */
  indexable?: boolean;
};

function cn(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

// かな→あいうえお の先頭グループ判定（簡易）
const GOJUON_GROUPS = [
  { key: "あ", chars: /[ぁ-おァ-オ]/ },
  { key: "か", chars: /[か-ごカ-ゴ]/ },
  { key: "さ", chars: /[さ-ぞサ-ゾ]/ },
  { key: "た", chars: /[た-どタ-ド]/ },
  { key: "な", chars: /[な-のナ-ノ]/ },
  { key: "は", chars: /[は-ぽハ-ポ]/ },
  { key: "ま", chars: /[ま-もマ-モ]/ },
  { key: "や", chars: /[や-よヤ-ヨ]/ },
  { key: "ら", chars: /[ら-ろラ-ロ]/ },
  { key: "わ", chars: /[わ-んワ-ン]/ },
  { key: "英", chars: /[A-Za-z]/ },
  { key: "数", chars: /[0-9]/ },
  { key: "他", chars: /.*/ },
];

function normalizeKana(s: string) {
  return s
    .replace(/[\u30A1-\u30F6]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0x60)) // カタカナ→ひらがな
    .normalize("NFKC")
    .trim();
}

function firstGroupKey(term: GlossaryItem) {
  const yomi = normalizeKana(term.reading || term.term);
  const first = yomi[0];
  for (const g of GOJUON_GROUPS) {
    if (g.chars.test(first)) return g.key;
  }
  return "他";
}

function toSlug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9一-龠ぁ-んァ-ン-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path d="M8 7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V7Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 9v8a3 3 0 0 0 3 3h8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Glossary({
  items,
  title,
  className,
  searchable = true,
  filterable = true,
  jsonLd = false,
  indexable = true,
}: GlossaryProps) {
  const baseId = useId();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | "all">("all");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // ハッシュで指定された用語へスクロール
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!h) return;
    const el = document.getElementById(`${baseId}-${h}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("ring-2", "ring-emerald-300");
      setTimeout(() => el.classList.remove("ring-2", "ring-emerald-300"), 1200);
    }
  }, [baseId]);

  // カテゴリ一覧
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const it of items) if (it.category) set.add(it.category);
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ja"));
  }, [items]);

  // フィルタリング
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return items.filter((it) => {
      if (cat !== "all" && it.category !== cat) return false;
      if (!qq) return true;
      const hay = [it.term, it.reading ?? "", ...(it.synonyms ?? []),
        typeof it.desc === "string" ? it.desc : ""].join("\n").toLowerCase();
      return hay.includes(qq);
    });
  }, [items, q, cat]);

  // ソート（読みで昇順）
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aa = normalizeKana(a.reading || a.term);
      const bb = normalizeKana(b.reading || b.term);
      return aa.localeCompare(bb, "ja");
    });
  }, [filtered]);

  // 50音グループ分け
  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryItem[]>();
    for (const it of sorted) {
      const key = firstGroupKey(it);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    }
    return map;
  }, [sorted]);

  // JSON-LD（DefinedTerm）
  const jsonLdData = useMemo(() => {
    if (!jsonLd) return null;
    const terms = sorted.map((it) => ({
      "@type": "DefinedTerm",
      name: it.term,
      description: typeof it.desc === "string" ? it.desc : undefined,
      alternateName: it.synonyms && it.synonyms.length ? it.synonyms.join(", ") : undefined,
      inDefinedTermSet: typeof window !== "undefined" ? window.location.href.split('#')[0] : undefined,
    }));
    return {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      name: title || "用語集",
      hasDefinedTerm: terms,
    } as const;
  }, [jsonLd, sorted, title]);

  function copyLink(slug: string) {
    const url = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}#${slug}` : `#${slug}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 1200);
    });
  }

  // 各項目レンダリング
  function renderItem(it: GlossaryItem) {
    const slug = (it.slug || toSlug(it.term)).replace(/^#/, "");
    return (
      <li key={slug} id={`${baseId}-${slug}`} className="rounded-xl border border-zinc-200 p-4 bg-white">
        <div className="flex items-start gap-3">
          <h3 className="text-base font-semibold leading-6">
            <a href={`#${slug}`} className="no-underline hover:underline">{it.term}</a>
            {it.badge && (
              <span className="ml-2 align-middle text-[11px] rounded-full border border-zinc-300 px-2 py-0.5 text-zinc-600">{it.badge}</span>
            )}
          </h3>
          <button
            type="button"
            onClick={() => copyLink(slug)}
            className="ml-auto inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700"
            aria-label={`${it.term} のリンクをコピー`}
          >
            {copiedSlug === slug ? <CheckIcon /> : <CopyIcon />}
            {copiedSlug === slug ? "Copied" : "Copy"}
          </button>
        </div>
        {it.reading && (
          <p className="text-xs text-zinc-500 mt-1">{it.reading}</p>
        )}
        <div className="mt-2 text-sm text-zinc-700 leading-6">
          {it.desc}
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-zinc-500">
          {it.category && <span className="rounded-full border px-2 py-0.5">{it.category}</span>}
          {it.synonyms?.length ? (
            <span>別称: {it.synonyms.join(" / ")}</span>
          ) : null}
          {it.updatedAt && <span>更新: {it.updatedAt}</span>}
        </div>
      </li>
    );
  }

  return (
    <section className={cn("not-prose rounded-2xl bg-white border shadow-sm p-6", className)}>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

      {(searchable || filterable) && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center mb-4">
          {searchable && (
            <div className="flex-1">
              <label className="sr-only" htmlFor={`${baseId}-glossary-search`}>用語を検索</label>
              <input
                id={`${baseId}-glossary-search`}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="キーワードで検索…"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-zinc-400"
              />
            </div>
          )}
          {filterable && (
            <div className="w-full md:w-64">
              <label className="sr-only" htmlFor={`${baseId}-glossary-cat`}>カテゴリ</label>
              <select
                id={`${baseId}-glossary-cat`}
                value={cat}
                onChange={(e) => setCat(e.target.value as any)}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-zinc-400"
              >
                <option value="all">すべてのカテゴリ</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {indexable && (
        <div className="mb-3 overflow-x-auto">
          <ol className="flex gap-1 text-xs text-zinc-600">
            {GOJUON_GROUPS.map((g) => (
              <li key={g.key} className="shrink-0">
                <a
                  href={`#idx-${g.key}`}
                  className="inline-block rounded-md border px-2 py-1 hover:bg-zinc-50"
                >
                  {g.key}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* グループ描画 */}
      <div className="grid gap-6">
        {GOJUON_GROUPS.map((g) => {
          const list = grouped.get(g.key) || [];
          if (!list.length) return null;
          return (
            <div key={g.key}>
              <div id={`idx-${g.key}`} className="text-sm font-semibold text-zinc-700 mb-2">{g.key}</div>
              <ul className="grid gap-3">
                {list.map(renderItem)}
              </ul>
            </div>
          );
        })}
      </div>

      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
      )}
    </section>
  );
}

// --- デモ ---
export function GlossaryDemo() {
  const items: GlossaryItem[] = [
    { term: "顔合わせ", reading: "かおあわせ", desc: <p>初回に条件や相性を確認する短い面談。</p>, category: "初回", badge: "重要" },
    { term: "お手当", reading: "おてあて", desc: <p>デートの対価として支払われる金銭や物品。</p>, category: "お金" },
    { term: "ドタキャン", reading: "どたきゃん", desc: <p>直前のキャンセル。トラブルの温床になりがち。</p>, category: "安全" },
    { term: "顔出し", reading: "かおだし", desc: <p>顔写真の共有。初回は基本控えるのが無難。</p>, category: "安全" },
    { term: "継続", reading: "けいぞく", desc: <p>定期的に会う取り決め。頻度や条件の明文化が鍵。</p>, category: "運用" },
  ].map((it) => ({ ...it, slug: (it as Partial<GlossaryItem>).slug ?? toSlug(it.term), }));

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Glossary title="パパ活 用語集" items={items} jsonLd />
    </div>
  );
}
