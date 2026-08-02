import { getContent } from '@/lib/content';
import LayoutEditor from './LayoutEditor';

export default function LayoutPage() {
  return <LayoutEditor initial={getContent().layout} />;
}
