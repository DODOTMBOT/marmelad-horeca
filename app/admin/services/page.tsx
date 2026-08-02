import { getContent } from '@/lib/content';
import ServicesEditor from './ServicesEditor';

export default function ServicesPage() {
  const content = getContent();
  return <ServicesEditor initial={content.services} />;
}
