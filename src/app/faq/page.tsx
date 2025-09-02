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
