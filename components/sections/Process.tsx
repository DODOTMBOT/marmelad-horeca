import type { ProcessContent } from '@/lib/content-types';

export default function Process({ content }: { content: ProcessContent }) {
  const { sectionLabel, title, steps } = content;

  return (
    <section className="max-w-[1560px] mx-auto px-6 md:px-16 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-graphite-light font-medium mb-3">{sectionLabel}</p>
        <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tight text-graphite">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {steps.map((step) => (
          <div key={step.n} className="bg-tile-cream tile-shadow rounded-[24px] p-6 flex flex-col gap-3">
            <span className="font-display font-bold text-3xl text-graphite/15 leading-none">{step.n}</span>
            <h3 className="font-display font-bold text-sm uppercase tracking-tight text-graphite">{step.title}</h3>
            <p className="text-sm text-graphite-mid leading-relaxed">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
