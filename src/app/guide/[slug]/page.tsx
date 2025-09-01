// src/app/guide/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import Header from "@/components/Header";
import { getGuideSourceBySlug } from "@/lib/mdx";

import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

type GuideFrontmatter = {
  title: string;
  date?: string;
  cover?: string;
  tags?: string[];
  category?: string;
  excerpt?: string;
  author?: string;
};

const mdxComponents = {
  // MDX内で使うReactコンポーネントを登録したい場合はここに
};

export default async function GuideDetailPage({
  // Next.jsのAsync Dynamic APIsに対応
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const source = getGuideSourceBySlug(slug);
  if (!source) return notFound();

  const { content: mdxBody, data } = matter(source);
  const fm = data as GuideFrontmatter;

  const { content } = await compileMDX<GuideFrontmatter>({
    source: mdxBody,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
      },
    },
    components: mdxComponents,
  });  

  return (
    <>
      <Header />
      <main className="mx-auto max-w-screen-md px-4 py-12">
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{fm.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
          {fm.category && (
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-700">
              {fm.category}
            </span>
          )}
          {fm.date && (
            <time dateTime={fm.date}>
              {new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(fm.date))}
            </time>
          )}
          {fm.author && <span>by {fm.author}</span>}
        </div>

        {fm.cover && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl">
            <Image src={fm.cover} alt={fm.title} fill className="object-cover" />
          </div>
        )}

        {/* Markdownの装飾（Tailwind Typography） */}
        <article className="prose-neutral mt-6 max-w-none">
          {content}
        </article>

        {fm.tags?.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {fm.tags.map((t) => (
              <span key={t} className="rounded-md bg-neutral-100 px-2 py-0.5 text-sm text-neutral-700">
                #{t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-10">
          <Link href="/guides" className="text-sm text-neutral-700 underline">
            ← 実践ガイド一覧へ戻る
          </Link>
        </div>
      </main>
    </>
  );
}
