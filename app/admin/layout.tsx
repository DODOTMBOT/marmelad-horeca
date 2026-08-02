import Link from 'next/link';
import { SITE_NAME } from '@/config/constants';

const SECTIONS = [
  { href: '/admin/hero', label: 'Hero — главный экран' },
  { href: '/admin/pains', label: 'Боли — Это для вас' },
  { href: '/admin/services', label: 'Услуги и цены' },
  { href: '/admin/clients', label: 'Клиенты' },
  { href: '/admin/cases', label: 'Кейсы' },
  { href: '/admin/team', label: 'Команда' },
  { href: '/admin/process', label: 'Как работаем' },
  { href: '/admin/about', label: 'О нас' },
  { href: '/admin/contacts', label: 'Контакты' },
  { href: '/admin/layout', label: 'Структура страницы' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F0EDE8] flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-graphite min-h-screen flex flex-col">
        <div className="p-6 border-b border-white/8">
          <Link href="/admin" className="font-display font-bold text-sm uppercase tracking-tight text-white">
            {SITE_NAME}
          </Link>
          <p className="text-xs text-white/30 mt-1">Панель управления</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="text-sm text-white/60 hover:text-white hover:bg-white/8 px-3 py-2 rounded-xl transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/8 flex flex-col gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Открыть сайт →
          </a>
          <a
            href="/api/admin/logout"
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Выйти
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
