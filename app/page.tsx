import { getContent } from '@/lib/content';
import { getServices } from '@/lib/services';
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

export default function Home() {
  const content = getContent();
  const services = getServices();

  const SECTIONS: Record<string, React.ReactNode> = {
    hero:     <Hero content={content.hero} />,
    pains:    <Pains content={content.pains} />,
    services: <Services content={services} />,
    clients:  <Clients content={content.clients} />,
    cases:    <Cases content={content.cases} />,
    team:     <Team content={content.team} />,
    process:  <Process content={content.process} />,
    about:    <About content={content.about} />,
    contacts: <Contacts content={content.contacts} />,
  };

  return (
    <>
      <Header />
      <main>
        {content.layout.sections
          .filter((s) => s.visible)
          .map((s) =>
            SECTIONS[s.id] ? (
              <div key={s.id}>{SECTIONS[s.id]}</div>
            ) : null
          )}
      </main>
      <Footer />
    </>
  );
}
