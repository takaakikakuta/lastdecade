import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * ヒーローセクション（LastDecade向け）
 * - Tailwind CSS 前提
 * - 背景: 微グラデ + 放射グロー
 * - CTA: インタビューを読む / 会員限定を見る
 * - 追加要素: バッジ、要点リスト、補足注釈
 */
export default function Hero() {
  return (
   <section className="relative overflow-hidden flex">
        {/* background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
            {/* 背景画像に差し替え */}
            <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
                backgroundImage:
                "url('https://lastdecade.s3.ap-northeast-1.amazonaws.com/background.png')", // 1920x1080 の夜景画像を public/images に配置
            }}
            />
            {/* 薄いオーバーレイで文字を見やすく */}
            <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="flex flex-col-reverse md:flex-row mx-auto container px-2 py-2 sm:py-20 md:py-24 lg:py-28 text-white">
            <div className="md:w-2/3 w-full">

                {/* badge */}
                {/* <div className="mb-4 inline-flex max-w-fit items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm whitespace-nowrap">
                <span className="inline-block h-2 w-2 rounded-full bg-white" />
                匿名性に配慮した実録インタビュー
                </div> */}

                {/* headline */}
                <h1 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                最後ではない、最高の10年にしよう。
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-100 sm:text-base">
                LastDecadeは、体験者の安全と匿名性を最優先に、パパ活の実態を丁寧に編集して届けるメディアです。
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                    href="/interviews"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/50 bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white"
                >
                    インタビュー動画を見る
                </Link>
                <Link
                    href="/manual"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/50 bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white"
                >
                    パパ活実践ガイド
                </Link>
                </div>

                {/* key points */}
                {/* <ul className="mt-8 grid max-w-3xl grid-cols-1 gap-3 text-sm text-white sm:grid-cols-3">
                <li className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 py-2 shadow-sm backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path d="M4 12h16M4 6h16M4 18h16" />
                    </svg>
                    体系化された実践ガイド
                </li>
                <li className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 py-2 shadow-sm backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path d="M12 11.5a3 3 0 100-6 3 3 0 000 6z" />
                    <path d="M12 13c-4.418 0-8 2.239-8 5v2h16v-2c0-2.761-3.582-5-8-5z" />
                    </svg>
                    匿名性とプライバシー配慮
                </li>
                <li className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 py-2 shadow-sm backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path d="M3 12l2-2 4 4L19 6l2 2-12 12-4-4z" />
                    </svg>
                    取材同意と編集ガイドライン
                </li>
                </ul> */}

                {/* sub note */}
                {/* <p className="mt-4 max-w-2xl text-[12px] leading-5 text-neutral-200">
                ※ インタビューは本人同意のうえ、匿名加工（音声・映像の加工/伏字）を行っています。内容は編集方針に基づき、過度な扇情表現を排しています。
                </p> */}
            </div>
           <div className="relative flex md:w-1/3 md:h-full w-full h-40"> {/* ← 高さ必須 */}
            <Image
                src="https://lastdecade.s3.ap-northeast-1.amazonaws.com/Last_Decade_logo_transparent_bgmask_600w.png"
                alt="LastDecade Hero Visual"
                fill
                className="rounded-2xl shadow-lg object-contain justify-start"
            />
            </div>
            </div>
      </section>

  );
}
