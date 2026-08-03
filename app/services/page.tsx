import { getServices } from '@/lib/services';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServicesGrid from './ServicesGrid';

export const dynamic = 'force-dynamic';

export default function ServicesPage() {
  const services = getServices();

  return (
    <>
      <Header />
      <main className="max-w-[1560px] mx-auto px-6 md:px-16 py-16">
        <div className="mb-12">
          <a href="/" className="text-xs text-graphite-light hover:text-graphite transition-colors mb-4 inline-block">
            ← На главную
          </a>
          <p className="text-xs uppercase tracking-widest text-graphite-light font-medium mb-3">
            {services.sectionLabel}
          </p>
          <h1 className="font-display font-bold text-3xl md:text-6xl uppercase tracking-tight text-graphite">
            {services.title}
          </h1>
        </div>

        {services.items.length === 0 ? (
          <div className="bg-tile-cream rounded-[24px] p-16 text-center">
            <p className="text-graphite-mid">Услуги появятся здесь скоро</p>
          </div>
        ) : (
          <ServicesGrid items={services.items} />
        )}
      </main>
      <Footer />
    </>
  );
}
