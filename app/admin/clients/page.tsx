import { getContent } from '@/lib/content';
import ClientsEditor from './ClientsEditor';

export default function ClientsPage() {
  return <ClientsEditor initial={getContent().clients} />;
}
