import { getContent } from '@/lib/content';
import ProcessEditor from './ProcessEditor';

export default function ProcessPage() {
  return <ProcessEditor initial={getContent().process} />;
}
