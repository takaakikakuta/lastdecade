"use client";

import React, { useId, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * FAQコンポーネント
 * - Next.js(App Router) / React / Tailwind 用
 * - アコーディオン（単一/複数開閉）
 * - 検索フィルタ
 * - schema.org FAQPage の JSON-LD 出力（任意）
 *
 * 使い方例：
 *
 * <FAQ
 *   items={[
 *     { q: "待ち合わせ場所は？", a: <p>基本は人通りの多いカフェやホテルラウンジ…</p> },
 *     { q: "初回の相場は？", a: <p>地域や条件により変わりますが…</p> },
 *   ]}
 *   title="よくある質問"
 *   searchable
 *   singleOpen
 *   defaultOpen={[0]}
 *   jsonLd
 * />
 */

export type FAQItem = {
  q: string;
  a: React.ReactNode;
  /** 展開の初期状態を個別指定したい場合 */
  defaultOpen?: boolean;
  /** バッジ表示（例: "NEW" や "重要"）*/
  badge?: string;
};

export type FAQProps = {
  items: FAQItem[];
  title?: string;
  className?: string;
  /** true の場合、検索入力を表示 */
  searchable?: boolean;
  /** true の場合、同時に開けるのは1つだけ */
  singleOpen?: boolean;
  /** 初期展開したいインデックスの配列（singleOpen=true の場合は最初の1つのみ有効） */
  defaultOpen?: number[];
  /** 外枠ボーダー有無 */
  bordered?: boolean;
  /** パディングを詰める簡易モード */
  compact?: boolean;
  /** schema.org/FAQPage の JSON-LD を出力（SEO用） */
  jsonLd?: boolean;
};

function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

function useInitialOpenState(
  len: number,
  defaultOpen: number[] | undefined,
  items: FAQItem[]
) {
  // defaultOpen の優先度：item.defaultOpen > props.defaultOpen
  const arr = Array.from({ length: len }, (_, i) => {
    if (typeof items[i]?.defaultOpen === "boolean") return !!items[i].defaultOpen;
    return defaultOpen?.includes(i) ?? false;
  });
  return arr;
}

export default function FAQ({
  items,
  title,
  className,
  searchable = false,
  singleOpen = false,
  defaultOpen,
  bordered = true,
  compact = false,
  jsonLd = false,
}: FAQProps) {
  const baseId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(() => useInitialOpenState(items.length, defaultOpen, items));

  // フィルタリング（質問・回答のテキストを対象）
  const filtered = useMemo(() => {
    if (!query.trim()) return items.map((v, i) => ({ ...v, _idx: i }));
    const q = query.toLowerCase();
    return items
      .map((v, i) => ({ ...v, _idx: i }))
      .filter((it) =>
        (it.q?.toLowerCase?.() ?? "").includes(q) ||
        (typeof it.a === "string" ? it.a.toLowerCase().includes(q) : false)
      );
  }, [items, query]);

  // JSON-LD（FAQPage）生成
  const jsonLdData = useMemo(() => {
    if (!jsonLd) return null;
    const mainEntity = items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          typeof it.a === "string"
            ? it.a
            : // ノードの場合はテキスト化を簡易的に（本番は SSR 側で文字列にするか、専用フィールドを持たせる）
              "",
      },
    }));
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
    } as const;
  }, [jsonLd, items]);

  function toggle(i: number) {
    setOpen((prev) => {
      if (singleOpen) {
        return prev.map((_, idx) => idx === i ? !prev[idx] : false);
      }
      const copy = [...prev];
      copy[i] = !copy[i];
      return copy;
    });
  }

  return (
    <section
      className={classNames(
        "not-prose rounded-2xl bg-white",
        bordered && "border shadow-sm",
        compact ? "p-4" : "p-6",
        className
      )}
    >
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

      {searchable && (
        <div className={classNames("mb-4", compact ? "mb-3" : "mb-5")}>
          <label className="sr-only" htmlFor={`${baseId}-faq-search`}>
            よくある質問を検索
          </label>
          <input
            id={`${baseId}-faq-search`}
            type="search"
            placeholder="キーワードで検索…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-zinc-400"
          />
          {query && (
            <p className="text-xs text-zinc-500 mt-2">
              検索結果: <strong>{filtered.length}</strong> 件
            </p>
          )}
        </div>
      )}

      <ul className="grid gap-2">
        {filtered.map((it, i) => {
          const idx = (it as any)._idx as number; // 元インデックス
          const isOpen = open[idx];
          const qId = `${baseId}-q-${idx}`;
          const aId = `${baseId}-a-${idx}`;
          return (
            <li key={qId} className="border border-zinc-200 rounded-xl">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={aId}
                id={qId}
                onClick={() => toggle(idx)}
                className={classNames(
                  "w-full flex items-start gap-3 px-4 py-3 text-left",
                  isOpen ? "bg-zinc-50" : "bg-white",
                )}
              >
                <span className={classNames(
                  "mt-1 shrink-0 transition-transform",
                  isOpen && "rotate-180"
                )}>
                  <ChevronDown className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-medium">
                    {it.q}
                    {it.badge && (
                      <span className="ml-2 align-middle text-[11px] rounded-full border border-zinc-300 px-2 py-0.5 text-zinc-600">
                        {it.badge}
                      </span>
                    )}
                  </span>
                </span>
              </button>
              <div
                id={aId}
                role="region"
                aria-labelledby={qId}
                className={classNames(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className={classNames("px-4", compact ? "pb-3" : "pb-4")}
                  >
                    {it.a}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {jsonLd && jsonLdData && (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      )}
    </section>
  );
}

// --- デモ用（削除可） ---
export function FAQDemo() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <FAQ
        title="よくある質問"
        searchable
        singleOpen
        defaultOpen={[0]}
        jsonLd
        items={[
          {
            q: "初回の待ち合わせはどこが安全？",
            a: (
              <p>
                人通りがあり、スタッフの目が届く<strong>カフェやホテルラウンジ</strong>が無難です。駅改札前は混雑・晒しリスクがあるため避けるのがおすすめ。
              </p>
            ),
            badge: "おすすめ",
          },
          {
            q: "当日の連絡はどうすればいい？",
            a: (
              <ul className="list-disc ml-5 space-y-1">
                <li>位置はピンで共有（細かい番地は送らない）</li>
                <li>顔写真の送付は基本NG（成りすまし対策）</li>
                <li>合流後は一度オーダーして落ち着いてから条件確認</li>
              </ul>
            ),
          },
          {
            q: "費用は誰が支払う？",
            a: <p>初回は男性側が支払うのが一般的です。事前に伝えて安心感を作りましょう。</p>,
          },
        ]}
      />
    </div>
  );
}
