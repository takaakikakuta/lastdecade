// components/RelatedArticle.tsx
import Link from "next/link";
import Image from "next/image";
import { getPostMetaBySlug } from "@/lib/mdx";

type RelatedArticleProps = {
  slug: string;
  title?: string;
  className?: string;
  basePath?: "topics" | "manual"; // ✅ 追加
};

export default function RelatedArticle({
  slug,
  title = "関連記事",
  className = "",
  basePath = "topics", // デフォルトを topics に
}: RelatedArticleProps) {
  const p = getPostMetaBySlug(slug);
  if (!p) return null;

  return (
    <section
      className={`rounded-2xl border-zinc-200 bg-white ${className}`}
    >
      <h2 className="mb-4 text-lg font-semibold tracking-tight">{title}</h2>

      <Link
        href={`/${basePath}/${slug}`} // ✅ basePathを利用
        className="group flex gap-3 rounded-xl border border-zinc-200 p-3 transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
          {p.thumbnail ? (
            <Image
              src={p.thumbnail}
              alt={p.title}
              fill
              sizes="112px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
        </div>

        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900">
            {p.title}
          </h3>
          {p.date && <div className="mt-1 text-xs text-zinc-500">{p.date}</div>}
          {p.excerpt && (
            <p className="mt-1 line-clamp-2 text-xs text-zinc-600">
              {p.excerpt}
            </p>
          )}
          {p.tags?.length ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {p.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] text-zinc-600"
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </section>
  );
}
