import ArticleCard from "@/components/ArticleCard";
import Guide from "@/components/Guide";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Interview, { InterviewItem } from "@/components/Interview";
import { getAllPostsMeta } from "@/lib/mdx";

export const dynamic = "force-static";

export default function HomePage() {
  const posts = getAllPostsMeta();
  const [featured, ...rest] = posts;
  const latest = rest.slice(0, 6);

  const dummyItems: InterviewItem[] = [
  {
    slug: "first-meal-experience",
    title: "初めての食事パパ活体験談 ― 緊張と学び",
    thumbnail: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/dummy/dummy1.png",
    date: "2025-08-15",
  },
  {
    slug: "luxury-gift-story",
    title: "ブランドバッグをもらった夜の話",
    thumbnail: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/dummy/dummy2.png",
    date: "2025-08-12",
  },
  {
    slug: "weird-daddy-encounter",
    title: "ちょっと変わったパパに出会った体験談",
    thumbnail: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/dummy/dummy3.png",
    date: "2025-08-10",
  },
  {
    slug: "balance-study-and-daddy",
    title: "学業とパパ活を両立する方法",
    thumbnail: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/dummy/dummy4.png",
    date: "2025-08-05",
  },
];

const dummArticlee: InterviewItem[] = [
  {
    slug: "first-meal-experience",
    title: "パパ活は犯罪になるの",
    thumbnail: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/dummy/dummy1.png",
    date: "2025-08-15",
  },
  {
    slug: "お手当の相場は？",
    title: "ブランドバッグをもらった夜の話",
    thumbnail: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/dummy/dummy2.png",
    date: "2025-08-12",
  },
  {
    slug: "weird-daddy-encounter",
    title: "どんな人がパパ活しているの？（女性編）",
    thumbnail: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/dummy/dummy3.png",
    date: "2025-08-10",
  },
  {
    slug: "balance-study-and-daddy",
    title: "どんな人がパパ活しているの？（男性編）",
    thumbnail: "https://lastdecade.s3.ap-northeast-1.amazonaws.com/dummy/dummy4.png",
    date: "2025-08-05",
  },
];
  

  // 人気タグを雑に集計（上位10件）
  const tagCount = new Map<string, number>();
  posts.forEach((p) => (p.tags || []).forEach((t) => tagCount.set(t, (tagCount.get(t) || 0) + 1)));
  const popularTags = Array.from(tagCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <>
    <Header/>
    <Hero/>
    <Interview items={dummyItems}/>
    <Guide items={dummArticlee}/>
    
    </>
  );
}
