'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ServicesData, ServiceV2, ServiceModifier } from '@/lib/content-types';

const TILE_BG = ['bg-tile-mint', 'bg-tile-peach', 'bg-tile-rose', 'bg-tile-teal', 'bg-tile-cream'];

function fmt(n: number) {
  return n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
}

type ValMap = Record<string, number | boolean | string>;

function initValues(service: ServiceV2): ValMap {
  const out: ValMap = {};
  for (const mod of service.modifiers) {
    if (mod.type === 'per_unit') out[mod.id] = mod.defaultValue;
    else if (mod.type === 'checkbox') out[mod.id] = mod.defaultChecked;
    else if (mod.type === 'select') out[mod.id] = mod.defaultOptionId;
  }
  return out;
}

function computeTotal(service: ServiceV2, values: ValMap) {
  let total = service.basePrice;
  const breakdown: { label: string; amount: number }[] = [];
  if (service.basePrice > 0) breakdown.push({ label: 'Базовая цена', amount: service.basePrice });

  for (const mod of service.modifiers) {
    if (mod.type === 'per_unit') {
      const qty = (values[mod.id] as number) ?? mod.defaultValue;
      const amount = mod.pricePerUnit * qty;
      breakdown.push({ label: `${mod.label} — ${qty} ${mod.unitLabel}`, amount });
      total += amount;
    } else if (mod.type === 'checkbox') {
      if (values[mod.id]) {
        breakdown.push({ label: mod.label, amount: mod.addedPrice });
        total += mod.addedPrice;
      }
    } else if (mod.type === 'select') {
      const optId = (values[mod.id] as string) ?? mod.defaultOptionId;
      const opt = mod.options.find((o) => o.id === optId);
      if (opt) {
        if (opt.addedPrice > 0) breakdown.push({ label: opt.label, amount: opt.addedPrice });
        total += opt.addedPrice;
      }
    }
  }

  return { total, breakdown };
}

function minPrice(service: ServiceV2): number {
  let min = service.basePrice;
  for (const mod of service.modifiers) {
    if (mod.type === 'per_unit') min += mod.pricePerUnit * mod.min;
    else if (mod.type === 'select') min += Math.min(...mod.options.map((o) => o.addedPrice));
  }
  return min;
}

// ── Modifier input ─────────────────────────────────────────────────────────────

function ModifierInput({
  mod,
  value,
  onChange,
}: {
  mod: ServiceModifier;
  value: number | boolean | string | undefined;
  onChange: (v: number | boolean | string) => void;
}) {
  if (mod.type === 'per_unit') {
    const qty = (value as number) ?? mod.defaultValue;
    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-graphite-mid">{mod.label}</span>
          <span className="text-sm font-medium text-graphite">
            {qty} {mod.unitLabel}
          </span>
        </div>
        <input
          type="range"
          min={mod.min}
          max={mod.max}
          step={mod.step}
          value={qty}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-teal"
        />
        <div className="flex justify-between text-xs text-graphite-light mt-1">
          <span>{mod.min}</span>
          <span>{mod.max}</span>
        </div>
      </div>
    );
  }

  if (mod.type === 'checkbox') {
    const checked = (value as boolean) ?? mod.defaultChecked;
    return (
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <span
          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
            checked ? 'bg-teal border-teal' : 'border-graphite/25 group-hover:border-teal/50'
          }`}
          onClick={() => onChange(!checked)}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="text-sm text-graphite">
          {mod.label}
          <span className="text-graphite-light ml-1.5">+{fmt(mod.addedPrice)}</span>
        </span>
      </label>
    );
  }

  if (mod.type === 'select') {
    const selected = (value as string) ?? mod.defaultOptionId;
    return (
      <div>
        <p className="text-xs text-graphite-mid mb-2">{mod.label}</p>
        <div className="flex flex-col gap-1.5">
          {mod.options.map((opt) => (
            <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer group">
              <span
                className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                  selected === opt.id ? 'border-teal' : 'border-graphite/25 group-hover:border-teal/50'
                }`}
                onClick={() => onChange(opt.id)}
              >
                {selected === opt.id && <span className="w-2 h-2 rounded-full bg-teal" />}
              </span>
              <input
                type="radio"
                className="sr-only"
                name={mod.id}
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => onChange(opt.id)}
              />
              <span className="text-sm text-graphite flex-1">{opt.label}</span>
              {opt.addedPrice > 0 && (
                <span className="text-xs text-graphite-light">+{fmt(opt.addedPrice)}</span>
              )}
            </label>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ── Service card ───────────────────────────────────────────────────────────────

