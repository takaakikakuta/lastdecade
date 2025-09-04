import React from "react";

// =====================
// 基本カード
// =====================
export type Feature = { label: string };

export type ServiceCardProps = {
  rank: number | string;
  name: string;                 // 例: "Love&（ラブアン）"
  bannerUrl: string;
  memberCount?: string;         // 例: "非公開"
  pricing: {
    female: string;
    male: string;
    note?: string;              // 例: "※初回お試しプラン：3日間600円！"
  };
  ageRange: { female: string; male: string };
  incomeProof: string;          // 例: "あり"
  features: string[];           // 箇条書き
  company: string;              // 例: "株式会社Bluebors"
  officialUrl: string;
  className?: string;
};

export function ServiceCard({
  rank,
  name,
  bannerUrl,
  memberCount = "非公開",
  pricing,
  ageRange,
  incomeProof,
  features,
  company,
  officialUrl,
  className = "",
}: ServiceCardProps) {
  return (
    <section
      className={
        "w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden " +
        className
      }
    >
      {/* Header */}
      <header className="px-5 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-emerald-600">
            {typeof rank === "number" ? `${rank}位` : rank}
          </span>
          <span className="text-gray-900">{name}</span>
        </h2>
      </header>

      {/* Banner */}
      <div className="mt-4 w-full aspect-[16/6] bg-gray-100">
        <img
          src={bannerUrl}
          alt={`${name} のバナー画像`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Details table */}
      <div className="p-5 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <tbody>
              <TableRow label="会員数" value={memberCount} />

              <TableRow
                label="料金"
                value={
                  <div className="space-y-1">
                    <p>女性：{pricing.female}</p>
                    <p>男性：{pricing.male}</p>
                    {pricing.note && (
                      <p className="text-rose-600 text-[13px]">{pricing.note}</p>
                    )}
                  </div>
                }
              />

              <TableRow
                label="年齢層"
                value={
                  <div className="space-y-1">
                    <p>女性：{ageRange.female}</p>
                    <p>男性：{ageRange.male}</p>
                  </div>
                }
              />

              <TableRow label="年収証明" value={incomeProof} />

              <TableRow
                label="特徴"
                value={
                  <ul className="list-disc pl-5 space-y-1">
                    {features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                }
              />

              <TableRow label="運営会社" value={company} />

              <TableRow
                label="公式"
                value={
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 underline underline-offset-4 hover:no-underline"
                  >
                    {officialUrl}
                  </a>
                }
              />
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function TableRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <tr className="group">
      <th
        scope="row"
        className="w-[120px] sm:w-[160px] align-top bg-gray-50 text-gray-600 text-left font-medium border-y first:border-t-0 last:border-b-0 border-gray-200 p-3"
      >
        {label}
      </th>
      <td className="align-top bg-white text-gray-900 border-y first:border-t-0 last:border-b-0 border-gray-200 p-3">
        {value}
      </td>
    </tr>
  );
}

// =====================
// フルページ（内部コンポーネント）
// =====================
export type Review = {
  author?: string;
  date?: string;
  body: string;
};

export type LoveanPageProps = ServiceCardProps & {
  lead?: string[];     // リード文（段落配列）
  reasons?: string[];  // おすすめ理由
  reviews?: Review[];  // 口コミ
  bestFor?: string[];  // 向いている男性
  ctaText?: string;
  ctaHref?: string;
};

function LoveanPage({
  lead = [],
  reasons = [],
  reviews = [],
  bestFor = [],
  ctaText = "ラブアンを無料ではじめる",
  ctaHref = "https://lovean.jp/",
  ...cardProps
}: LoveanPageProps) {
  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* メインカード */}
      <ServiceCard {...cardProps} className="ring-0 border border-zinc-200" />

      {/* リード文 */}
      {lead.length > 0 && (
        <section className="space-y-4 text-[15px] leading-7 text-zinc-700">
          {lead.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div>
            <a
              href={cardProps.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-600 text-sm underline"
            >
              公式サイト：{cardProps.officialUrl}
            </a>
          </div>
        </section>
      )}

      {/* おすすめ理由 */}
      {reasons.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">✓ Love＆（ラブアン）のおすすめ理由</h2>
          <ul className="space-y-2 text-[15px] text-zinc-700">
            {reasons.map((r, i) => (
              <li key={i} className="pl-4 border-l-4 border-emerald-200">
                {r}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 口コミ */}
      {reviews.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">✓ Love＆（ラブアン）の口コミ・評判</h2>
          <div className="space-y-4">
            {reviews.map((rev, i) => (
              <article key={i} className="rounded-xl border border-zinc-200 bg-white p-4">
                {rev.author && (
                  <div className="text-sm text-zinc-500 mb-1">
                    {rev.author}
                    {rev.date ? ` ・ ${rev.date}` : ""}
                  </div>
                )}
                <p className="text-[15px] text-zinc-800 leading-7 whitespace-pre-wrap">
                  {rev.body}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 向いている男性 */}
      {bestFor.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">✓ Love＆（ラブアン）に向いている男性</h2>
          <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4">
            <ul className="list-disc pl-6 space-y-1 text-[15px] text-zinc-800">
              {bestFor.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="pt-2">
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-base font-semibold bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 transition"
        >
          {ctaText}
        </a>
        {cardProps.pricing?.note && (
          <p className="mt-2 text-center text-sm text-rose-600">
            {cardProps.pricing.note}
          </p>
        )}
      </div>
    </div>
  );
}

// =====================
// デフォルト：LoveanComponent（フルページを返す）
// =====================
export default function LoveanComponent() {
  return (
    <LoveanPage
      rank={2}
      name="Love&（ラブアン）"
      bannerUrl="https://lastdecade.s3.ap-northeast-1.amazonaws.com/app/lovean/lovean_thumbnail.png"
      memberCount="非公開"
      pricing={{
        female: "完全無料",
        male: "1ヶ月 5,980円〜",
        note: "※初回お試しプラン：3日間600円！",
      }}
      ageRange={{ female: "20代前半〜20代後半", male: "30代前半〜50代前半" }}
      incomeProof="あり"
      features={[
        "男性から支援を得ている",
        "ライバルが少ないので狙い目",
        "高収入な太パパを見つけやすい",
      ]}
      company="株式会社Bluebors"
      officialUrl="https://lovean.jp/"
      lead={[
        "ラブアンは、男性が支援を行う前提が明確で、初回でもスムーズに条件確認が進む点が特長。",
        "登録女性の年齢層は20代が中心。継続前提の出会いにも向いており、無駄な交渉を減らせます。",
      ]}
      reasons={[
        "プロフィールで支援前提が分かりやすく、ミスマッチが少ない",
        "会員数は非公開だが、競合アプリよりもライバルが少なめで狙い目",
        "高収入の男性が多く、初回から相場感の合う出会いが見つけやすい",
      ]}
      reviews={[
        {
          author: "Xユーザー",
          body: "アプリのUIが使いやすくて初回交渉がスムーズ。連絡も取りやすかった。",
        },
        {
          author: "Xユーザー",
          body: "初回プランが安いので試しやすい。継続の合意形成もしやすかったです。",
        },
      ]}
      bestFor={[
        "初回から条件をはっきりさせて進めたい",
        "ライバルが少ない環境で始めたい",
        "継続前提で安定した関係を作りたい",
      ]}
      ctaText="ラブアンを無料ではじめる"
      ctaHref="https://lovean.jp/"
    />
  );
}
