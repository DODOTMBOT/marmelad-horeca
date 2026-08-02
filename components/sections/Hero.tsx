import { CONTACTS } from '@/config/constants';
import type { HeroContent } from '@/lib/content-types';

export default function Hero({ content }: { content: HeroContent }) {
  const { preHeadline, headline, subtitle, ctaLabel, badgeNumber, badgeLabel, factTitle, tags, mainTileBg, factTileBg } = content;

  return (
    <section className="max-w-[1560px] mx-auto px-6 md:px-16 pt-12 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4">
        {/* Main tile */}
        <div className={`bg-${mainTileBg} tile-shadow rounded-[24px] p-8 md:p-12 flex flex-col gap-6 min-h-[420px]`}>
          <div className="flex-1">
            {preHeadline && (
              <p className="text-graphite-mid text-sm font-medium mb-4 tracking-wide">
                {preHeadline}
              </p>
            )}
            <h1 className="font-display font-bold text-4xl md:text-6xl xl:text-7xl uppercase tracking-tight text-graphite leading-none mb-6 whitespace-pre-line">
              {headline}
            </h1>
            <p className="text-graphite-mid text-base md:text-lg max-w-xl leading-relaxed">
              {subtitle}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
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

        {/* Right column */}
        <div className="flex flex-row md:flex-col gap-4">
          {/* Stamp */}
          <div className="bg-terracotta tile-shadow rounded-[24px] flex-1 md:flex-none md:aspect-square flex flex-col items-center justify-center p-6 text-center">
            <div className="border-2 border-white/30 rounded-full w-full aspect-square flex flex-col items-center justify-center gap-1 p-4">
              <span className="font-display font-bold text-white text-3xl md:text-4xl leading-none">
                {badgeNumber}
              </span>
              <span className="font-display font-bold text-white/80 text-xs uppercase tracking-widest leading-tight whitespace-pre-line text-center">
                {badgeLabel}
              </span>
            </div>
          </div>

          {/* Fact */}
          <div className={`bg-${factTileBg} tile-shadow rounded-[24px] flex-1 md:flex-none p-6 flex flex-col justify-between`}>
            <span className="text-xs text-graphite-mid uppercase tracking-widest font-medium">Опыт</span>
            <p className="font-display font-bold text-2xl text-graphite uppercase tracking-tight leading-tight whitespace-pre-line">
              {factTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-6">
        {tags.map((tag) => (
          <span key={tag} className="bg-tile-cream border border-graphite/10 text-graphite-mid text-xs px-4 py-1.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
