import { ReactNode } from "react";

type Color = "orange" | "blue" | "green" | "emerald" | "rose";
type Props = {
  title?: ReactNode;
  children: ReactNode; // <li>…</li> をそのまま入れる
  color?: Color;
  className?: string;
};

const colorMap: Record<Color, { pill: string; border: string }> = {
  orange: { pill: "bg-orange-500", border: "border-orange-500" },
  blue: { pill: "bg-blue-500", border: "border-blue-500" },
  green: { pill: "bg-green-500", border: "border-green-500" },
  emerald: { pill: "bg-emerald-500", border: "border-emerald-500" },
  rose: { pill: "bg-rose-500", border: "border-rose-500" },
};

export default function CalloutList({
  title = "この記事でわかること",
  children,
  color = "orange",
  className = "",
}: Props) {
  const c = colorMap[color];
  return (
    <section className={`relative ${className}`}>
      {/* 見出しピル */}
      <div
        className={`inline-flex items-center gap-2 text-white text-sm font-semibold rounded-full px-3 py-1 ${c.pill} shadow-sm`}
      >
        <span aria-hidden>☞</span>
        <span>{title}</span>
      </div>

      {/* 本体ボックス */}
      <div className={`mt-2 rounded-xl border-2 ${c.border} bg-white shadow-sm`}>
        <ul className="list-disc pl-6 pr-4 text-[15px] leading-relaxed font-bold">
          {children}
        </ul>
      </div>
    </section>
  );
}
