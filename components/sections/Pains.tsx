import type { PainsContent } from '@/lib/content-types';

export default function Pains({ content }: { content: PainsContent }) {
  const { sectionLabel, title, items } = content;

  return (
    <section id="pains" className="max-w-[1560px] mx-auto px-6 md:px-16 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-graphite-light font-medium mb-3">
          {sectionLabel}
        </p>
        <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tight text-graphite whitespace-pre-line">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className={`bg-${item.bg} tile-shadow rounded-[24px] p-7 flex flex-col justify-between min-h-[180px] ${
              i === items.length - 1 && items.length % 3 !== 0 ? 'sm:col-span-2 xl:col-span-1' : ''
            }`}
          >
            {item.label && (
              <span className="inline-block border border-graphite/20 text-graphite-mid text-xs px-3 py-1 rounded-full self-start mb-4">
                {item.label}
              </span>
            )}
            <p className="font-display font-bold text-xl uppercase tracking-tight text-graphite leading-snug mt-auto">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
