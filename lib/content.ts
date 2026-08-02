import fs from 'fs';
import path from 'path';
import type { SiteContent } from './content-types';

const CONTENT_PATH = path.join(process.cwd(), 'data', 'content.json');

export function getContent(): SiteContent {
  const raw = fs.readFileSync(CONTENT_PATH, 'utf-8');
  return JSON.parse(raw) as SiteContent;
}

export function saveContent(content: SiteContent): void {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2), 'utf-8');
}

export function updateSection<K extends keyof SiteContent>(
  key: K,
  value: SiteContent[K]
): void {
  const content = getContent();
  content[key] = value;
  saveContent(content);
}
