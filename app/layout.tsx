import type { Metadata } from 'next';
import { Unbounded, Inter } from 'next/font/google';
import './globals.css';
import { SITE_NAME } from '@/config/constants';

const unbounded = Unbounded({
  variable: '--font-unbounded',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${SITE_NAME} — digital-консалтинг для HoReCa`,
  description:
    'Наводим порядок в качестве, операционке и запусках для ресторанов, кафе и dark kitchen. Настройка iiko/R-Keeper, стандарты, финмодели.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-cream text-graphite font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
