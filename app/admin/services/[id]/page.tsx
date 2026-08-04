import { redirect } from 'next/navigation';
import { getServices } from '@/lib/services';
import ServiceEditor from './ServiceEditor';
import type { ServiceV2 } from '@/lib/content-types';

export default async function ServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = getServices();

  let service: ServiceV2;
  let isNew = false;

  if (id === 'new') {
    isNew = true;
    service = {
      id: '',
      title: '',
      shortDescription: '',
      fullDescription: '',
      tags: [],
      basePrice: 0,
      modifiers: [],
      deliverables: [],
      timeline: '',
      revisions: '',
      excludes: [],
    };
  } else {
    const found = data.items.find((s) => s.id === id);
    if (!found) redirect('/admin/services');
    service = found;
  }

  return <ServiceEditor initial={service} isNew={isNew} />;
}
