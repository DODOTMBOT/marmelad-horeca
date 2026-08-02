'use client';

import { useState } from 'react';
import { AdminForm, Input, TextArea, ColorPicker, Card } from '../components/AdminForm';
import { saveCases } from '../actions';
import type { CasesContent, CaseItem } from '@/lib/content-types';

export default function CasesEditor({ initial }: { initial: CasesContent }) {
  const [d, setD] = useState<CasesContent>(initial);

  function setCase(i: number, patch: Partial<CaseItem>) {
    setD((p) => ({ ...p, items: p.items.map((c, j) => (j === i ? { ...c, ...patch } : c)) }));
  }
  function addCase() {
    setD((p) => ({ ...p, items: [...p.items, { client: '', task: '', whatWeDid: '', result: '', bg: 'tile-mint' }] }));
  }

  return (
    <AdminForm title="Кейсы" sectionHref="/#cases" onSave={() => saveCases(d)}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Метка секции" value={d.sectionLabel} onChange={(e) => setD((p) => ({ ...p, sectionLabel: e.target.value }))} />
        <Input label="Заголовок" value={d.title} onChange={(e) => setD((p) => ({ ...p, title: e.target.value }))} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-graphite">Кейсы ({d.items.length})</p>
        <button type="button" onClick={addCase} className="text-sm text-teal hover:text-terracotta">
          + Добавить кейс
        </button>
      </div>

      {d.items.map((c, i) => (
        <Card key={i} title={`Кейс ${i + 1}${c.client ? `: ${c.client}` : ''}`} onRemove={() => setD((p) => ({ ...p, items: p.items.filter((_, j) => j !== i) }))}>
          <Input label="Клиент / бренд" value={c.client} onChange={(e) => setCase(i, { client: e.target.value })} />
          <Input label="Задача" value={c.task} onChange={(e) => setCase(i, { task: e.target.value })} />
          <TextArea label="Что сделали" rows={3} value={c.whatWeDid} onChange={(e) => setCase(i, { whatWeDid: e.target.value })} />
          <Input label="Результат (с цифрой)" hint="Напр. «−23% себестоимости»" value={c.result} onChange={(e) => setCase(i, { result: e.target.value })} />
          <ColorPicker label="Цвет плитки" value={c.bg} onChange={(v) => setCase(i, { bg: v })} />
        </Card>
      ))}
    </AdminForm>
  );
}
