'use client';

import { ServiceCard } from '@/components/sections/Services';
import type { ServiceV2 } from '@/lib/content-types';

const TILE_BG = ['bg-tile-mint', 'bg-tile-peach', 'bg-tile-rose', 'bg-tile-teal', 'bg-tile-cream'];

export default function ServicesGrid({ items }: { items: ServiceV2[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((service, i) => (
        <ServiceCard key={service.id} service={service} bgClass={TILE_BG[i % TILE_BG.length]} />
      ))}
    </div>
  );
}
