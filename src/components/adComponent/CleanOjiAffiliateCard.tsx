import React from "react";

export type AffiliateCardProps = {
  // Visuals
  bannerUrl: string; // 横長バナー
  logoUrl?: string;  // 任意ロゴ

  // Texts
  title: string;           // 商品名
  subtitle?: string;       // キャッチ
  description?: string;    // 概要
  benefits?: string[];     // こう変わる/メリット
  cautions?: string[];     // 注意点（任意）
  tags?: string[];         // タグ/ジャンル
  coupon?: string;         // クーポン/キャンペーン
  priceText?: string;      // 価格表示
  rating?: number;         // 4.6 など
  reviewsCount?: number;   // 345 など
  disclosure?: string;     // アフィ開示文

  // CTAs
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };

  className?: string;
};

export default function CleanOjiAffiliateCard({
  bannerUrl,
  logoUrl,
  title,
  subtitle,
  description,
  benefits = [],
  cautions = [],
  tags = [],
  coupon,
  priceText,
  rating,
  reviewsCount,
  disclosure = "※本ページはアフィリエイト広告を利用しています。",
  primaryCta,
  secondaryCta,
  className = "",
}: AffiliateCardProps) {
  return (
    <article className={`w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm ${className}`}>
      {/* Banner */}
      <div className="relative aspect-[16/6] w-full bg-zinc-100">
        <img src={bannerUrl} alt={`${title} バナー`} className="h-full w-full object-cover" loading="lazy" />
        {coupon && (
          <div className="absolute left-3 top-3 rounded-full bg-rose-600/95 px-3 py-1 text-xs font-semibold text-white shadow">
            {coupon}
          </div>
        )}
        {tags?.length ? (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <span key={i} className="rounded-full bg-white/90 px-2 py-1 text-xs text-zinc-700 ring-1 ring-zinc-200 backdrop-blur">
                #{t}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* Body */}
      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.2fr,1fr]">
        {/* Left: copy */}
        <div className="space-y-4">
          <header className="flex items-start gap-3">
            {logoUrl && (
              <img src={logoUrl} alt="logo" className="mt-1 h-10 w-10 rounded-md border border-zinc-200 object-cover" />
            )}
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900">{title}</h2>
              {subtitle && <p className="mt-0.5 text-sm text-emerald-700">{subtitle}</p>}
            </div>
          </header>

          {rating != null && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <Stars value={rating} />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              {typeof reviewsCount === "number" && (
                <span className="text-zinc-500">（{reviewsCount.toLocaleString()}件）</span>
              )}
            </div>
          )}

          {description && <p className="text-[15px] leading-7 text-zinc-700">{description}</p>}

          {benefits.length > 0 && (
            <section>
              <h3 className="mb-2 text-sm font-semibold text-zinc-700">清潔オジへの一歩：こんな変化が期待できる</h3>
              <ul className="space-y-1.5 text-[15px] text-zinc-800">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {cautions.length > 0 && (
            <section className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <h4 className="mb-1 text-sm font-semibold text-amber-800">注意ポイント</h4>
              <ul className="list-disc pl-5 text-[13px] text-amber-900 space-y-1">
                {cautions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          <footer className="space-y-2">
            {disclosure && (
              <p className="text-xs text-zinc-500">{disclosure}</p>
            )}
          </footer>
        </div>

        {/* Right: pricing + CTAs */}
        <aside className="h-max space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
          {priceText && (
            <div className="text-center text-sm">
              <span className="text-zinc-500">価格の目安</span>
              <div className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900">{priceText}</div>
            </div>
          )}

          <a
            href={primaryCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-full bg-rose-500 px-5 py-3 text-center text-sm font-semibold text-white shadow hover:bg-rose-600 active:bg-rose-700"
          >
            {primaryCta.label}
          </a>

          {secondaryCta && (
            <a
              href={secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-rose-600 ring-1 ring-rose-300 hover:bg-rose-50"
            >
              {secondaryCta.label}
            </a>
          )}

          <div className="text-center text-[11px] text-zinc-500">
            リンク先：公式/販売ページ
          </div>
        </aside>
      </div>
    </article>
  );
}

function Stars({ value = 0 }: { value?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const count = 5;
  return (
    <div className="flex items-center gap-0.5" aria-label={`評価 ${value.toFixed(1)} / 5`}>
      {Array.from({ length: count }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <svg key={i} viewBox="0 0 24 24" className={`h-4 w-4 ${filled ? "fill-amber-400" : "fill-zinc-300"}`}>
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.168L12 18.897 4.664 23.164l1.402-8.168L.132 9.21l8.2-1.192z" />
          </svg>
        );
      })}
    </div>
  );
}

// =====================
// デモ（削除してOK）
// =====================
export function CleanOjiAffiliateCardDemo() {
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <CleanOjiAffiliateCard
        bannerUrl="https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/prep_skincare/prep_skincare_0.png"
        logoUrl="https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/prep_start4.png"
        title="オールインワン化粧水（敏感肌向け）"
        subtitle="まずは洗顔→保湿の2ステップで『清潔オジ』へ"
        description="忙しくても毎日続けられるシンプルケア。洗顔後に10秒パッと塗るだけで、テカリを抑え、肌のつっぱりを防ぎます。無香料・アルコールフリー。最初の一本に最適。"
        benefits={[
          "肌のベタつき・テカリが落ち着く",
          "ひげ剃り後のヒリつきをケア",
          "清潔感のあるサラッとした質感に",
        ]}
        cautions={["肌に合わないと感じたら使用を中止し、医師に相談してください。"]}
        tags={["スキンケア", "メンズ", "初心者向け"]}
        coupon="期間限定10%OFF"
        priceText="1,980円〜"
        rating={4.6}
        reviewsCount={328}
        primaryCta={{ label: "公式サイトで詳細を見る", href: "https://example.com/aff?sku=abc" }}
        secondaryCta={{ label: "Amazonで見る", href: "https://example.com/aff/amazon?sku=abc" }}
      />
    </div>
  );
}
