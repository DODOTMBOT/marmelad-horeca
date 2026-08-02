import { getContent } from '@/lib/content';
import TeamEditor from './TeamEditor';

export default function TeamPage() {
  return <TeamEditor initial={getContent().team} />;
}
