import { getContent } from '@/lib/content';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Pains from '@/components/sections/Pains';
import Services from '@/components/sections/Services';
import Clients from '@/components/sections/Clients';
import Cases from '@/components/sections/Cases';
import Team from '@/components/sections/Team';
import Process from '@/components/sections/Process';
import About from '@/components/sections/About';
import Contacts from '@/components/sections/Contacts';

export const dynamic = 'force-dynamic';

const SECTION_COMPONENTS: Record<string, (content: ReturnType<typeof getContent>) => React.ReactNode> = {
  hero:     (c) => <Hero key="hero" content={c.hero} />,
  pains:    (c) => <Pains key="pains" content={c.pains} />,
  services: (c) => <Services key="services" content={c.services} />,
  clients:  (c) => <Clients key="clients" content={c.clients} />,
  cases:    (c) => <Cases key="cases" content={c.cases} />,
  team:     (c) => <Team key="team" content={c.team} />,
  process:  (c) => <Process key="process" content={c.process} />,
  about:    (c) => <About key="about" content={c.about} />,
  contacts: (c) => <Contacts key="contacts" content={c.contacts} />,
};

export default function Home() {
  const content = getContent();
  const { sections } = content.layout;

  return (
    <>
      <Header />
      <main>
        {sections
          .filter((s) => s.visible)
          .map((s) => SECTION_COMPONENTS[s.id]?.(content))}
      </main>
      <Footer />
    </>
  );
}
