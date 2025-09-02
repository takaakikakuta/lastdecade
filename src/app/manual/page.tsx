import Header from '@/components/Header'
import React from 'react'
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Link from "next/link";
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Image from 'next/image';
import SideBar from '@/components/SideBar';

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "articles");

// content/articles 配下から記事一覧を読み込む（サブディレクトリ対応）
function getArticles() {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const walk = (dir: string, base = ""): any[] => {
    return fs.readdirSync(dir).flatMap((file) => {
      const full = path.join(dir, file);
      const rel = path.join(base, file);
      if (fs.statSync(full).isDirectory()) {
        return walk(full, rel);
      }
      if (file.endsWith(".mdx")) {
        const raw = fs.readFileSync(full, "utf-8");
        const { data } = matter(raw);
        return [
          {
            slug: rel.replace(/\\.mdx$/, ""),
            title: data.title || file.replace(/\\.mdx$/, ""),
            excerpt: data.excerpt || "",
            date: data.date || "",
          },
        ];
      }
      return [];
    });
  };

  return walk(CONTENT_DIR).sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
}
type Item = { label: string; href: string; desc?: string; img?: string };
type Section = { title: string; items: Item[] };

const READY: Section = {
  title: "準備・自己投資",
  items: [
    {
      label: "はじめに",
      href: "/manual/prep_start",
      desc: "清潔感アップの最短ルートとおすすめ基礎ケア",
      img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/prep_start4.png",
    },
    {
      label: "スキンケアの基本",
      href: "/manual/prep_skincare",
      desc: "清潔感アップの最短ルートとおすすめ基礎ケア",
      img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/prep_skincare/prep_skincare_0.png",
    },
    {
      label: "痩せる（減量）",
      href: "/manual/prep_weight-loss",
      desc: "食事管理・運動・メディカル活用の基礎",
      img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/prep_weight_loss/prep_weight_loss_1.png",
    },
    {
      label: "メンズ脱毛の選び方",
      href: "/manual/prep_hair-removal",
      desc: "医療/サロンの違い・部位別の目安・申込み前チェック",
      img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/prep_hair_removal/prep_hair_removal_1.png",
    },
    {
      label: "匂いケア",
      href: "/manual/prep_smell-care",
      desc: "体臭・口臭・加齢臭の対策と香水の使い方",
      img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/prep_smell_care/prep_smell_care_1.png",
    },
    {
      label: "AGA対策の基礎",
      href: "/manual/prep_aga",
      desc: "オンライン診療/外用/内服の違いと始め方",
      img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/prep_aga/prep_aga_1.png",
    },
    {
      label: "服装の基本",
      href: "/manual/plus_fashion",
      desc: "シンプルで清潔感のあるコーディネートの作り方",
      img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/plus_fashion/plus_fashion_1.png",
    },
    {
      label: "やれば差がつく＋α領域：筋トレとホワイトニング",
      href: "/manual/plus_alpha",
      desc: "さらに上を目指すなら筋トレとホワイトニング。",
      img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/plus_alpha/plus_alpha_1.png",
    },
  ],
};

