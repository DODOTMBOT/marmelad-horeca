export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getServices } from '@/lib/services';
import ServicesListClient from './ServicesListClient';

export default function AdminServicesPage() {
  const data = getServices();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <a href="/admin" className="text-xs text-graphite-light hover:text-graphite mb-1 block">
            ← Назад к панели
          </a>
          <h1 className="font-display font-bold text-2xl uppercase tracking-tight text-graphite">
            Услуги
          </h1>
          <p className="text-sm text-graphite-mid mt-1">
            {data.items.length} услуг · редактируйте, удаляйте, добавляйте
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="shrink-0 bg-terracotta hover:bg-terracotta-dark text-white font-medium px-6 py-2.5 rounded-full transition-colors text-sm"
        >
          + Новая услуга
        </Link>
      </div>

      <ServicesListClient items={data.items} />
    </div>
  );
}
