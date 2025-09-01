"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, memo } from "react";

/**
 * パンくずコンポーネント
 * - 明示 items 指定 or 現在の URL から自動生成
 * - 使い方（例）
 *   <Breadcrumbs baseHref="/articles" />
 *   <Breadcrumbs items={[{ href: "/", label: "HOME" }, { href: "/articles", label: "入門まとめ" }, { label: "会話のマナー" }]} />
 */
export type CrumbItem = {
  label: string;
  href?: string; // 最後の要素（現在地）は href 省略
};

export function Breadcrumbs({
  items,
  baseHref = "/",
  homeLabel = "HOME",
  className = "",
}: {
  items?: CrumbItem[];
  baseHref?: string; // 自動生成時、ここを起点にする（例: "/articles"）
  homeLabel?: string;
  className?: string;
}) {
  const pathname = usePathname();

  // items が無ければ URL から自動生成
  const autoItems: CrumbItem[] = (() => {
    if (items && items.length) return items;
    const parts = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);

    // baseHref が "/articles" の場合、/articles より後ろのスラッグだけを使う
    const base = baseHref.replace(/\/$/, "").replace(/^\/$/, "");
    const baseParts = base ? base.split("/").filter(Boolean) : [];

    const startIndex = baseParts.length > 0 ? baseParts.length : 0;

    const built: CrumbItem[] = [];
    // 先頭に HOME を付ける
    built.push({ href: "/", label: homeLabel });

    // baseHref がある場合はそれ自体を 2 番目に
    if (base) {
      built.push({ href: `/${base}`, label: labelize(baseParts[baseParts.length - 1] || base) });
    }

    // スラッグの各階層を追加
    const slugs = parts.slice(startIndex);
    let acc = base ? `/${base}` : "";
    slugs.forEach((seg, i) => {
      acc += `/${seg}`;
      const isLast = i === slugs.length - 1;
      built.push({ label: labelize(seg), href: isLast ? undefined : acc });
    });
    return built;
  })();

  const list = autoItems;

  return (
    <nav aria-label="Breadcrumb" className={"w-full" + (className ? ` ${className}` : "") }>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-500">
        {list.map((item, idx) => (
          <Fragment key={`${item.label}-${idx}`}>
            {idx > 0 && (
              <span className="select-none text-zinc-400">/</span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="transition hover:text-zinc-800 underline-offset-4 hover:underline"
                prefetch
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-zinc-800 font-medium" aria-current="page">{item.label}</span>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

// スラッグを見出し風に
function labelize(seg: string) {
  try {
    // デコードし、ハイフン/アンダースコアを空白に
    const decoded = decodeURIComponent(seg);
    return decoded.replace(/[-_]/g, " ").replace(/\b([a-z])/g, (m) => m.toUpperCase());
  } catch {
    return seg;
  }
}

export default memo(Breadcrumbs);
