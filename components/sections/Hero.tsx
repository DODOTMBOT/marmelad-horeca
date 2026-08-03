import { CONTACTS } from '@/config/constants';
import type { HeroContent } from '@/lib/content-types';

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
  const { preHeadline, headline, subtitle, ctaLabel, tags, mainTileBg } = content;

  return (
    <section className="max-w-[1560px] mx-auto px-6 md:px-16 pt-12 pb-16">
      {/* Main tile */}
      <div className={`hero-tile bg-${mainTileBg} tile-shadow rounded-[24px] p-8 md:p-12 flex flex-col gap-6 min-h-[420px] relative overflow-hidden`}>

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
