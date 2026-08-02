import Image from 'next/image';
import type { ClientsContent } from '@/lib/content-types';

export default function Clients({ content }: { content: ClientsContent }) {
  const { sectionLabel, clients } = content;

  return (
    <section className="max-w-[1560px] mx-auto px-6 md:px-16 py-12">
      <p className="text-xs uppercase tracking-widest text-graphite-light font-medium mb-8">
        {sectionLabel}
      </p>
      <div className="flex flex-wrap items-center gap-4 md:gap-8">
        {clients.map((c) => (
          <div
            key={c.name}
            className="h-10 px-6 rounded-full border border-graphite/15 flex items-center justify-center"
          >
            {c.logoPath ? (
              <Image src={c.logoPath} alt={c.name} width={80} height={24} className="object-contain max-h-6" />
            ) : (
              <span className="text-sm text-graphite-light font-medium">{c.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