export function ServiceCard({ service, bgClass }: { service: ServiceV2; bgClass: string }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(() => initValues(service));

  const hasCalc = service.modifiers.length > 0;
  const { total, breakdown } = computeTotal(service, values);
  const priceLabel = hasCalc ? `от ${fmt(minPrice(service))}` : fmt(service.basePrice);

  function setValue(id: string, v: number | boolean | string) {
    setValues((p) => ({ ...p, [id]: v }));
  }

  function handleCta() {
    const el = document.getElementById('contacts');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className={`${bgClass} tile-shadow rounded-[24px] p-6 flex flex-col gap-4`}>
      {/* Tags + title */}
      <div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block border border-graphite/15 text-graphite-mid text-xs px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-display font-bold text-base md:text-lg uppercase tracking-tight text-graphite leading-snug">
          {service.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-graphite-mid leading-relaxed flex-1">{service.shortDescription}</p>

      {/* Meta: срок + правки */}
      {(service.timeline || service.revisions) && (
        <div className="flex flex-wrap gap-2">
          {service.timeline && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/60 border border-graphite/10 text-graphite-mid px-3 py-1.5 rounded-full">
              <svg className="w-3 h-3 opacity-60" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7 4v3.5l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              {service.timeline}
            </span>
          )}
          {service.revisions && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/60 border border-graphite/10 text-graphite-mid px-3 py-1.5 rounded-full">
              <svg className="w-3 h-3 opacity-60" viewBox="0 0 14 14" fill="none">
                <path d="M2 7a5 5 0 1 0 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M2 4v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {service.revisions}
            </span>
          )}
        </div>
      )}

      {/* Deliverables */}
      {service.deliverables && service.deliverables.length > 0 && (
        <div className="border-t border-graphite/8 pt-3">
          <p className="text-xs font-medium text-graphite mb-2">Что вы получите</p>
          <ul className="flex flex-col gap-1.5">
            {service.deliverables.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-graphite-mid">
                <svg className="w-3.5 h-3.5 text-teal shrink-0 mt-0.5" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Excludes */}
      {service.excludes && service.excludes.length > 0 && (
        <div className="border-t border-graphite/8 pt-3">
          <p className="text-xs font-medium text-graphite-light mb-2">Не входит</p>
          <ul className="flex flex-col gap-1.5">
            {service.excludes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-graphite-light">
                <svg className="w-3 h-3 shrink-0 mt-0.5 opacity-50" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price row */}
      <div className="flex items-end justify-between gap-3 pt-2 border-t border-graphite/8">
        <div>
          <div className="text-xs text-graphite-light mb-1">Стоимость</div>
          <div className="font-display font-bold text-lg text-terracotta">
            {open ? fmt(total) : priceLabel}
          </div>
        </div>
        {hasCalc && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs font-medium text-teal hover:text-terracotta transition-colors whitespace-nowrap underline underline-offset-4"
          >
            {open ? 'Свернуть' : 'Рассчитать →'}
          </button>
        )}
      </div>

      {/* Calculator */}
      {open && (
        <div className="border-t border-graphite/10 pt-4 flex flex-col gap-4">
          {/* Inputs */}
          <div className="flex flex-col gap-4">
            {service.modifiers.map((mod) => (
              <ModifierInput
                key={mod.id}
                mod={mod}
                value={values[mod.id]}
                onChange={(v) => setValue(mod.id, v)}
              />
            ))}
          </div>

          {/* Breakdown */}
          <div className="bg-white/60 rounded-[16px] p-4">
            {breakdown.map((line, i) => (
              <div key={i} className="flex items-start justify-between text-sm py-1 gap-3">
                <span className="text-graphite-mid leading-snug">{line.label}</span>
                <span className="text-graphite font-medium shrink-0">{fmt(line.amount)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-graphite/10">
              <span className="font-display font-bold text-sm uppercase tracking-tight text-graphite">
                Итого
              </span>
              <span className="font-display font-bold text-xl text-terracotta">{fmt(total)}</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleCta}
            className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-medium py-3 rounded-full transition-colors text-sm"
          >
            Оставить заявку
          </button>
        </div>
      )}
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────

export default function Services({ content }: { content: ServicesData }) {
  const { sectionLabel, title, honestyBadge, items } = content;

  return (
    <section id="services" className="max-w-[1560px] mx-auto px-6 md:px-16 py-16">
      <div className="flex items-end justify-between mb-10 gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-graphite-light font-medium mb-3">
            {sectionLabel}
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tight text-graphite whitespace-pre-line">
            {title}
          </h2>
        </div>
        <Link
          href="/services"
          className="shrink-0 border border-graphite/20 hover:border-graphite/40 text-graphite text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
        >
          Все услуги →
        </Link>
      </div>
      {honestyBadge && (
        <div className="flex items-center gap-3 bg-teal/10 border border-teal/20 rounded-[16px] px-5 py-3 max-w-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-teal shrink-0" />
          <p className="text-sm text-graphite leading-snug">{honestyBadge}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((service, i) => (
          <ServiceCard key={service.id} service={service} bgClass={TILE_BG[i % TILE_BG.length]} />
        ))}
      </div>
    </section>
  );
}
