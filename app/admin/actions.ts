'use server';

import { revalidatePath } from 'next/cache';
import { updateSection } from '@/lib/content';
import type {
  HeroContent,
  PainsContent,
  ServicesContent,
  ClientsContent,
  CasesContent,
  TeamContent,
  ProcessContent,
  AboutContent,
  ContactsContent,
  LayoutContent,
} from '@/lib/content-types';

function save<K extends Parameters<typeof updateSection>[0]>(
  key: K,
  value: Parameters<typeof updateSection<K>>[1]
) {
  updateSection(key, value);
  revalidatePath('/');
}

export async function saveHero(data: HeroContent) { save('hero', data); }
export async function savePains(data: PainsContent) { save('pains', data); }
export async function saveServices(data: ServicesContent) { save('services', data); }
export async function saveClients(data: ClientsContent) { save('clients', data); }
export async function saveCases(data: CasesContent) { save('cases', data); }
export async function saveTeam(data: TeamContent) { save('team', data); }
export async function saveProcess(data: ProcessContent) { save('process', data); }
export async function saveAbout(data: AboutContent) { save('about', data); }
export async function saveContacts(data: ContactsContent) { save('contacts', data); }
export async function saveLayout(data: LayoutContent) { save('layout', data); }
