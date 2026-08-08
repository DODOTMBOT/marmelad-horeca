import { CONTACTS } from '@/config/constants';
import type { AboutContent } from '@/lib/content-types';

const LEGACY_TILE_HEX: Record<string, string> = {
  'tile-mint': '#E2F8EF', 'tile-peach': '#FDF0E3', 'tile-rose': '#F5E8EF',
  'tile-teal': '#E1F5F3', 'tile-cream': '#F5F2ED', 'terracotta': '#E27D60',
  'graphite': '#2C2A27',
};
function resolveBg(v: string) { return v?.startsWith('#') ? v : (LEGACY_TILE_HEX[v] ?? '#F5F2ED'); }

export default function About({ content }: { content: AboutContent }) {
  const { sectionLabel, title, text1, text2, ctaLabel, mainTileBg, values } = content;

  return (
    <section id="about" className="max-w-[1560px] mx-auto px-6 md:px-16 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="tile-shadow rounded-[24px] p-8 md:p-10 flex flex-col gap-6" style={{ backgroundColor: resolveBg(mainTileBg) }}>
          <div>
            <p className="text-xs uppercase tracking-widest text-graphite-light font-medium mb-3">{sectionLabel}</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight text-graphite leading-tight">{title}</h2>
          </div>
          <p className="text-graphite-mid leading-relaxed">{text1}</p>
          <p className="text-graphite-mid leading-relaxed">{text2}</p>
          <a
            href={CONTACTS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start inline-flex items-center bg-terracotta hover:bg-terracotta-dark text-white font-medium px-7 py-3.5 rounded-full transition-colors text-sm"
          >
            {ctaLabel}
          </a>
        </div>

        <div className="bg-graphite tile-shadow rounded-[24px] p-8 md:p-10 flex flex-col gap-5">
          <p className="text-xs uppercase tracking-widest text-white/30 font-medium">Принципы</p>
          {values.map(({ title: vt, desc }) => (
            <div key={vt} className="border-b border-white/8 pb-5 last:border-0 last:pb-0">
              <h3 className="font-display font-bold text-sm uppercase tracking-tight text-white mb-1">{vt}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
