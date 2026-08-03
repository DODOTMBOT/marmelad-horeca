import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SITE_NAME } from '@/config/constants';

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
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen bg-cream text-graphite font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
