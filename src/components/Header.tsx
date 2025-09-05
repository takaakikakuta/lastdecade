"use client"

import Image from "next/image";
import React, { useEffect, useState } from "react";

const Header = () => {
    const [open, setOpen] = useState(false);
    const [elevated, setElevated] = useState(false);


    useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
    }, []);


    const NAV = [
        { label: "インタビュー", href: "/interviews" },
        { label: "トピックス", href: "/topics" },
        { label: "パパ活実践ガイド", href: "/manual" },
        { label: "Q&A / 用語集", href: "/faq" },
        // { label: "お問い合わせ", href: "https://docs.google.com/forms/d/e/1FAIpQLSeqeymmUVbw3i7pjzKD44yXPQ_0CB4wHzj2QezVaFP83p3e0w/viewform?usp=dialog" },
    ];

  return (
    <header
      className={
        "sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur transition-shadow " +
        (elevated ? "shadow-sm" : "shadow-none")
      }
    >
      <div className="mx-auto flex h-20 max-w-screen-xl items-center justify-between px-4 sm:px-6">
        {/* Left: Logo */}
        <a href="/" className="group flex items-center gap-3" aria-label="トップへ">
            <div className="relative h-16 w-16">
                <Image
                src="https://lastdecade.s3.ap-northeast-1.amazonaws.com/Last_Decade_logo_transparent_bgmask_600w.png"
                alt="LastDecade ロゴ"
                fill   // 親divいっぱいに広げる
                className="object-contain"
                />
            </div>
            <div className="flex flex-col leading-none">
            <span className="font-bold tracking-tight text-neutral-900 text-3xl">Last Decade</span>
            <span className="text-[10px] font-medium text-neutral-500">パパ活体験談＆実践ガイド</span>
            </div>
        </a>

        {/* Right: Desktop Nav */}
        <nav className="hidden items-center gap-2 md:flex" aria-label="メインメニュー">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={
                "rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900 " 
              }
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 md:hidden"
          aria-label="メニューを開閉"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden
          >
            {open ? (
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M3.75 5.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zm0 6a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zm0 6a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={
          "md:hidden " +
          (open
            ? "pointer-events-auto max-h-[80vh] opacity-100"
            : "pointer-events-none max-h-0 opacity-0")
        }
      >
        <div className="mx-3 mb-3 overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200">
          <nav className="grid" aria-label="モバイルメニュー">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={
                  "flex items-center justify-between px-4 py-3 text-sm font-medium text-neutral-800 hover:bg-neutral-50 " 
                }
                onClick={() => setOpen(false)}
              >
                <span>{item.label}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4 opacity-70"
                  aria-hidden
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header
