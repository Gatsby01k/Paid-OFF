import './globals.css';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

const mont = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400','700','800','900'],
  style: ['normal','italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PaidOFF — Automated Trading (AI)',
  description: 'Automated crypto trading with clean UI and ROI simulation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={mont.className}>
        {children}
      </body>
    </html>
  );
}
