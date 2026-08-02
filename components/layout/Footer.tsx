import Image from 'next/image';
import { SITE_NAME, CONTACTS } from '@/config/constants';

export default function Footer() {
  return (
    <footer className="border-t border-graphite/10 mt-24">
      <div className="max-w-[1560px] mx-auto px-6 md:px-16 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt={SITE_NAME} width={24} height={24} className="h-6 w-6 opacity-70" />
          <span className="font-display font-bold text-sm uppercase tracking-tight text-graphite">
            {SITE_NAME}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm text-graphite-mid">
          <a
            href={CONTACTS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-graphite transition-colors"
          >
            Телеграм
          </a>
          <a
            href={`tel:${CONTACTS.phone.replace(/\D/g, '')}`}
            className="hover:text-graphite transition-colors"
          >
            {CONTACTS.phone}
          </a>
          <a
            href={`mailto:${CONTACTS.email}`}
            className="hover:text-graphite transition-colors"
          >
            {CONTACTS.email}
          </a>
        </div>

        <span className="text-sm text-graphite-light">
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
