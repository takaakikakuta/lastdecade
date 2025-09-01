import Link from "next/link";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  category?: string;
};

export default function ArticleCard({ post }: { post: PostMeta }) {
  return (
    <article className="group rounded-2xl border border-white/10 p-5 transition hover:border-white/20">
      <div className="text-xs uppercase tracking-wider opacity-60">{post.category}</div>
      <h3 className="mt-1 text-lg font-semibold">
        <Link href={`/articles/${post.slug}`} className="underline-offset-4 group-hover:underline">
          {post.title}
        </Link>
      </h3>
      <div className="mt-2 text-sm opacity-70">{post.excerpt}</div>
      <div className="mt-3 text-xs opacity-60">{new Date(post.date).toLocaleDateString("ja-JP")}</div>
      {post.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map(t => (
            <span key={t} className="rounded bg-white/10 px-2 py-0.5 text-xs">#{t}</span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
