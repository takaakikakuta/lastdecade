// app/(site)/page.tsx など：ホーム（Server Component 前提）
import path from "node:path";
import fs from "node:fs/promises";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Interview, { InterviewItem } from "@/components/Interview";
import Guide from "@/components/Guide";
import { getAllPostsMeta } from "@/lib/mdx";
import MiniFooter from "@/components/Footer";

export const dynamic = "force-static";
export const revalidate = 3600; // topics.jsonを1時間ごとに取り直す

// topics.jsonの型（必要なら共通型に寄せてもOK）
type TopicPost = {
  slug: string;
  title: string;
  cover?: string;
  date?: string;
};

type InterViewPost = {
  slug: string;
  title: string;
  thumbnail?: string;
  date?: string;
};

// ★ このホーム用にローダーを用意（loadPostsの代わり）
async function loadTopicPosts(): Promise<TopicPost[]> {
  const file = path.join(process.cwd(), "public", "topics.json");
  try {
    const buf = await fs.readFile(file, "utf-8");
    const data = JSON.parse(buf) as unknown;
    if (!Array.isArray(data)) return [];
    // 新しい順
    return [...(data as TopicPost[])].sort((a, b) => {
      const ta = a.date ? +new Date(a.date) : 0;
      const tb = b.date ? +new Date(b.date) : 0;
      return tb - ta;
    });
  } catch {
    return [];
  }
}

async function loadInterviewPosts(): Promise<InterViewPost[]> {
  const file = path.join(process.cwd(), "public", "interviews.json");
  try {
    const buf = await fs.readFile(file, "utf-8");
    const data = JSON.parse(buf) as unknown;
    if (!Array.isArray(data)) return [];
    // 新しい順
    return [...(data as TopicPost[])].sort((a, b) => {
      const ta = a.date ? +new Date(a.date) : 0;
      const tb = b.date ? +new Date(b.date) : 0;
      return tb - ta;
    });
  } catch {
    return [];
  }
}

const PLACEHOLDER = "/images/placeholder-16x9.jpg";

export default async function HomePage() {
  // 既存MDX側（必要ならそのまま）
  const posts = getAllPostsMeta();
  const [_featured, ...rest] = posts;
  const latest = rest.slice(0, 6); // 未使用なら削除OK

  // ★ ここで topics.json を取得して Guide 用データに変換
  const topics = await loadTopicPosts();
  const guideItems: InterviewItem[] = topics.slice(0, 4).map((p) => ({
    slug: p.slug,
    title: p.title,
    thumbnail: p.cover ?? PLACEHOLDER,
    date: p.date ?? "",
  }));

  const interviews = await loadInterviewPosts();
  const interviewItems: InterviewItem[] = interviews.slice(0, 4).map((p) => ({
    slug: p.slug,
    title: p.title,
    thumbnail: p.thumbnail ?? PLACEHOLDER,
    date: p.date ?? "",
  }));  

  return (
    <>
      <Header />
      <Hero />
      <Interview items={interviewItems} />
      <Guide items={guideItems} />
      <MiniFooter/>
    </>
  );
}
