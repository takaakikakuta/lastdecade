// components/ManualSectionsSidebar.tsx
import Link from "next/link";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";

type Item = {
  label: string;
  href: string;
  desc?: string;
  img?: string;
};

type Section = {
  title: string;
  items: Item[];
};

type ManualSectionsJson = {
  sections: Section[];
};

const JSON_PATH = path.join(process.cwd(), "public", "guide.json");

// JSONを読み込む
function getSections(): Section[] {
  if (!fs.existsSync(JSON_PATH)) return [];
  try {
    const raw = fs.readFileSync(JSON_PATH, "utf-8");
    const data = JSON.parse(raw) as ManualSectionsJson;
    if (!Array.isArray(data.sections)) return [];
    // ざっくりバリデーション
    return data.sections
      .filter((sec) => sec && Array.isArray(sec.items))
      .map((sec) => ({
        title: sec.title ?? "",
        items: sec.items
          .filter((it) => it && it.label && it.href)
          .map((it) => ({
            label: it.label,
            href: it.href,
            desc: it.desc ?? "",
            img: it.img ?? "",
          })),
      }));
  } catch (e) {
    console.error("Failed to load manual_sections.json:", e);
    return [];
  }
}

export default function ManualSectionsSidebar({ className = "" }: { className?: string }) {
  const sections = getSections();

  return (
    <aside className={`space-y-6 ${className}`}>
      {sections.map((sec) => (
        <section key={sec.title} className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">{sec.title}</h3>
          <ul className="space-y-3">
            {sec.items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group flex gap-3 no-underline" prefetch>
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                    {item.img ? (
                      <Image src={item.img} alt={item.label} fill className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-[11px] text-zinc-400">
                        No img
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="line-clamp-2 text-sm font-medium group-hover:underline underline-offset-4">
                      {item.label}
                    </div>
                    {item.desc && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">{item.desc}</p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </aside>
  );
}
