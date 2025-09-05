import Image from "next/image";
import path from "node:path";
import fs from "node:fs/promises";
import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import VideoWithCTAs from "./video-with-ctas";
import Header from "@/components/Header";

export const revalidate = 3600; // 一覧と揃える

// ===== Types =====
type AffiliateCTA = {
  label: string;
  href: string;
  start?: number; // 秒
  end?: number;   // 秒（省略時は動画末尾まで）
};

export type InterviewPost = {
  slug: string;
  title: string;
  excerpt?: string;
  thumbnail?: string;
  video?: string;
  date?: string;
  tags?: string[];
  category?: string;
  author?: string;
  ctas?: AffiliateCTA[];
};

// ===== Data loader =====
async function loadAll(): Promise<InterviewPost[]> {
  const file = path.join(process.cwd(), "public", "interviews.json");
  try {
    const buf = await fs.readFile(file, "utf-8");
    const data = JSON.parse(buf) as unknown;
    if (!Array.isArray(data)) return [];
    // 念のため日付降順
    return [...(data as InterviewPost[])].sort((a, b) => {
      const ta = a.date ? +new Date(a.date) : 0;
      const tb = b.date ? +new Date(b.date) : 0;
      return tb - ta;
    });
  } catch {
    return [];
  }
}

async function loadBySlug(slug: string): Promise<InterviewPost | null> {
  const list = await loadAll();
  return list.find((p) => p.slug === slug) ?? null;
}

// ===== SSG: 動的ルートの事前生成（任意） =====
export async function generateStaticParams() {
  const posts = await loadAll();
  return posts.map((p) => ({ slug: p.slug }));
}

// ===== SEO =====
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await loadBySlug(params.slug);
  if (!post) return {};
  const title = post.title ? `${post.title} | インタビュー` : "インタビュー";
  const desc = post.excerpt ?? "インタビュー";
  const img = post.thumbnail ?? "/images/placeholder-16x9.jpg";
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: [{ url: img }],
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [img],
    },
  };
}

// ===== Client: Video + CTA overlay =====

type SP = { t?: string };

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  // Next.js 15 では searchParams が Promise
  searchParams?: Promise<SP>;
}) {
  const sp = (await searchParams) ?? {};
  const startAt = Math.max(0, parseInt(sp.t ?? "0", 10) || 0);

  const post = await loadBySlug(params.slug);
  if (!post || !post.video) {
    notFound();
  }

  const dt = post.date ? new Date(post.date) : null;

  return (
    <>
    <Header/>
    <main className="mx-auto container px-4 py-8">
      <nav className="mb-4 text-sm text-neutral-600">
        <Link href="/interviews" className="underline underline-offset-4 hover:text-neutral-900">
          ← インタビュー一覧へ戻る
        </Link>
      </nav>

      <header className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          {post.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
          {post.category && (
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
              {post.category}
            </span>
          )}
          {dt && (
            <time dateTime={dt.toISOString()} className="text-[12px] text-neutral-500">
              {new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(dt)}
            </time>
          )}
        </div>
        {post.excerpt && <p className="mt-3 text-neutral-700">{post.excerpt}</p>}
      </header>

      {/* 動画＋時間連動CTA */}
      <div className="mb-8">
        <VideoWithCTAs
          src={post.video!}
          poster={post.thumbnail}
          ctas={post.ctas ?? []}
          startAt={startAt}
        />
      </div>

      {/* タグなど（任意） */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-neutral-800">タグ</h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-700"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}
    </main>
    </>
  );
}
