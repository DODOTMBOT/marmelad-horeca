import Link from 'next/link';
import type { CasesContent, CaseItem } from '@/lib/content-types';

function isColorDark(hex: string): boolean {
  const h = hex.replace('#', '');
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 160;
}

export function CaseCard({ c }: { c: CaseItem }) {
  const isEmpty = !c.result && !c.description && !c.client;
  const dark = isColorDark(c.bg || '#F5F2ED');
  const textMain = dark ? 'text-white' : 'text-graphite';
  const textMuted = dark ? 'text-white/70' : 'text-graphite-mid';
  const tagStyle = dark
    ? 'border-white/30 text-white/90'
    : 'border-graphite/20 text-graphite-mid';

  return (
    <div
      className="rounded-[24px] p-7 flex flex-col min-h-[380px]"
      style={{ backgroundColor: c.bg || '#F5F2ED' }}
    >
      {isEmpty ? (
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="inline-block border border-graphite/15 text-graphite-light text-xs px-3 py-1 rounded-full">
              Скоро
            </span>
            <div className="h-10 bg-graphite/8 rounded-2xl w-2/3 mt-4" />
            <div className="h-4 bg-graphite/6 rounded-full w-3/4" />
            <div className="h-4 bg-graphite/6 rounded-full w-1/2" />
          </div>
          <div className="flex gap-2 mt-6">
            <div className="h-7 w-16 bg-graphite/8 rounded-full" />
            <div className="h-7 w-20 bg-graphite/8 rounded-full" />
          </div>
        </div>
      ) : (
        <>
          {/* Logo */}
          {c.logoPath && (
            <div className="mb-5 h-10 flex items-center">
              <img
                src={c.logoPath}
                alt={c.client}
                className="max-h-10 max-w-[140px] object-contain object-left"
                style={{ mixBlendMode: dark ? 'luminosity' : 'multiply' }}
              />
            </div>
          )}

          {/* Result metric */}
          {c.result && (
            <div className="mb-4">
              <div className={`font-display font-bold text-5xl md:text-6xl leading-none ${textMain}`}>
                {c.result}
              </div>
              {c.resultLabel && (
                <div className={`text-sm mt-1.5 flex items-center gap-1.5 ${textMuted}`}>
                  {c.resultLabel}
                  <svg className="w-3.5 h-3.5 opacity-60" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2v10M3 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {c.description && (
            <p className={`text-sm leading-relaxed flex-1 whitespace-pre-line ${textMuted}`}>
              {c.description}
            </p>
          )}

          {/* Tags */}
          {c.tags && c.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {c.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-3 py-1.5 rounded-full border ${tagStyle}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function Cases({ content }: { content: CasesContent }) {
  const { sectionLabel, title, items } = content;

  return (
    <section id="cases" className="max-w-[1560px] mx-auto px-6 md:px-16 py-16">
      <div className="flex items-end justify-between mb-10 gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-graphite-light font-medium mb-3">{sectionLabel}</p>
          <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tight text-graphite">{title}</h2>
        </div>
        <Link
          href="/cases"
          className="shrink-0 border border-graphite/20 hover:border-graphite/40 text-graphite text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
        >
          Все кейсы →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {items.map((c, i) => (
          <CaseCard key={i} c={c} />
        ))}
      </div>
    </section>
  );
}
