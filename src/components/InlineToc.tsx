"use client";

import { useEffect, useMemo, useState } from "react";

type Accent = "sky" | "cyan" | "emerald" | "blue";
type Heading = { id: string; text: string; level: 2 | 3; index: number };

type Props = {
  title?: string;
  /** 固定ヘッダー分ずらす */
  scrollOffset?: number;
  /** 配色 */
  accent?: Accent;
  /** 目次対象ルート（無い場合は body） */
  rootSelector?: string;
};

export default function InlineToc({
  title = "Contents",
  scrollOffset = 72,
  accent = "sky",
  rootSelector = "[data-article-root]",
}: Props) {
  const [heads, setHeads] = useState<Heading[]>([]);
  const [active, setActive] = useState<string | null>(null);

  const color = {
    sky:     { border: "border-sky-300", ring: "ring-sky-100", title: "text-sky-600", hr: "border-sky-200", dot: "bg-sky-500" },
    cyan:    { border: "border-cyan-300", ring: "ring-cyan-100", title: "text-cyan-600", hr: "border-cyan-200", dot: "bg-cyan-500" },
    emerald: { border: "border-emerald-300", ring: "ring-emerald-100", title: "text-emerald-600", hr: "border-emerald-200", dot: "bg-emerald-500" },
    blue:    { border: "border-blue-300", ring: "ring-blue-100", title: "text-blue-600", hr: "border-blue-200", dot: "bg-blue-500" },
  }[accent];

  const getRoot = () =>
    (document.querySelector(rootSelector) as HTMLElement | null) ?? document.body;

  // 見出し収集（ID付与・scroll-margin 設定）
  useEffect(() => {
    const root = getRoot();
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("h2, h3"));
    const slugify = (s: string) =>
      s
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-ぁ-んァ-ン一-龥]/g, "")
        .replace(/\-+/g, "-");

    const list: Heading[] = [];
    nodes.forEach((el, i) => {
      const level = el.tagName.toLowerCase() === "h2" ? 2 : (3 as 3);
      const text = (el.textContent ?? "").trim();
      if (!text) return;

      if (!el.id) {
        const base = slugify(text) || "section";
        let id = base;
        let n = 2;
        while (document.getElementById(id)) id = `${base}-${n++}`;
        el.id = id;
      }

      // スクロール時の被り対策
      el.style.scrollMarginTop = `${scrollOffset + 8}px`;
      list.push({ id: el.id, text, level, index: i });
    });

    setHeads(list);
  }, [rootSelector, scrollOffset]);

  // 現在地ハイライト（IntersectionObserver）
  useEffect(() => {
    const root = getRoot();
    if (!root || heads.length === 0) return;

    const targets = heads
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as Element[];

    const io = new IntersectionObserver(
      (entries) => {
        // 画面上に見えている順にソートして先頭を active に
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).getBoundingClientRect().top -
              (b.target as HTMLElement).getBoundingClientRect().top
          );
        if (vis[0]) setActive((vis[0].target as HTMLElement).id);
        // もし何も可視でなければ、スクロール位置に近い先頭の h2/h3 を推測
        if (vis.length === 0) {
          const y = window.scrollY + scrollOffset + 16;
          let fallback: string | null = null;
          for (const h of heads) {
            const el = document.getElementById(h.id);
            if (!el) continue;
            const top = el.offsetTop;
            if (top <= y) fallback = h.id;
            else break;
          }
          if (fallback) setActive(fallback);
        }
      },
      {
        // 上部はオフセット分広げ、下は60%で抜けたら次を拾う
        rootMargin: `-${scrollOffset + 8}px 0px -60% 0px`,
        threshold: 0.1,
      }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [heads, rootSelector, scrollOffset]);

  // h2に番号を振る（必要ならUIに活用できる）
  const numbered = useMemo(() => {
    let n = 0;
    return heads.map((h) => ({ ...h, no: h.level === 2 ? ++n : undefined }));
  }, [heads]);

  // スムーススクロール
  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  if (numbered.length === 0) return null;

  return (
    <aside className={`rounded-xl border-2 ${color.border} bg-white ring-1 ${color.ring} p-4 md:p-2`}>
      <div className="text-center">
        <div className={`text-xl md:text-2xl font-semibold ${color.title}`}>{title}</div>
        <div className={`mt-3 border-b ${color.hr}`} />
      </div>

      <nav className="mt-2 md:mt-4" aria-label="Table of contents">
        <ol className="space-y-0">
          {numbered
            .filter((h) => h.level === 2)
            .map((h2) => {
              // 親 h2 の次の位置から、次の h2 直前までを「その子範囲」として切る（元配列 heads 基準）
              const start = heads.findIndex((x) => x.id === h2.id) + 1;
              const nextH2 = heads.findIndex((x, i) => i >= start && x.level === 2);
              const end = nextH2 === -1 ? heads.length : nextH2;
              const children = heads.slice(start, end).filter((x) => x.level === 3);

              return (
                <li key={h2.id}>
                  <a
                    href={`#${h2.id}`}
                    onClick={jump(h2.id)}
                    className="flex items-start gap-3 group"
                  >
                    <span
                      className={`leading-relaxed underline-offset-4 group-hover:underline ${
                        active === h2.id ? "text-zinc-900" : "text-zinc-700"
                      }`}
                    >
                      {h2.text}
                    </span>
                  </a>

                  {children.length > 0 && (
                    <ul className="mt-2 ml-9 space-y-1.5">
                      {children.map((h3) => (
                        <li key={h3.id}>
                          <a
                            href={`#${h3.id}`}
                            onClick={jump(h3.id)}
                            className={`inline-flex items-start gap-2 ${
                              active === h3.id ? "text-zinc-900" : "text-zinc-700"
                            }`}
                          >
                            <span className={`mt-2 h-1.5 w-1.5 rounded-full ${color.dot}`} />
                            <span className="underline-offset-4 hover:underline">{h3.text}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
        </ol>
      </nav>
    </aside>
  );
}
