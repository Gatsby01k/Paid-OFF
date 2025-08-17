import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PaidOFF — AI Crypto Trading",
  description:
    "Automated trading with AI. Clean awwwards-like UI, risk management, backtesting and ROI simulation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-gradient-to-b from-yellow-200 to-yellow-400 text-black">
        {children}
      </body>
    </html>
  );
}
