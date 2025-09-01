"use client";

import Image from "next/image";
import React from "react";

// ====== 内部データ（直接埋め込み） ======
const defaultItems = [
  {
    id: "lovean",
    rank: 1,
    name: "ラブアン",
    rankingimg:"https://lastdecade.s3.ap-northeast-1.amazonaws.com/appcomparetable/No_1.png",
    logo: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/appcomparetable/Gn8ocaB0_400x400.jpg",
    rating: 5.0,
    scoreText: "5.0",
    features: [
      <>充実した機能で<strong>ミスマッチが少ない</strong></>,
      <>男女比率に偏りがなく<strong>マッチングしやすい</strong></>,
    ],
    siteUrl: "https://example.com/lovean",
    ctaText: "無料登録はこちら",
  },
  {
    id: "sugardaddy",
    rank: 2,
    name: "シュガーダディ",
    rankingimg:"https://lastdecade.s3.ap-northeast-1.amazonaws.com/appcomparetable/No_2.png",
    logo: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/appcomparetable/sugardaddy_logo.png",
    rating: 4.5,
    features: [
      <>会員数<strong>200万人</strong></>,
      <>相手の<strong>被通報回数</strong>を事前に確認可能</>,
    ],
    siteUrl: "https://example.com/sd",
  },
  {
    id: "paddy",
    rank: 3,
    name: "パディ",
    rankingimg:"https://lastdecade.s3.ap-northeast-1.amazonaws.com/appcomparetable/No_2.png",
    logo: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/appcomparetable/13520851_300_0.jpg",
    rating: 4.3,
    features: [
      <>会員数<strong>130万人</strong></>,
      <><strong>ドタキャン防止</strong>機能付き</>,
    ],
    siteUrl: "https://example.com/paddy",
  },
];

// ====== 型定義 ======
type Item = typeof defaultItems[number];
type Props = {
  items?: Item[];
  className?: string;
  accent?: "sky" | "emerald" | "orange" | "blue" | "rose";
};

// ====== 色マップ ======
const accentMap = {
  sky:    { th: "bg-sky-600 text-white", rowBorder: "border-sky-200" },
  emerald:{ th: "bg-emerald-600 text-white", rowBorder: "border-emerald-200" },
  orange: { th: "bg-orange-500 text-white", rowBorder: "border-orange-200" },
  blue:   { th: "bg-blue-600 text-white", rowBorder: "border-blue-200" },
  rose:   { th: "bg-rose-600 text-white", rowBorder: "border-rose-200" },
};

// ====== コンポーネント本体 ======
export default function AppCompareTable({
  items = defaultItems, // ← デフォルトで内部データを使う
  className = "",
  accent = "sky",
}: Props) {
  const c = accentMap[accent];

  return (
    <div
      className={`overflow-x-auto rounded-xl bg-white shadow-sm ${className} bg-gray-400`}
    >
      <table className="min-w-[720px] w-full text-[15px] border-collapse my-0">
        <thead>
          <tr className="text-left divide-x divide-blue-600">
            <th className={`px-4 py-3 font-semibold ${c.th} rounded-tl-xl`}>
              おすすめパパ活アプリ
            </th>
            <th className={`px-4 py-3 font-semibold ${c.th}`}>総合評価</th>
            <th className={`px-4 py-3 font-semibold ${c.th}`}>特徴</th>
            <th className={`px-4 py-3 font-semibold ${c.th} rounded-tr-xl`}>
              公式サイト
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-600">
          {items.map((it) => (
            <tr
              key={it.id}
              className={`border-t ${c.rowBorder} hover:bg-zinc-50 transition-colors divide-x divide-blue-600`}
            >
              {/* アプリ名・画像 */}
              <td className="align-top">
                <div className="flex flex-col items-center text-center">
                {/* ランキングバッジ（ロゴに少しかぶせる） */}
                <div className="relative">
                    <img
                        src={it.logo}
                        alt={it.name}
                        className="object-contain rounded-lg ring-1 ring-zinc-200 bg-white shadow-sm
                                w-12 h-12 md:w-16 md:h-16" // ← スマホは48px, md以上は64px
                    />
                    <img
                        src={it.rankingimg}
                        alt={`${it.name} ranking`}
                        className="absolute -top-6 right-3 object-contain
                                w-6 h-6 md:w-10 md:h-10 md:-top-9" // ← スマホは小さい
                    />
                </div>

                {/* 名前リンク */}
                <a
                    href={it.siteUrl}
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-sm font-medium text-sky-700 hover:text-sky-900 hover:underline underline-offset-4 transition-colors"
                >
                    {it.name}
                </a>
            </div>

              </td>

              {/* 総合評価 */}
              <td className="px-4 py-5 align-top">
                <div className="font-semibold text-amber-600">
                  {it.scoreText ?? it.rating.toFixed(1)}
                </div>
                <StarRating value={it.rating} className="mt-1" />
              </td>

              {/* 特徴 */}
              <td className="px-4 py-5 align-top">
                <ul className="space-y-1.5">
                  {it.features.map((f, i) => (
                    <li key={i} className="leading-relaxed">
                      <span className="mr-1 text-zinc-400">・</span>
                      <span className="[&_strong]:text-rose-600 [&_strong]:font-semibold">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </td>

              {/* 公式サイト */}
              <td className="px-4 py-5 align-top">
                <a
                  href={it.siteUrl}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center justify-center rounded-full px-4 py-2 text-white font-semibold shadow
                             bg-gradient-to-b from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700"
                >
                  {it.ctaText ?? "無料登録はこちら"}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ====== 星評価表示 ======
function StarRating({ value, className = "" }: { value: number; className?: string }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} type="full" />
      ))}
      {half === 1 && <Star key="half" type="half" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} type="empty" />
      ))}
    </div>
  );
}

function Star({ type }: { type: "full" | "half" | "empty" }) {
  const common = "h-5 w-5";
  if (type === "full")
    return (
      <svg viewBox="0 0 20 20" className={`${common} text-amber-400`} aria-hidden>
        <path d="M10 1.5l2.7 5.5 6.1.9-4.4 4.3 1 6.1L10 15.7l-5.4 2.8 1-6.1L1.2 8 7.3 7l2.7-5.5z"
         fill="currentColor"   // ★追加
         />
      </svg>
    );
  if (type === "half")
    return (
      <svg viewBox="0 0 20 20" className={`${common} text-amber-400`} aria-hidden>
        <defs>
          <linearGradient id="halfGrad">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M10 1.5l2.7 5.5 6.1.9-4.4 4.3 1 6.1L10 15.7l-5.4 2.8 1-6.1L1.2 8 7.3 7l2.7-5.5z"
          fill="url(#halfGrad)"
          stroke="currentColor"
        />
      </svg>
    );
  return (
    <svg viewBox="0 0 20 20" className={`${common} text-amber-300/40`} aria-hidden>
      <path
        d="M10 1.5l2.7 5.5 6.1.9-4.4 4.3 1 6.1L10 15.7l-5.4 2.8 1-6.1L1.2 8 7.3 7l2.7-5.5z"
        fill="none"
        stroke="currentColor"
      />
    </svg>
  );
}
