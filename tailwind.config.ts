import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/content/**/*.{md,mdx}",           // ← ここが重要（GuideArticles配下）
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0f172a",
          accent: "#eab308"
        }
      }
    },
  },
  plugins: [typography],
};
export default config;
