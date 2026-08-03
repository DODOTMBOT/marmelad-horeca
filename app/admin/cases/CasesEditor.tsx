'use client';

import { useState } from 'react';
import { AdminForm, Input, TextArea, HexColorPicker, LogoUpload, TagEditor, Card } from '../components/AdminForm';
import { saveCases } from '../actions';
import type { CasesContent, CaseItem } from '@/lib/content-types';

function emptyCase(): CaseItem {
  return { client: '', logoPath: '', bg: '#F5F2ED', result: '', resultLabel: '', description: '', tags: [] };
}

export default function CasesEditor({ initial }: { initial: CasesContent }) {
  const [d, setD] = useState<CasesContent>(initial);

  function setCase(i: number, patch: Partial<CaseItem>) {
    setD((p) => ({ ...p, items: p.items.map((c, j) => (j === i ? { ...c, ...patch } : c)) }));
  }
  function addCase() {
    setD((p) => ({ ...p, items: [...p.items, emptyCase()] }));
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
        <Card
          key={i}
          title={`Кейс ${i + 1}${c.client ? `: ${c.client}` : ''}`}
          onRemove={() => setD((p) => ({ ...p, items: p.items.filter((_, j) => j !== i) }))}
        >
          {/* Preview */}
          <div
            className="rounded-[16px] p-5 mb-2 flex flex-col gap-3 min-h-[140px]"
            style={{ backgroundColor: c.bg || '#F5F2ED' }}
          >
            {c.logoPath && (
              <img src={c.logoPath} alt="" className="h-8 object-contain object-left opacity-90" />
            )}
            {c.result && (
              <div>
                <div className="font-display font-bold text-3xl" style={{ color: isColorDark(c.bg) ? '#fff' : '#2C2A27' }}>
                  {c.result}
                </div>
                {c.resultLabel && (
                  <div className="text-xs mt-0.5" style={{ color: isColorDark(c.bg) ? 'rgba(255,255,255,0.7)' : '#6B6662' }}>
                    {c.resultLabel}
                  </div>
                )}
              </div>
            )}
            {c.description && (
              <p className="text-xs leading-relaxed" style={{ color: isColorDark(c.bg) ? 'rgba(255,255,255,0.8)' : '#6B6662' }}>
                {c.description.slice(0, 80)}{c.description.length > 80 ? '…' : ''}
              </p>
            )}
            {c.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full border"
                    style={{
                      borderColor: isColorDark(c.bg) ? 'rgba(255,255,255,0.3)' : 'rgba(44,42,39,0.2)',
                      color: isColorDark(c.bg) ? 'rgba(255,255,255,0.9)' : '#6B6662',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {!c.result && !c.description && !c.client && (
              <span className="text-xs opacity-40" style={{ color: isColorDark(c.bg) ? '#fff' : '#2C2A27' }}>
                Предпросмотр
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Клиент / бренд" value={c.client} onChange={(e) => setCase(i, { client: e.target.value })} />
            <LogoUpload label="Логотип (PNG)" value={c.logoPath ?? ''} onChange={(url) => setCase(i, { logoPath: url })} folder="uploads" />
          </div>
          <HexColorPicker label="Цвет фона" value={c.bg} onChange={(v) => setCase(i, { bg: v })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Результат" hint='Напр. «+23%» или «×4»' value={c.result} onChange={(e) => setCase(i, { result: e.target.value })} />
            <Input label="Подпись к результату" hint='Напр. «рост выручки»' value={c.resultLabel ?? ''} onChange={(e) => setCase(i, { resultLabel: e.target.value })} />
          </div>
          <TextArea label="Описание" hint="Что именно сделали" rows={3} value={c.description} onChange={(e) => setCase(i, { description: e.target.value })} />
          <TagEditor label="Теги" hint="Enter или кнопка чтобы добавить" tags={c.tags} onChange={(tags) => setCase(i, { tags })} />
        </Card>
      ))}
    </AdminForm>
  );
}

function isColorDark(hex: string): boolean {
  const h = (hex || '').replace('#', '');
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 160;
}
