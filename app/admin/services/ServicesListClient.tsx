'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { actionDeleteService } from './actions';
import type { ServiceV2 } from '@/lib/content-types';

const MOD_TYPE: Record<string, string> = {
  per_unit: 'за ед.',
  checkbox: 'галочка',
  select: 'выбор',
};

function fmt(n: number) {
  return n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
}

export default function ServicesListClient({ items }: { items: ServiceV2[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete(id: string, title: string) {
    if (!confirm(`Удалить «${title || 'без названия'}»?`)) return;
    startTransition(async () => {
      await actionDeleteService(id);
      router.refresh();
    });
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-[20px] p-10 tile-shadow text-center">
        <p className="text-graphite-mid text-sm mb-4">Услуг пока нет</p>
        <Link href="/admin/services/new" className="text-sm text-teal hover:text-terracotta transition-colors font-medium">
          Создать первую услугу →
        </Link>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-[20px] tile-shadow overflow-hidden transition-opacity ${pending ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="grid grid-cols-[2fr_100px_160px_2fr_120px] gap-4 px-5 py-2.5 border-b border-graphite/10 bg-[#F8F6F2]">
        <span className="text-xs text-graphite-light font-medium uppercase tracking-wide">Название</span>
        <span className="text-xs text-graphite-light font-medium uppercase tracking-wide">База</span>
        <span className="text-xs text-graphite-light font-medium uppercase tracking-wide">Модификаторы</span>
        <span className="text-xs text-graphite-light font-medium uppercase tracking-wide">Описание</span>
        <span />
      </div>

      {/* Rows */}
      {items.map((svc, i) => (
        <div
          key={svc.id}
          className={`grid grid-cols-[2fr_100px_160px_2fr_120px] gap-4 px-5 py-3 items-center ${
            i < items.length - 1 ? 'border-b border-graphite/6' : ''
          } hover:bg-cream/60 transition-colors`}
        >
          {/* Name + tags */}
          <div className="min-w-0">
            <p className="text-sm font-medium text-graphite truncate">
              {svc.title || '(без названия)'}
            </p>
            {svc.tags.length > 0 && (
              <p className="text-xs text-graphite-light truncate mt-0.5">
                {svc.tags.join(', ')}
              </p>
            )}
          </div>

          {/* Base price */}
          <span className="text-sm text-graphite tabular-nums">
            {fmt(svc.basePrice)}
          </span>

          {/* Modifiers */}
          <div className="flex flex-wrap gap-1">
            {svc.modifiers.length === 0 ? (
              <span className="text-xs text-graphite-light">—</span>
            ) : (
              svc.modifiers.map((mod) => (
                <span key={mod.id} className="text-xs bg-[#F0EDE8] text-graphite-mid rounded px-1.5 py-0.5">
                  {MOD_TYPE[mod.type]}
                </span>
              ))
            )}
          </div>

          {/* Short description */}
          <p className="text-xs text-graphite-light truncate">
            {svc.shortDescription || '—'}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            <Link
              href={`/admin/services/${svc.id}`}
              className="text-xs font-medium text-teal hover:text-terracotta transition-colors whitespace-nowrap"
            >
              Изменить
            </Link>
            <button
              onClick={() => handleDelete(svc.id, svc.title)}
              className="text-xs text-graphite-light hover:text-red-500 transition-colors"
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
