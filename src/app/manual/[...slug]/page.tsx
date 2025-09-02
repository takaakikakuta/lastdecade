// app/manual/[...slug]/page.tsx  ← キャッチオール
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Header from "@/components/Header";
import InlineToc from "@/components/InlineToc";

// 記事格納ディレクトリ
const CONTENT_DIR = path.join(process.cwd(), "src", "content", "articles");

// 動的パス生成（サブディレクトリ対応）
export async function generateStaticParams() {
  const walk = (dir: string, parent: string[] = []): { slug: string[] }[] => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).flatMap((file) => {
      const fullPath = path.join(dir, file);
      const rel = [...parent, file.replace(/\.mdx$/, "")];

      if (fs.statSync(fullPath).isDirectory()) {
        return walk(fullPath, rel); // 階層を深掘り
      }
      if (file.endsWith(".mdx")) {
        return [{ slug: rel }]; // [...slug] なので配列でOK
      }
      return [];
    });
  };
  return walk(CONTENT_DIR);
}

// ページ本体
export default async function ArticlePage({
  params,
}: {
  // ★ Next.js 15: params は Promise
  params: Promise<{ slug: string[] }>;
}) {
  const { slug: slugArray } = await params; // ← ここを await する

  // ✅ 配列を join してファイルパスを作る
  const filePath = path.join(CONTENT_DIR, ...slugArray) + ".mdx";
  if (!fs.existsSync(filePath)) return notFound();

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  // MDXコンパイル
  const { content: mdxContent } = await compileMDX({
    source: content,
    components: { InlineToc }, // MDX内で <InlineToc /> を使えるようにする
    options: { parseFrontmatter: false },
  });

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs baseHref="/" className="mb-4" />

        <header className="mb-6">
          <h1 className="text-3xl font-bold">
            {typeof data?.title === "string" ? data.title : slugArray.at(-1)}
          </h1>
          {typeof data?.date === "string" && (
            <time className="mt-1 block text-sm text-zinc-500">{data.date}</time>
          )}
        </header>

        {/* ✅ prose の内側に MDX 本文（React要素）をそのまま差し込む */}
        <article className="prose prose-zinc max-w-none">{mdxContent}</article>
      </div>
    </>
  );
}
