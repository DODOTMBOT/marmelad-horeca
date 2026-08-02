'use client';

import { useState } from 'react';
import { AdminForm, Input, TextArea, Card } from '../components/AdminForm';
import { saveServices } from '../actions';
import type { ServicesContent, ServiceItem, PriceType } from '@/lib/content-types';

const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  fixed: 'Фиксированная цена',
  per_unit: 'За единицу (× количество)',
  select: 'Выбор из вариантов',
  base_plus: 'База + за единицу',
  range: 'Диапазон от–до',
};

function ServiceEditor({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: ServiceItem;
  index: number;
  onChange: (patch: Partial<ServiceItem>) => void;
  onRemove: () => void;
}) {
  return (
    <Card title={`Услуга ${index + 1}: ${item.name || '—'}`} onRemove={onRemove}>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Тег-пилюля" value={item.tag} onChange={(e) => onChange({ tag: e.target.value })} />
        <Input label="Название" value={item.name} onChange={(e) => onChange({ name: e.target.value })} />
      </div>
      <TextArea label="Описание" rows={3} value={item.description} onChange={(e) => onChange({ description: e.target.value })} />

      <div>
        <label className="block text-xs font-medium text-graphite-mid mb-1.5">Тип цены</label>
        <select
          value={item.priceType}
          onChange={(e) => onChange({ priceType: e.target.value as PriceType })}
          className="w-full border border-graphite/20 rounded-xl px-4 py-2.5 text-sm text-graphite bg-white focus:outline-none focus:border-teal"
        >
          {Object.entries(PRICE_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {item.priceType === 'fixed' && (
        <Input label="Цена (₽)" type="number" value={item.fixedPrice ?? ''} onChange={(e) => onChange({ fixedPrice: Number(e.target.value) })} />
      )}
      {item.priceType === 'per_unit' && (
        <div className="grid grid-cols-2 gap-3">
          <Input label="Цена за единицу (₽)" type="number" value={item.pricePerUnit ?? ''} onChange={(e) => onChange({ pricePerUnit: Number(e.target.value) })} />
          <Input label="Название единицы" value={item.unitLabel ?? ''} onChange={(e) => onChange({ unitLabel: e.target.value })} />
        </div>
      )}
      {item.priceType === 'base_plus' && (
        <div className="grid grid-cols-3 gap-3">
          <Input label="База (₽)" type="number" value={item.basePrice ?? ''} onChange={(e) => onChange({ basePrice: Number(e.target.value) })} />
          <Input label="За ед. (₽)" type="number" value={item.pricePerExtra ?? ''} onChange={(e) => onChange({ pricePerExtra: Number(e.target.value) })} />
          <Input label="Ед." value={item.extraLabel ?? ''} onChange={(e) => onChange({ extraLabel: e.target.value })} />
        </div>
      )}
      {item.priceType === 'range' && (
        <div className="grid grid-cols-2 gap-3">
          <Input label="От (₽)" type="number" value={item.priceFrom ?? ''} onChange={(e) => onChange({ priceFrom: Number(e.target.value) })} />
          <Input label="До (₽)" type="number" value={item.priceTo ?? ''} onChange={(e) => onChange({ priceTo: Number(e.target.value) })} />
        </div>
      )}

      <Input label="Примечание (мелкий шрифт)" value={item.note ?? ''} onChange={(e) => onChange({ note: e.target.value })} />
    </Card>
  );
}

export default function ServicesEditor({ initial }: { initial: ServicesContent }) {
  const [d, setD] = useState<ServicesContent>(initial);

  function setItem(i: number, patch: Partial<ServiceItem>) {
    setD((p) => ({
      ...p,
      items: p.items.map((item, j) => (j === i ? { ...item, ...patch } : item)),
    }));
  }
  function addItem() {
    const newService: ServiceItem = {
      id: `service_${Date.now()}`,
      tag: 'Новое',
      name: '',
      description: '',
      priceType: 'fixed',
      fixedPrice: 0,
      params: [],
    };
    setD((p) => ({ ...p, items: [...p.items, newService] }));
  }

  return (
    <AdminForm title="Услуги и цены" sectionHref="/#services" onSave={() => saveServices(d)}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Метка секции" value={d.sectionLabel} onChange={(e) => setD((p) => ({ ...p, sectionLabel: e.target.value }))} />
        <TextArea label="Заголовок" hint="\\n для переноса" rows={2} value={d.title} onChange={(e) => setD((p) => ({ ...p, title: e.target.value }))} />
      </div>
      <Input label="Текст бейджа честных цен" value={d.honestyBadge} onChange={(e) => setD((p) => ({ ...p, honestyBadge: e.target.value }))} />

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-graphite">Услуги ({d.items.length})</p>
        <button type="button" onClick={addItem} className="text-sm text-teal hover:text-terracotta transition-colors">
          + Добавить услугу
        </button>
      </div>

      {d.items.map((item, i) => (
        <ServiceEditor
          key={item.id}
          item={item}
          index={i}
          onChange={(patch) => setItem(i, patch)}
          onRemove={() => setD((p) => ({ ...p, items: p.items.filter((_, j) => j !== i) }))}
        />
      ))}
    </AdminForm>
  );
}
