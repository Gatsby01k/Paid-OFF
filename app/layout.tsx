import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PaidOFF – AI Crypto Trading",
  description: "Automated trading with artificial intelligence. Risk management, backtesting and clean interface awwwards level.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-yellow-200 to-yellow-400 text-black font-sans">
        {children}
      </body>
    </html>
  );
}
