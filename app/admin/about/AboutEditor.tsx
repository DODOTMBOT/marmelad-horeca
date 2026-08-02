'use client';

import { useState } from 'react';
import { AdminForm, Input, TextArea, ColorPicker, Card } from '../components/AdminForm';
import { saveAbout } from '../actions';
import type { AboutContent, AboutValue } from '@/lib/content-types';

export default function AboutEditor({ initial }: { initial: AboutContent }) {
  const [d, setD] = useState<AboutContent>(initial);

  function setValue(i: number, patch: Partial<AboutValue>) {
    setD((p) => ({ ...p, values: p.values.map((v, j) => (j === i ? { ...v, ...patch } : v)) }));
  }

  return (
    <AdminForm title="О нас" sectionHref="/#about" onSave={() => saveAbout(d)}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Метка секции" value={d.sectionLabel} onChange={(e) => setD((p) => ({ ...p, sectionLabel: e.target.value }))} />
        <Input label="Текст CTA-кнопки" value={d.ctaLabel} onChange={(e) => setD((p) => ({ ...p, ctaLabel: e.target.value }))} />
      </div>
      <TextArea label="Заголовок" rows={2} value={d.title} onChange={(e) => setD((p) => ({ ...p, title: e.target.value }))} />
      <TextArea label="Абзац 1" rows={4} value={d.text1} onChange={(e) => setD((p) => ({ ...p, text1: e.target.value }))} />
      <TextArea label="Абзац 2" rows={3} value={d.text2} onChange={(e) => setD((p) => ({ ...p, text2: e.target.value }))} />
      <ColorPicker label="Цвет левой плитки" value={d.mainTileBg} onChange={(v) => setD((p) => ({ ...p, mainTileBg: v }))} />

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-graphite">Принципы ({d.values.length})</p>
        <button type="button" onClick={() => setD((p) => ({ ...p, values: [...p.values, { title: '', desc: '' }] }))} className="text-sm text-teal hover:text-terracotta">
          + Добавить
        </button>
      </div>

      {d.values.map((v, i) => (
        <Card key={i} title={v.title || `Принцип ${i + 1}`} onRemove={() => setD((p) => ({ ...p, values: p.values.filter((_, j) => j !== i) }))}>
          <Input label="Название" value={v.title} onChange={(e) => setValue(i, { title: e.target.value })} />
          <TextArea label="Описание" rows={2} value={v.desc} onChange={(e) => setValue(i, { desc: e.target.value })} />
        </Card>
      ))}
    </AdminForm>
  );
}
