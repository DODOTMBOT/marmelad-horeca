'use client';

import { useState } from 'react';
import type { ServicesContent, ServiceItem } from '@/lib/content-types';
import { calculatePrice, formatPrice, formatPriceResult } from '@/lib/calculator';

const TILE_BG = ['bg-tile-mint', 'bg-tile-peach', 'bg-tile-rose', 'bg-tile-teal', 'bg-tile-cream'];

function getPriceLabel(service: ServiceItem): string {
  switch (service.priceType) {
    case 'fixed': return formatPrice(service.fixedPrice!);
    case 'per_unit': return `${formatPrice(service.pricePerUnit!)} / ${service.unitLabel}`;
    case 'select': {
      const prices = service.params?.[0]?.options?.map((o) => o.price) ?? [];
      return prices.length ? `от ${formatPrice(Math.min(...prices))}` : '—';
    }
    case 'base_plus': return `от ${formatPrice(service.basePrice!)}`;
    case 'range': return `${formatPrice(service.priceFrom!)} — ${formatPrice(service.priceTo!)}`;
    default: return '—';
  }
}

function ServiceCard({ service, bgClass }: { service: ServiceItem; bgClass: string }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, number | string>>(() => {
    const init: Record<string, number | string> = {};
    for (const p of service.params ?? []) init[p.id] = p.defaultValue;
    return init;
  });

  const hasCalculator = (service.params?.length ?? 0) > 0;
  const result = hasCalculator ? calculatePrice(service as Parameters<typeof calculatePrice>[0], values) : calculatePrice(service as Parameters<typeof calculatePrice>[0], {});
  const priceDisplay = open && result !== null
    ? (formatPriceResult(result) ?? getPriceLabel(service))
    : getPriceLabel(service);

  return (
    <div className={`${bgClass} tile-shadow rounded-[24px] p-6 flex flex-col gap-4`}>
      <div>
        <span className="inline-block border border-graphite/15 text-graphite-mid text-xs px-3 py-1 rounded-full mb-3">
          {service.tag}
        </span>
        <h3 className="font-display font-bold text-base md:text-lg uppercase tracking-tight text-graphite leading-snug">
          {service.name}
        </h3>
      </div>
      <p className="text-sm text-graphite-mid leading-relaxed flex-1">{service.description}</p>
      <div className="flex items-end justify-between gap-3 pt-2 border-t border-graphite/8">
        <div>
          <div className="text-xs text-graphite-light mb-1">Стоимость</div>
          <div className="font-display font-bold text-lg text-terracotta">{priceDisplay}</div>
          {service.note && <div className="text-xs text-graphite-light mt-1">{service.note}</div>}
        </div>
        {hasCalculator && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs font-medium text-teal hover:text-terracotta transition-colors whitespace-nowrap underline underline-offset-4"
          >
            {open ? 'Свернуть' : 'Рассчитать →'}
          </button>
        )}
      </div>

      {open && service.params && (
        <div className="border-t border-graphite/10 pt-4 space-y-3">
          {service.params.map((param) => (
            <div key={param.id}>
              <label className="block text-xs text-graphite-mid mb-1.5">{param.label}</label>
              {param.type === 'number' ? (
                <input
                  type="number"
                  min={param.min ?? 1}
                  max={param.max}
                  step={param.step ?? 1}
                  value={values[param.id] as number}
                  onChange={(e) => setValues((p) => ({ ...p, [param.id]: Math.max(param.min ?? 0, Number(e.target.value)) }))}
                  className="w-full border border-graphite/20 rounded-xl px-4 py-2 text-sm text-graphite bg-white/60 focus:outline-none focus:border-teal"
                />
              ) : (
                <select
                  value={values[param.id] as string}
                  onChange={(e) => setValues((p) => ({ ...p, [param.id]: e.target.value }))}
                  className="w-full border border-graphite/20 rounded-xl px-4 py-2 text-sm text-graphite bg-white/60 focus:outline-none focus:border-teal"
                >
                  {param.options?.map((opt) => (
                    <option key={opt.label} value={opt.price}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Services({ content }: { content: ServicesContent }) {
  const { sectionLabel, title, honestyBadge, items } = content;

  return (
    <section id="services" className="max-w-[1560px] mx-auto px-6 md:px-16 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-graphite-light font-medium mb-3">{sectionLabel}</p>
          <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tight text-graphite whitespace-pre-line">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-3 bg-teal/10 border border-teal/20 rounded-[16px] px-5 py-3 max-w-sm">
          <span className="w-2 h-2 rounded-full bg-teal shrink-0" />
          <p className="text-sm text-graphite leading-snug">{honestyBadge}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((service, i) => (
          <ServiceCard key={service.id} service={service} bgClass={TILE_BG[i % TILE_BG.length]} />
        ))}
      </div>
    </section>
  );
}
