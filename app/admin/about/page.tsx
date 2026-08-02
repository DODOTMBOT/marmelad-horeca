import { getContent } from '@/lib/content';
import AboutEditor from './AboutEditor';

export default function AboutPage() {
  return <AboutEditor initial={getContent().about} />;
}
