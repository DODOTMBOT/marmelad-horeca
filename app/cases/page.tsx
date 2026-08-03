import { getContent } from '@/lib/content';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CaseCard } from '@/components/sections/Cases';

export const dynamic = 'force-dynamic';

export default function CasesPage() {
  const { cases } = getContent();
  const filled = cases.items.filter((c) => c.result || c.description || c.client);

  return (
    <>
      <Header />
      <main className="max-w-[1560px] mx-auto px-6 md:px-16 py-16">
        <div className="mb-12">
          <a href="/" className="text-xs text-graphite-light hover:text-graphite transition-colors mb-4 inline-block">
            ← На главную
          </a>
          <p className="text-xs uppercase tracking-widest text-graphite-light font-medium mb-3">
            {cases.sectionLabel}
          </p>
          <h1 className="font-display font-bold text-3xl md:text-6xl uppercase tracking-tight text-graphite">
            {cases.title}
          </h1>
        </div>

        {filled.length === 0 ? (
          <div className="bg-tile-cream rounded-[24px] p-16 text-center">
            <p className="text-graphite-mid">Кейсы появятся здесь скоро</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
            {filled.map((c, i) => (
              <CaseCard key={i} c={c} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
