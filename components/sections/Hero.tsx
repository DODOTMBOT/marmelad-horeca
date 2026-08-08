import { CONTACTS } from '@/config/constants';
import type { HeroContent } from '@/lib/content-types';

const LEGACY_TILE_HEX: Record<string, string> = {
  'tile-mint': '#E2F8EF', 'tile-peach': '#FDF0E3', 'tile-rose': '#F5E8EF',
  'tile-teal': '#E1F5F3', 'tile-cream': '#F5F2ED', 'terracotta': '#E27D60',
  'graphite': '#2C2A27',
};
function resolveBg(v: string) { return v?.startsWith('#') ? v : (LEGACY_TILE_HEX[v] ?? '#F5F2ED'); }

const TAG_CLASSES = [
  'hero-tag-1', 'hero-tag-2', 'hero-tag-3',
  'hero-tag-4', 'hero-tag-5', 'hero-tag-6',
];

function Sparkle({ className, size = 20 }: { className: string; size?: number }) {
  return (
    <span className={`absolute pointer-events-none select-none ${className}`} aria-hidden>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export default function Hero({ content }: { content: HeroContent }) {
  const { preHeadline, headline, subtitle, ctaLabel, tags, mainTileBg, factTileBg, factTitle, factText, factCtaLabel, factCtaHref } = content;

  return (
    <section className="max-w-[1560px] mx-auto px-6 md:px-16 pt-12 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-4">

        {/* Main tile */}
        <div className="hero-tile tile-shadow rounded-[24px] p-8 md:p-12 flex flex-col gap-6 min-h-[420px] relative overflow-hidden" style={{ backgroundColor: resolveBg(mainTileBg) }}>

          {/* Sparkles */}
          <Sparkle className="hero-sparkle hero-sparkle-1 text-terracotta/40 top-10 right-16 md:right-32" size={28} />
          <Sparkle className="hero-sparkle hero-sparkle-2 text-teal/50 top-24 right-8 md:right-20" size={16} />
          <Sparkle className="hero-sparkle hero-sparkle-3 text-terracotta/25 bottom-20 right-24 md:right-40" size={22} />

          <div className="flex-1 relative z-10">
            {preHeadline && (
              <p className="hero-pre text-graphite-mid text-sm font-medium mb-4 tracking-wide">
                {preHeadline}
              </p>
            )}
            <h1 className="hero-headline font-display font-bold text-4xl md:text-6xl xl:text-7xl uppercase tracking-tight text-graphite leading-none mb-6 whitespace-pre-line">
              {headline}
            </h1>
            {subtitle && (
              <p className="hero-subtitle text-graphite-mid text-base md:text-lg max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <div className="hero-buttons flex flex-col sm:flex-row gap-3 relative z-10">
            <a
              href={CONTACTS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-terracotta hover:bg-terracotta-dark text-white font-medium px-7 py-3.5 rounded-full transition-colors text-sm"
            >
              {ctaLabel}
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center border border-graphite/20 hover:border-graphite/40 text-graphite font-medium px-7 py-3.5 rounded-full transition-colors text-sm"
            >
              Посмотреть услуги
            </a>
          </div>
        </div>

        {/* Fact / UTP tile */}
        {factTitle && (
          <div
            className="tile-shadow rounded-[24px] p-8 flex flex-col gap-4 justify-between min-h-[240px] lg:min-h-0"
            style={{ backgroundColor: resolveBg(factTileBg || '#F5F2ED') }}
          >
            <div className="flex flex-col gap-3">
              <p className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tight text-graphite leading-snug whitespace-pre-line">
                {factTitle}
              </p>
              {factText && (
                <p className="text-graphite-mid text-sm leading-relaxed">
                  {factText}
                </p>
              )}
            </div>
            {factCtaLabel && (
              <a
                href={factCtaHref || '#services'}
                className="self-start inline-flex items-center gap-2 border border-graphite/20 hover:border-graphite/40 text-graphite font-medium px-5 py-2.5 rounded-full transition-colors text-sm"
              >
                {factCtaLabel}
                <span aria-hidden>→</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-6">
        {tags.map((tag, i) => (
          <span
            key={tag}
            className={`${TAG_CLASSES[i] ?? 'hero-tag-6'} bg-tile-cream border border-graphite/10 text-graphite-mid text-xs px-4 py-1.5 rounded-full`}
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
