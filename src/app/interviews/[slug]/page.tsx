// app/interviews/[slug]/page.tsx
import path from "node:path";
import fs from "node:fs/promises";
import { notFound } from "next/navigation";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import MiniFooter from "@/components/Footer";

export const revalidate = 3600;

type Post = {
  slug: string;
  title?: string;
  video?: string;
  thumbnail?: string;
};

async function loadAll(): Promise<Post[]> {
  const file = path.join(process.cwd(), "public", "interviews.json");
  try {
    const buf = await fs.readFile(file, "utf-8");
    const list = JSON.parse(buf) as unknown;
    return Array.isArray(list) ? (list as Post[]) : [];
  } catch {
    return [];
  }
}

async function loadBySlug(slug: string): Promise<Post | null> {
  const all = await loadAll();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function generateStaticParams() {
  const posts = await loadAll();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await loadBySlug(slug);
  if (!post) return {};
  const title = post.title ?? "Interview";
  const img = post.thumbnail ?? "/images/placeholder-16x9.jpg";
  return {
    title,
    openGraph: { title, images: [{ url: img }] },
    twitter: { card: "summary_large_image", title, images: [img] },
  };
}

type SP = Record<string, string | string[] | undefined>;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<SP>;
}) {
  const { slug } = await params;
  const sp = (await searchParams) ?? {};
  const tStr = (Array.isArray(sp.t) ? sp.t[0] : sp.t) ?? "0";
  const startAt = Math.max(0, parseInt(tStr, 10) || 0);

  const post = await loadBySlug(slug);
  if (!post || !post.video) notFound();

  const videoSrc = startAt > 0 ? `${post.video}#t=${startAt}` : post.video;

  return (
    <>
    <Header />
    <main className="container mx-auto px-4 py-8">
      {post.title && (
        <h1 className="mb-4 text-2xl font-semibold">{post.title}</h1>
      )}

      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* メイン（動画） */}
        <div className="w-full md:w-2/3">
          <video
            key={videoSrc}
            className="w-full rounded-lg border"
            src={videoSrc}
            poster={post.thumbnail}
            controls
            playsInline
            preload="metadata"
          />
        </div>

        {/* サイドバー */}
        <SideBar className="hidden md:block md:w-1/3 mt-6 md:mt-0" />
      </div>
    </main>
    <MiniFooter/>
    </>
  );
}
