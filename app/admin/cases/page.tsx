import { getContent } from '@/lib/content';
import CasesEditor from './CasesEditor';

export default function CasesPage() {
  return <CasesEditor initial={getContent().cases} />;
}
