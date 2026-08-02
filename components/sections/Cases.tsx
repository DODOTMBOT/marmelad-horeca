import type { CasesContent } from '@/lib/content-types';

export default function Cases({ content }: { content: CasesContent }) {
  const { sectionLabel, title, items } = content;

  return (
    <section id="cases" className="max-w-[1560px] mx-auto px-6 md:px-16 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-graphite-light font-medium mb-3">{sectionLabel}</p>
        <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tight text-graphite">{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((c, i) => {
          const isEmpty = !c.client && !c.task && !c.result;
          return (
            <div key={i} className={`bg-${c.bg} tile-shadow rounded-[24px] p-7 min-h-[280px] flex flex-col justify-between`}>
              {isEmpty ? (
                <>
                  {/* TODO: заполнит владелец */}
                  <div className="space-y-3">
                    <span className="inline-block border border-graphite/15 text-graphite-light text-xs px-3 py-1 rounded-full">
                      Скоро
                    </span>
                    <div className="h-4 bg-graphite/10 rounded-full w-3/4" />
                    <div className="h-4 bg-graphite/10 rounded-full w-1/2" />
                  </div>
                  <div className="border-t border-graphite/10 pt-4">
                    <div className="font-display font-bold text-2xl text-graphite/20 uppercase">— %</div>
                    <div className="text-xs text-graphite-light mt-1">результат</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <span className="inline-block border border-graphite/15 text-graphite-mid text-xs px-3 py-1 rounded-full">
                      {c.client}
                    </span>
                    {c.task && <p className="font-display font-bold text-base uppercase tracking-tight text-graphite leading-snug">{c.task}</p>}
                    {c.whatWeDid && <p className="text-sm text-graphite-mid leading-relaxed">{c.whatWeDid}</p>}
                  </div>
                  {c.result && (
                    <div className="border-t border-graphite/10 pt-4">
                      <div className="font-display font-bold text-2xl text-graphite uppercase">{c.result}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
