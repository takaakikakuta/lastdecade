import React from "react";

export type MiniFooterProps = {
  siteName?: string;
  links?: {
    terms?: string;     // 利用規約
    privacy?: string;   // プライバシーポリシー
    contact?: string;   // お問い合わせ
  };
  className?: string;
};

export default function MiniFooter({
  siteName = "lastdecade",
  links = { terms: "/terms", privacy: "/privacy", contact: "https://docs.google.com/forms/d/e/1FAIpQLSeqeymmUVbw3i7pjzKD44yXPQ_0CB4wHzj2QezVaFP83p3e0w/viewform?usp=dialog" },
  className = "",
}: MiniFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={[
        "w-full border-t border-zinc-200 bg-white/80 backdrop-blur",
        "text-[11px] sm:text-xs text-zinc-500",
        className,
      ].join(" ")}
    >
      <nav
        aria-label="フッターナビゲーション"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4"
      >
        <p className="whitespace-nowrap">
          © {year} {siteName}
        </p>

        <ul className="flex items-center gap-3 sm:gap-5">
          <li>
            <a
              href={links.terms}
              className="hover:text-zinc-700 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded"
            >
              利用規約
            </a>
          </li>
          <li className="text-zinc-300">•</li>
          <li>
            <a
              href={links.privacy}
              className="hover:text-zinc-700 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded"
            >
              プライバシーポリシー
            </a>
          </li>
          <li className="text-zinc-300">•</li>
          <li>
            <a
              href={links.contact}
              className="hover:text-zinc-700 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded"
            >
              お問い合わせ
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
