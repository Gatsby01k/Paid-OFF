"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

/* ==== простая симуляция под график ==== */
type RiskMode = "low" | "medium" | "high";
type Term = 1 | 7 | 30 | 90;

const RISK: Record<RiskMode, { daily: number; noise: number }> = {
  low: { daily: 0.001, noise: 0.002 },
  medium: { daily: 0.002, noise: 0.005 },
  high: { daily: 0.004, noise: 0.012 },
};

function simulate(term: Term, deposit: number, risk: RiskMode) {
  const cfg = RISK[risk];
  const data: { name: string; balance: number }[] = [];
  let bal = deposit;
  for (let d = 0; d <= term; d++) {
    if (d > 0) {
      const drift = bal * cfg.daily;
      const noise = bal * (Math.random() * cfg.noise - cfg.noise / 2);
      bal = Math.max(0, bal + drift + noise);
    }
    data.push({ name: `${d}d`, balance: +bal.toFixed(2) });
  }
  const pnl = +(bal - deposit).toFixed(2);
  const roi = +((bal / deposit - 1) * 100).toFixed(2);
  return { data, pnl, roi, end: +bal.toFixed(2) };
}

export default function Page() {
  const [risk, setRisk] = useState<RiskMode>("medium");
  const [term, setTerm] = useState<Term>(30);
  const [deposit, setDeposit] = useState(500);
  const { data, pnl, roi, end } = useMemo(
    () => simulate(term, deposit, risk),
    [term, deposit, risk]
  );

  // Плавное появление секций на скролле
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add("show");
        }),
      { threshold: 0.18 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main ref={rootRef} className="min-h-screen flex flex-col">
      {/* NAV */}
      <header className="container-aw flex items-center justify-between py-6">
        <div className="text-base md:text-lg font-extrabold tracking-widest">
          PAIDOFF
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="hover:opacity-70" href="#about">About</a>
          <a className="hover:opacity-70" href="#features">Algorithms</a>
          <a className="hover:opacity-70" href="#contact">Contact</a>
          <Link
            href="#getstarted"
            className="bg-black text-yellow-300 px-5 py-2 rounded-full shadow-[0_14px_36px_rgba(0,0,0,.35)] hover:scale-[1.03] transition"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* HERO — фикс сетки и размеров */}
      <section
        className="
          container-aw
          grid grid-cols-1 md:grid-cols-12
          gap-10 md:gap-12
          items-center
          pt-6 md:pt-4
          pb-12 md:pb-20
          min-h-[70vh]
        "
      >
        {/* Левая колонка */}
        <div className="md:col-span-6 reveal">
          <div className="uppercase text-xs md:text-sm font-extrabold tracking-[0.2em] mb-2">
            Automated trading with artificial intelligence
          </div>
          <h1
            className="
              leading-[0.92]
              font-extrabold
              uppercase
              text-[clamp(44px,9vw,120px)]
              tracking-[-.02em]
              [text-shadow:0.05em_0.05em_0_#f2c100,0.12em_0.12em_0_rgba(0,0,0,.18)]
            "
          >
            AI CRYPT<br/>TRADING
          </h1>
          <p className="mt-5 text-[15px] md:text-[18px] max-w-[640px] text-black/80">
            Умный риск-менеджмент, прозрачная симуляция доходности и чистый интерфейс уровня <b>awwwards</b>.
          </p>
          <div className="mt-7 flex gap-4">
            <Link
              href="#sim"
              className="px-6 py-3 bg-black text-yellow-300 rounded-full font-semibold shadow-xl hover:scale-[1.03] transition"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-6 py-3 border-2 border-black rounded-full font-semibold hover:bg-black hover:text-yellow-300 transition"
            >
              Learn more
            </a>
          </div>
        </div>

        {/* Правая колонка — робот (всё целиком, центрировано) */}
        <div className="md:col-span-6 flex justify-center md:justify-end reveal">
          <div className="robot-wrap">
            <svg
              className="robot-svg"
              viewBox="0 0 400 420"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="PaidOFF robot"
            >
              {/* coin */}
              <g className="robot__coin" transform="translate(300,70)">
                <circle cx="0" cy="0" r="28" fill="#000" />
                <circle cx="0" cy="0" r="24" fill="#ffd300" />
                <path d="M-6 5 L0 -8 L6 5 Z" fill="#000" />
              </g>

              {/* body */}
              <g className="robot__body" transform="translate(90,120)">
                <rect x="0" y="30" rx="16" ry="16" width="200" height="130" fill="#000" stroke="#000" strokeWidth="6" />
                <rect x="8" y="38" rx="12" ry="12" width="184" height="114" fill="#111" />

                {/* chest graph */}
                <g transform="translate(26,62)">
                  <rect x="0" y="0" width="132" height="60" rx="10" fill="#000" />
                  <rect x="10" y="32" width="12" height="20" fill="#ffd300" />
                  <rect x="30" y="24" width="12" height="28" fill="#ffd300" />
                  <rect x="50" y="18" width="12" height="34" fill="#ffd300" />
                  <rect x="70" y="12" width="12" height="40" fill="#ffd300" />
                  <rect x="90" y="8" width="12" height="44" fill="#ffd300" />
                </g>

                {/* head */}
                <g transform="translate(24,-34)">
                  <rect x="0" y="0" width="156" height="94" rx="26" fill="#000" stroke="#000" strokeWidth="6" />
                  <rect x="6" y="6" width="144" height="82" rx="22" fill="#111" />
                  <g transform="translate(46,46)">
                    <ellipse className="robot__blink" cx="0" cy="0" rx="13" ry="7" fill="#ffd300" />
                    <circle className="robot__eye" cx="0" cy="0" r="7" fill="#000" />
                  </g>
                  <g transform="translate(110,46)">
                    <ellipse className="robot__blink" cx="0" cy="0" rx="13" ry="7" fill="#ffd300" />
                    <circle className="robot__eye" cx="0" cy="0" r="7" fill="#000" />
                  </g>
                  <rect x="66" y="66" width="26" height="6" rx="3" fill="#000" opacity=".7" />
                  <rect className="robot__shine" x="-20" y="12" width="70" height="6" rx="3" fill="#fff" />
                </g>

                {/* arms */}
                <g transform="translate(-30,70)">
                  <rect x="0" y="0" width="44" height="18" rx="9" fill="#000" />
                  <rect x="38" y="-8" width="24" height="36" rx="12" fill="#111" />
                </g>
                <g transform="translate(200,70)">
                  <rect x="0" y="0" width="44" height="18" rx="9" fill="#000" />
                  <rect x="-18" y="-8" width="24" height="36" rx="12" fill="#111" />
                </g>

                {/* tracks */}
                <g transform="translate(-8,164)">
                  <rect x="0" y="0" width="96" height="34" rx="16" fill="#000" />
                  <rect x="104" y="0" width="96" height="34" rx="16" fill="#000" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Чёрная лента преимуществ */}
      <section className="mt-4 bg-[#0b0b0e] text-[#ffd300] border-t-2 border-b-2 border-black">
        <div className="container-aw py-4 flex items-center justify-between gap-6 flex-wrap text-sm md:text-base">
          <span className="opacity-90 tracking-wider uppercase">Security</span>
          <span className="opacity-90 tracking-wider uppercase">Algorithms</span>
          <span className="opacity-90 tracking-wider uppercase">Analytics</span>
          <span className="opacity-90 tracking-wider uppercase">Backtesting</span>
          <span className="opacity-90 tracking-wider uppercase">Risk Control</span>
        </div>
      </section>

      {/* Симуляция + контролы */}
      <section id="sim" className="container-aw my-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-5">
          <div className="card reveal">
            <h3 className="card-title mb-3">Risk mode</h3>
            <div className="flex flex-wrap gap-2">
              {(["low", "medium", "high"] as RiskMode[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRisk(r)}
                  className={`px-4 py-2 rounded-full font-semibold ${risk === r ? "bg-black text-yellow-300" : "border border-black hover:bg-black hover:text-yellow-300"}`}
                >
                  {r === "low" ? "Low" : r === "medium" ? "Medium" : "High"}
                </button>
              ))}
            </div>
          </div>

          <div className="card reveal">
            <h3 className="card-title mb-3">Term</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 7, 30, 90].map((t) => (
                <button
                  key={t}
                  onClick={() => setTerm(t as Term)}
                  className={`px-4 py-2 rounded-full font-semibold ${term === t ? "bg-black text-yellow-300" : "border border-black hover:bg-black hover:text-yellow-300"}`}
                >
                  {t}D
                </button>
              ))}
            </div>
          </div>

          <div className="card reveal">
            <h3 className="card-title mb-2">Deposit (USDT)</h3>
            <input
              type="range"
              min={100}
              max={10000}
              step={50}
              value={deposit}
              onChange={(e) => setDeposit(parseInt(e.target.value, 10))}
              className="w-full accent-black"
            />
            <div className="mt-3 text-sm text-white/90">
              <div className="flex justify-between"><span>Deposit</span><span>{deposit} USDT</span></div>
              <div className="flex justify-between"><span>End capital</span><span>{end} USDT</span></div>
              <div className="flex justify-between"><span>PNL</span><span className={pnl >= 0 ? "text-emerald-400" : "text-red-400"}>{pnl >= 0 ? "+" : ""}{pnl} USDT</span></div>
              <div className="flex justify-between"><span>ROI</span><span className={roi >= 0 ? "text-emerald-400" : "text-red-400"}>{roi >= 0 ? "+" : ""}{roi}%</span></div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-8">
          <div className="card reveal">
            <div className="flex items-center justify-between mb-2">
              <h3 className="card-title">Performance simulation</h3>
              <span className="text-xs md:text-sm text-white/80">
                {term}d • {risk.toUpperCase()}
              </span>
            </div>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,211,0,.22)" />
                  <XAxis dataKey="name" stroke="rgba(255,211,0,.75)" />
                  <YAxis stroke="rgba(255,211,0,.75)" width={60} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{
                      background: "#000",
                      border: "1px solid rgba(255,211,0,.35)",
                      borderRadius: 12,
                      color: "#ffd300",
                    }}
                    formatter={(value: number) => [`$${value}`, "Balance"]}
                  />
                  <Line type="monotone" dataKey="balance" dot={false} stroke="#ffd300" strokeWidth={2.2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="container-aw py-10 border-t border-black/20 text-sm text-black/70">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-extrabold tracking-widest">PAIDOFF</div>
          <div>© {new Date().getFullYear()} PaidOFF. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
