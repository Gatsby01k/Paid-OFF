import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PaidOFF — AI Trading',
  description: 'Торгуй с роботом и включай 3D, когда захочешь.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-dvh selection:bg-amber-400/40 selection:text-black">
        {children}
      </body>
    </html>
  );
}
