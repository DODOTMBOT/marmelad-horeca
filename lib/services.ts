import fs from 'fs';
import path from 'path';
import type { ServicesData } from './content-types';

const SERVICES_PATH = path.join(process.cwd(), 'data', 'services.json');

export function getServices(): ServicesData {
  const raw = fs.readFileSync(SERVICES_PATH, 'utf-8');
  return JSON.parse(raw) as ServicesData;
}

export function saveServices(data: ServicesData): void {
  fs.writeFileSync(SERVICES_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
