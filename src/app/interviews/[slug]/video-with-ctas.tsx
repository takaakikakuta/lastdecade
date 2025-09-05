// app/interviews/[slug]/video-with-ctas.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type AffiliateCTA = {
  label: string;
  href: string;
  start?: number;
  end?: number;
};

export default function VideoWithCTAs({
  src,
  poster,
  ctas,
  startAt = 0,
}: {
  src: string;
  poster?: string;
  ctas: AffiliateCTA[];
  startAt?: number;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  // 現在時刻に表示すべきCTA
  const activeCTAs = useMemo(() => {
    return (ctas ?? []).filter((c) => {
      const s = Math.max(0, c.start ?? 0);
      const e = c.end ?? Number.POSITIVE_INFINITY;
      return time >= s && time <= e;
    });
  }, [ctas, time]);

  // 初期シーク
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoadedMeta = () => {
      setDuration(v.duration || null);
      // メタデータ読み込み後にシーク
      if (startAt > 0 && startAt < (v.duration || Number.MAX_SAFE_INTEGER)) {
        try {
          v.currentTime = startAt;
        } catch {}
      }
    };
    const onCanPlay = () => setIsReady(true);
    const onTimeUpdate = () => setTime(v.currentTime || 0);

    v.addEventListener("loadedmetadata", onLoadedMeta);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      v.removeEventListener("loadedmetadata", onLoadedMeta);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [startAt]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-black shadow-sm">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-auto"
          controls
          playsInline
          preload="metadata"
          poster={poster}
        >
          <source src={src} />
          {/* フォールバック */}
          お使いのブラウザは video タグに対応していません。
        </video>

        {/* CTA: 下部固定バー（現在時刻でフィルタ） */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
          <div className="flex flex-wrap gap-2">
            {activeCTAs.map((c, i) => (
              <Link
                key={`${c.label}-${i}`}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto inline-flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-sm font-semibold text-neutral-900 shadow-lg ring-1 ring-black/5 hover:bg-white"
              >
                {/* バッジ的に時間表示（任意） */}
                {(c.start != null || c.end != null) && (
                  <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-700">
                    {formatRange(c.start, c.end, duration)}
                  </span>
                )}
                <span className="underline underline-offset-4">{c.label}</span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 opacity-75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* タイムラインに目印（オプション・簡易） */}
      {ctas && ctas.length > 0 && (
        <div className="relative h-2 w-full bg-neutral-200">
          {/* 現在位置 */}
          {duration && duration > 0 && (
            <div
              className="absolute top-0 h-2 bg-neutral-800"
              style={{ left: 0, width: `${(time / duration) * 100}%` }}
              aria-hidden
            />
          )}
          {/* CTA 範囲を色帯で表示 */}
          {duration &&
            ctas.map((c, i) => {
              const s = Math.max(0, c.start ?? 0);
              const e = c.end ?? duration;
              const left = (s / duration) * 100;
              const width = (Math.max(0, Math.min(e, duration) - s) / duration) * 100;
              return (
                <div
                  key={i}
                  className="absolute top-0 h-2 bg-amber-400/70"
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={`${c.label} (${formatRange(c.start, c.end, duration)})`}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}

function formatRange(start?: number, end?: number, duration?: number | null) {
  const s = start ?? 0;
  const e = end ?? duration ?? undefined;
  return `${secToMMSS(s)}–${e != null ? secToMMSS(e) : "end"}`;
}

function secToMMSS(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
