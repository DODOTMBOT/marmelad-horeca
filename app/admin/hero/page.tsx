import { getContent } from '@/lib/content';
import HeroEditor from './HeroEditor';

export default function HeroPage() {
  const content = getContent();
  return <HeroEditor initial={content.hero} />;
}
