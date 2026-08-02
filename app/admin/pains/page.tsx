import { getContent } from '@/lib/content';
import PainsEditor from './PainsEditor';

export default function PainsPage() {
  const content = getContent();
  return <PainsEditor initial={content.pains} />;
}