const SECTIONS: Section[] = [
  {
    title: "入門・基本",
    items: [
      { label: "パパ活とは？", href: "/manual/papakatsu-what-is", desc: "男性視点の基礎知識と目的" ,img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-what-is/papakatsu-what-is_1.png"},
      { label: "始める前に知ること", href: "/manual/papakatsu-before-start", desc: "年齢確認・法律・リスク",img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-before-start/papakatsu-before-start_1.png" },
    ],
  },
  {
    title: "出会い方",
    items: [
      { label: "アプリの選び方", href: "/manual/papakatsu-how-to-meet_apps", desc: "主要アプリの比較と注意点", img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-how-to-meet_apps/papakatsu-how-to-meet_apps_1.png" },
      { label: "プロフィール作成", href: "/manual/papakatsu-how-to-meet_profile", desc: "写真・自己紹介・NG例" , img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-how-to-meet_profile/papakatsu-how-to-meet_profile_1.png"},
      { label: "初回メッセージ術", href: "/manual/papakatsu-how-to-meet_message", desc: "テンプレと見極めポイント",img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-how-to-meet_message/papakatsu-how-to-meet_message_1.png" },
    ],
  },
  {
    title: "初めてのデート",
    items: [
      { label: "安全な待ち合わせ場所", href: "/manual/papakatsu-first-date_meeting-place", desc: "カフェ・ホテルラウンジの選び方",img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-first-date_meeting-place/papakatsu-first-date_meeting-place_1.png" },
      { label: "初回に話すこと", href: "/manual/papakatsu-first-date_first-talk", desc: "条件・希望・頻度・支払い",img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-first-date_first-talk/papakatsu-first-date_first-talk_1.png" },
      { label: "会話のマナー", href: "/manual/papakatsu-first-date_conversation-tips", desc: "安心感を与える言動" ,img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-first-date_conversation-tips/papakatsu-first-date_conversation-tips_1.png"},
    ],
  },
  {
    title: "お金・相場",
    items: [
      { label: "お手当の相場感", href: "/manual/papakatsu-allowance", desc: "食事・デート・継続の目安",img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-allowance/papakatsu-allowance_1.png" },
      { label: "支払い方法とトラブル回避", href: "/manual/papakatsu-allowance_payment", desc: "現金・電子マネー・禁じ手" ,img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-allowance_payment/papakatsu-allowance_payment_1.png" },
      { label: "継続契約の設計", href: "/manual/papakatsu-allowance_retainer", desc: "頻度・条件・更新ルール" ,img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-allowance_retainer/papakatsu-allowance_retainer_1.png" },
    ],
  },
  {
    title: "安全・法務",
    items: [
      { label: "トラブル事例と対策", href: "/manual/papakatsu-safety_cases", desc: "詐欺・ドタキャン・晒し",img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-safety_cases/papakatsu-safety_cases_1.png"  },
      { label: "個人情報の守り方", href: "/manual/papakatsu-safety_privacy", desc: "連絡手段・実名/住所の扱い" ,img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-safety_privacy/papakatsu-safety_privacy_1.png" },
      { label: "法律に抵触しないために", href: "/manual/papakatsu-legal_basics", desc: "未成年・各種法令の基礎" ,img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-legal_basics/papakatsu-legal_basics_1.png" },
    ],
  },
  {
    title: "継続のコツ",
    items: [
      { label: "選ばれるパパの条件", href: "/manual/papakatsu-manners_liked-dad", desc: "清潔感・会話力・余裕", img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-manners_liked-dad/papakatsu-manners_liked-dad_1.png"},
      { label: "関係を長く続ける運用", href: "/manual/papakatsu-manners_ops", desc: "ルール・連絡頻度・評価", img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-manners_ops/papakatsu-manners_ops_1.png" },
      { label: "関係終了のスマートな方法", href: "/manual/papakatsu-manners_closure", desc: "自然な別れ方・角が立たない終わり方", img: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/guide/papakatsu-manners_closure/papakatsu-manners_closure_1.png" }
    ],
  },
];

function Thumb({ src, alt }: { src?: string; alt: string }) {
  // 画像未設定なら丸アイコンのプレースホルダー
  if (!src) {
    return (
      <div className="h-24 w-24 shrink-0 rounded-xl border border-zinc-200 bg-zinc-50/60 grid place-items-center">
        <span className="h-2 w-2 rounded-full bg-zinc-400 inline-block" />
      </div>
    );
  }
  return (
    <div className="relative w-full h-40 overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <Image src={src} alt={alt} fill className="object-contain" />
    </div>
  );
}

// ...importsはそのまま

export default function Page() {
  const articles = getArticles();
  const recent = articles.slice(0, 6);
  const popular = [...articles]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0) || +new Date(b.date || 0) - +new Date(a.date || 0))
    .slice(0, 6);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs baseHref="/manual" className="mb-4" />

        {/* スマホ1カラム / LG以上で本文2/3 + サイド1/3 */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ------ メイン（2/3） ------ */}
          <article className="prose prose-zinc max-w-none lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">パパ活実践ガイド</h1>
            <p className="mb-8 text-zinc-600">
              パパ活初心者がまず読むべき基本知識と実践ステップをまとめました。各項目をクリックすると詳細記事に移動できます。
            </p>

            <section className="not-prose rounded-2xl border bg-white p-5 shadow-sm my-6">
            <h2 className="text-xl font-semibold mb-3">準備編 パパ活を楽しむために</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-0">
              {READY.items.map((item) => (
                <li key={item.href} className="py-2">
                  <Link href={item.href} className="block no-underline group" prefetch>
                    <div className="flex flex-col">
                      <Thumb
                        src={item.img}
                        alt={item.label}
                      />
                      {/* <span className="font-medium">{item.label}</span> */}
                      {item.desc && (
                        <p className="text-sm text-zinc-500 line-clamp-2 mt-1">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

           <div className="grid gap-6 xl:grid-cols-2">
              {SECTIONS.map((sec) => (
                <section
                  key={sec.title}
                  className="rounded-2xl border bg-white px-5 py-5 shadow-sm not-prose"
                >
                  <h2 className="text-xl font-semibold my-0">{sec.title}</h2>
                  <ul className="grid gap-4 mt-3">
                    {sec.items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="block no-underline group" prefetch>
                          <div className="flex flex-col">
                            <Thumb src={item.img} alt={item.label} />
                            {item.desc && (
                              <p className="text-sm text-zinc-500 line-clamp-2 mt-1">
                                {item.desc}
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>

          {/* ------ サイドバー（1/3） ------ */}
          <SideBar
            className="lg:col-span-1 lg:sticky lg:top-20 self-start"
          />
        </div>
      </main>
    </>
  );
}

