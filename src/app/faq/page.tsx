// app/(whatever)/page.tsx
import Header from '@/components/Header'
import Glossary, { type GlossaryItem } from '@/components/Glossary'
import React from 'react'

const items: GlossaryItem[] = [
  { term: '顔合わせ', reading: 'かおあわせ', desc: <p>初回に条件や相性を確認する短い面談。</p>, category: '初回', badge: '重要' },
  { term: 'お手当', reading: 'おてあて', desc: <p>デートの対価として支払われる金銭や物品。</p>, category: 'お金' },
  { term: '継続', reading: 'けいぞく', desc: <p>定期的に会う取り決め。頻度や条件を明文化するとトラブル防止に。</p>, category: '運用' },
  { term: 'ドタキャン', reading: 'どたきゃん', desc: <p>直前のキャンセル。以後の約束・評価に影響しやすい。</p>, category: '安全' },
  { term: '顔出し', reading: 'かおだし', desc: <p>顔写真の共有。初回は基本控えるのが無難。</p>, category: '安全' },
  { term: '茶飯崩し', reading: 'ちゃめしくずし', desc: <p>食事しかやらないと言い張るPJを懐柔して大人の関係まで持ち込むこと</p>, category: '安全' },
  { term: '大人の関係', reading: 'おとなのかんけい', desc: <p>金銭を支払ってセックスをすること</p>, category: '安全' },
  { term: 'ホ別', reading: 'ほべつ', desc: <p>ホテル代は別で。という意味。これを使う女性は慣れているので素人狙いなら避けるのが吉</p>, category: '安全' },
  { term: '相場', reading: 'そうば', desc: <p>パパ活界隈の平均的なお手当金額</p>, category: '安全' },
  { term: '条件', reading: 'じょうけん', desc: <p>条件とはデートやセックスでいくらお手当がもらえるかをきくときにつかいます</p>, category: '安全' },
  { term: '定期', reading: 'ていき', desc: <p>毎週1回とか毎月1回以上必ず会うことを決めている場合を「定期」と考える傾向があります</p>, category: '安全' },
  { term: '都度', reading: 'つど', desc: <p>都度とは定期の逆の用語です。男女が毎回お互い会いたいときに連絡しあって予定を合わせてデートをすることです。</p>, category: '安全' },
  { term: '健全', reading: 'けんぜん', desc: <p>食事や買い物、遊びにいったりと、セックスを抜きにした関係のこと</p>, category: '安全' },
  { term: '業者', reading: 'ぎょうしゃ', desc: <p>デリバリーヘルス嬢がパパ活アプリをつかって営業すること。実際にやりとりしているのはお店の店員</p>, category: '安全' },
  { term: 'P', reading: 'ピー', desc: <p>パパ活をしているパパ（Papa）のことを表す隠語</p>, category: '安全' },
  { term: 'PJ', reading: 'ピージェイ', desc: <p>パパ活をしている女性のことを表す隠語</p>, category: '安全' },
  { term: 'P活', reading: 'ピーカツ', desc: <p>「パパ活（papa活）」の略称</p>, category: '安全' },
  { term: '顔合わせ詐欺', reading: 'かおあわせさぎ', desc: <p>顔合わせを繰り返すことで男性からお手当を巻き上げようとすること</p>, category: '安全' },
  { term: '軽め', reading: 'かるめ', desc: <p>挿入のない性行為です。プチのことを軽めと言ったりもします。</p>, category: '安全' },
  { term: 'プチ', reading: 'ぷち', desc: <p>挿入のない性行為です。軽めのことをプチと言ったりもします。</p>, category: '安全' },
  { term: '黄色', reading: 'きいろ', desc: <p>カカオトークのことを意味しています。</p>, category: '安全' },
  { term: 'ご有り', reading: 'ごあり', desc: <p>コンドームを付けてセックスしてほしいという意味</p>, category: '安全' },
  { term: 'ザオラル', reading: 'ざおらる', desc: <p>何度かあった相手から、久しぶりに連絡がくることや、連絡することの意味</p>, category: '安全' },
  { term: '信頼関係ができたら大人', reading: 'しんらいかんけいができたらおとな', desc: <p>数回食事デートをしてみてアナタのことを信頼できたらセックスできますよ、という意味。本当にそう考えている場合もありますが、2，3回食事デートをしてお手当をもらったらトンズラするつもりの女性も使う言葉のため要注意</p>, category: '安全' },
  { term: 'スペ', reading: 'すぺ', desc: <p>スペまたはスペ値といったりしますが、主に女性の体型を数字で表したものになります。具体的には（身長－体重）＝スペ値　となります。</p>, category: '安全' },
  { term: 'その先', reading: 'そのさき', desc: <p>食事以上の関係も大丈夫ですよ、という意味</p>, category: '安全' },
  { term: '積極的', reading: 'せっきょくてき', desc: <p>食事以上の関係も大丈夫ですよ、という意味</p>, category: '安全' },
];

export default function Page() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Glossary
          title="パパ活 用語集"
          items={items}
          searchable
          filterable
          jsonLd
          indexable
        />
      </main>
    </div>
  )
}
