'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_NAME, CTA_LABEL, CONTACTS } from '@/config/constants';

const NAV_LINKS = [
  { label: 'Услуги', href: '#services' },
  { label: 'Кейсы', href: '/cases' },
  { label: 'Команда', href: '#team' },
  { label: 'Контакты', href: '#contacts' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-graphite/8">
      <div className="max-w-[1560px] mx-auto px-6 md:px-16 h-28 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-4 shrink-0">
          <Image src="/logo.svg" alt={SITE_NAME} width={96} height={96} className="h-24 w-24" />
          <span className="font-display font-bold text-2xl uppercase tracking-tight text-graphite">
            {SITE_NAME}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-graphite-mid hover:text-graphite transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={CONTACTS.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center bg-terracotta hover:bg-terracotta-dark text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors shrink-0"
        >
          {CTA_LABEL}
        </a>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 -mr-2 text-graphite"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Меню"
        >
          <span className="block w-5 h-0.5 bg-current mb-1.5" />
          <span className="block w-5 h-0.5 bg-current mb-1.5" />
          <span className="block w-3 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-graphite/8 bg-cream px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 text-sm text-graphite border-b border-graphite/8 last:border-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href={CONTACTS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center bg-terracotta text-white text-sm font-medium px-5 py-3 rounded-full"
          >
            {CTA_LABEL}
          </a>
        </div>
      )}
    </header>
  );
}
