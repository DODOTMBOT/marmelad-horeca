import { getContent } from '@/lib/content';
import ContactsEditor from './ContactsEditor';

export default function ContactsPage() {
  return <ContactsEditor initial={getContent().contacts} />;
}
