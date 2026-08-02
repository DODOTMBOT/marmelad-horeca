'use client';

import { useState } from 'react';
import { AdminForm, Input, TextArea, ColorPicker, Card } from '../components/AdminForm';
import { savePains } from '../actions';
import type { PainsContent, PainItem } from '@/lib/content-types';

export default function PainsEditor({ initial }: { initial: PainsContent }) {
  const [d, setD] = useState<PainsContent>(initial);

  function setItem(i: number, patch: Partial<PainItem>) {
    setD((p) => ({
      ...p,
      items: p.items.map((item, j) => (j === i ? { ...item, ...patch } : item)),
    }));
  }
  function addItem() {
    setD((p) => ({ ...p, items: [...p.items, { text: '', bg: 'tile-cream' }] }));
  }
  function removeItem(i: number) {
    setD((p) => ({ ...p, items: p.items.filter((_, j) => j !== i) }));
  }

  return (
    <AdminForm title="Боли — «Это для вас, если…»" sectionHref="/#pains" onSave={() => savePains(d)}>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Метка секции"
          value={d.sectionLabel}
          onChange={(e) => setD((p) => ({ ...p, sectionLabel: e.target.value }))}
        />
        <TextArea
          label="Заголовок секции"
          hint="\\n для переноса"
          rows={2}
          value={d.title}
          onChange={(e) => setD((p) => ({ ...p, title: e.target.value }))}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-graphite">Пункты болей ({d.items.length})</p>
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-teal hover:text-terracotta transition-colors"
        >
          + Добавить пункт
        </button>
      </div>

      {d.items.map((item, i) => (
        <Card key={i} title={`Пункт ${i + 1}`} onRemove={() => removeItem(i)}>
          <TextArea
            label="Текст"
            rows={2}
            value={item.text}
            onChange={(e) => setItem(i, { text: e.target.value })}
          />
          <Input
            label="Мини-тег (необязательно)"
            value={item.label ?? ''}
            onChange={(e) => setItem(i, { label: e.target.value })}
          />
          <ColorPicker
            label="Цвет плитки"
            value={item.bg}
            onChange={(v) => setItem(i, { bg: v })}
          />
        </Card>
      ))}
    </AdminForm>
  );
}
