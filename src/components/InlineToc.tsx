"use client";

import { useEffect, useMemo, useState } from "react";

type Heading = { id: string; text: string; level: 2 | 3 };

export default function InlineToc({
  title = "Contents",
  scrollOffset = 72,          // 固定ヘッダー分ずらす
  accent = "sky",             // "sky" | "cyan" | "emerald" | "blue"
}: {
  title?: string;
  scrollOffset?: number;
  accent?: "sky" | "cyan" | "emerald" | "blue";
}) {
  const [heads, setHeads] = useState<Heading[]>([]);
  const [active, setActive] = useState<string | null>(null);

  const color = {
    sky:     { border: "border-sky-300", ring: "ring-sky-100", title: "text-sky-600", hr: "border-sky-200", dot: "bg-sky-500" },
    cyan:    { border: "border-cyan-300", ring: "ring-cyan-100", title: "text-cyan-600", hr: "border-cyan-200", dot: "bg-cyan-500" },
    emerald: { border: "border-emerald-300", ring: "ring-emerald-100", title: "text-emerald-600", hr: "border-emerald-200", dot: "bg-emerald-500" },
    blue:    { border: "border-blue-300", ring: "ring-blue-100", title: "text-blue-600", hr: "border-blue-200", dot: "bg-blue-500" },
  }[accent];

  // 記事ルート（page.tsx側で data-article-root を付ける）
  const getRoot = () =>
    (document.querySelector("[data-article-root]") as HTMLElement | null) ?? document.body;

  // 見出しを収集（h2/h3）。IDがなければ付与 & scroll-margin 設定
  useEffect(() => {
    const root = getRoot();
    if (!root) return;

    const hs = Array.from(root.querySelectorAll("h2, h3")) as HTMLElement[];
    const list: Heading[] = [];
    const slug = (s: string) =>
      s
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-ぁ-んァ-ン一-龥]/g, "")
        .replace(/\-+/g, "-");

    hs.forEach((el) => {
      const level = el.tagName.toLowerCase() === "h2" ? 2 : (3 as 3);
      const text = (el.textContent ?? "").trim();
      if (!text) return;
      if (!el.id) {
        const base = slug(text) || "section";
        let id = base;
        let i = 2;
        while (document.getElementById(id)) id = `${base}-${i++}`;
        el.id = id;
      }
      el.style.scrollMarginTop = `${scrollOffset + 8}px`;
      list.push({ id: el.id, text, level });
    });

    setHeads(list);
  }, [scrollOffset]);

  // 現在地ハイライト
  useEffect(() => {
    const root = getRoot();
    if (!root) return;
    const targets = Array.from(root.querySelectorAll("h2, h3")) as HTMLElement[];

    const io = new IntersectionObserver(
      (ents) => {
        const v = ents
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        if (v[0]) setActive((v[0].target as HTMLElement).id);
      },
      { rootMargin: `-${scrollOffset + 4}px 0px -70% 0px`, threshold: [0, 1] }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [scrollOffset, heads.length]);

  // h2だけ番号付け、h3はドット
  const numbered = useMemo(() => {
    let n = 0;
    return heads.map((h) => ({ ...h, no: h.level === 2 ? ++n : undefined }));
  }, [heads]);

  const j = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  if (numbered.length === 0) return null;

  return (
    <aside className={`rounded-xl border-2 ${color.border} bg-white ring-1 ${color.ring} p-4 md:p-5`}>
      <div className="text-center">
        <div className={`text-xl md:text-2xl font-semibold ${color.title}`}>{title}</div>
        <div className={`mt-3 border-b ${color.hr}`} />
      </div>

      <nav className="mt-3 md:mt-4">
        <ol className="space-y-3">
          {numbered
            .filter((h) => h.level === 2)
            .map((h2) => (
              <li key={h2.id}>
                <a href={`#${h2.id}`} onClick={j(h2.id)} className="flex items-start gap-3 group">
                  <span className={`leading-relaxed underline-offset-4 group-hover:underline ${active === h2.id ? "text-zinc-900" : "text-zinc-700"}`}>
                    {h2.text}
                  </span>
                </a>

                {/* h3 */}
                <ul className="mt-2 ml-9 space-y-1.5">
                  {numbered
                    .filter((x) => x.level === 3)
                    .slice(
                      // h2 から次の h2 直前までを子とする
                      heads.findIndex((x) => x.id === h2.id) + 1,
                      (() => {
                        const start = heads.findIndex((x) => x.id === h2.id) + 1;
                        const next = heads.findIndex((x, i) => i > start - 1 && x.level === 2);
                        return next === -1 ? heads.length : next;
                      })()
                    )
                    .map((h3) => (
                      <li key={h3.id}>
                        <a
                          href={`#${h3.id}`}
                          onClick={j(h3.id)}
                          className={`inline-flex items-start gap-2 ${active === h3.id ? "text-zinc-900" : "text-zinc-700"}`}
                        >
                          <span className={`mt-2 h-1.5 w-1.5 rounded-full ${color.dot}`} />
                          <span className="underline-offset-4 hover:underline">{h3.text}</span>
                        </a>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
        </ol>
      </nav>
    </aside>
  );
}
