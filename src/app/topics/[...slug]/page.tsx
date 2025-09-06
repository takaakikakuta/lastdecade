// app/manual/[...slug]/page.tsx
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Header from "@/components/Header";
import CalloutList from "@/components/CalloutList";
import AppCompareTable from "@/components/AppCompareTable";
import Image from "next/image";
import Link from "next/link";
import CleanOjiAffiliateCard from "@/components/adComponent/CleanOjiAffiliateCard";
import InlineToc from "@/components/InlineToc";
import ManualSectionsSidebar from "@/components/ManualSectionsSidebar";
import { ServiceCard } from "@/components/app/LoveanComponent"; 
import RelatedArticles from "@/components/RelatedArticles";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "topics");

export async function generateStaticParams() {
  const walk = (dir: string, parent: string[] = []): { slug: string[] }[] => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).flatMap((file) => {
      const fullPath = path.join(dir, file);
      const rel = [...parent, file.replace(/\.mdx$/, "")];

      if (fs.statSync(fullPath).isDirectory()) {
        return walk(fullPath, rel);
      }
      if (file.endsWith(".mdx")) {
        return [{ slug: rel }];
      }
      return [];
    });
  };
  return walk(CONTENT_DIR);
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug: slugArray } = await params;

  const filePath = path.join(CONTENT_DIR, ...slugArray) + ".mdx";
  if (!fs.existsSync(filePath)) return notFound();

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const { content: mdxContent } = await compileMDX({
    source: content,
    components: { 
      CalloutList, 
      AppCompareTable, 
      InlineToc, 
      CleanOjiAffiliateCard,  
      ServiceCard, 
      Image, 
      Link,
      RelatedArticles 
    },
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
            <time className="block text-sm text-zinc-500 mt-1">{data.date}</time>
          )}

          {/* ✅ 全記事でPR表記を表示 */}
          <div
            className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
            role="note"
            aria-label="PR disclosure"
          >
            ※本記事にはPR（アフィリエイトリンク）が含まれています。
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <article className="prose prose-zinc max-w-none lg:col-span-2">{mdxContent}</article>
          <ManualSectionsSidebar />
        </div>
      </div>
    </>
  );
}
