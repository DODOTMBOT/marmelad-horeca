'use server';

import { revalidatePath } from 'next/cache';
import { getServices, saveServices } from '@/lib/services';
import type { ServiceV2, ServicesData } from '@/lib/content-types';

export async function actionSaveServicesMeta(
  meta: Pick<ServicesData, 'sectionLabel' | 'title' | 'honestyBadge'>
) {
  const data = getServices();
  data.sectionLabel = meta.sectionLabel;
  data.title = meta.title;
  data.honestyBadge = meta.honestyBadge;
  saveServices(data);
  revalidatePath('/');
}

export async function actionUpsertService(service: ServiceV2) {
  const data = getServices();
  const idx = data.items.findIndex((s) => s.id === service.id);
  if (idx >= 0) {
    data.items[idx] = service;
  } else {
    data.items.push(service);
  }
  saveServices(data);
  revalidatePath('/');
  revalidatePath('/admin/services');
}

export async function actionDeleteService(id: string) {
  const data = getServices();
  data.items = data.items.filter((s) => s.id !== id);
  saveServices(data);
  revalidatePath('/');
}

export async function actionReorderServices(ids: string[]) {
  const data = getServices();
  const map = Object.fromEntries(data.items.map((s) => [s.id, s]));
  data.items = ids.map((id) => map[id]).filter(Boolean);
  saveServices(data);
  revalidatePath('/');
}
