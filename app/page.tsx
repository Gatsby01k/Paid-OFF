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

/* ==== simple simulation for chart ==== */
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

  // reveal
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) (e.target as HTMLElement).classList.add("show"); }),
      { threshold: 0.18 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main ref={rootRef} className="min-h-screen flex flex-col">
      {/* NAV */}
      <header className="header container-aw py-6 flex items-center justify-between">
        <div className="text-base md:text-lg font-extrabold tracking-widest">PAIDOFF</div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="nav-link" href="#about">About</a>
          <a className="nav-link" href="#features">Algorithms</a>
          <a className="nav-link" href="#contact">Contact</a>
          <Link href="#getstarted" className="btn btn-cta">Get Started</Link>
        </nav>
      </header>

      {/* HERO (ровная сетка 6/6, фикс ширины заголовка/робота) */}
      <section
        className="
          container-aw grid grid-cols-1 md:grid-cols-12
          gap-10 md:gap-12 items-center
          mt-10 md:mt-14 pb-14 md:pb-16 min-h-[72vh]
        "
      >
        {/* Left */}
        <div className="md:col-span-6 reveal">
          <div className="kicker uppercase text-xs md:text-sm mb-2">
            AUTOMATED TRADING WITH ARTIFICIAL INTELLIGENCE
          </div>
          <h1 className="headline head-xl head-max">
            AI CRYPT
            <br />
            TRADING
          </h1>
          <p className="mt-5 text-[15px] md:text-[18px] max-w-[640px] text-black/80">
            Умный риск-менеджмент, прозрачная симуляция доходности и чистый интерфейс уровня <b>awwwards</b>.
          </p>
          <div className="mt-7 flex gap-4">
            <Link href="#sim" className="btn btn-cta">Get Started</Link>
            <a href="#features" className="btn btn-outline">Learn more</a>
          </div>
        </div>

        {/* Right — WALL-E style robot */}
        <div className="md:col-span-6 flex justify-center md:justify-end reveal">
          <div className="robot-wrap robot">
            <svg
              className="robot-svg"
              viewBox="0 0 460 440"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="PaidOFF robot"
            >
              {/* Coin */}
              <g className="robot__coin" transform="translate(360,80)">
                <circle cx="0" cy="0" r="26" fill="#000"/>
                <circle cx="0" cy="0" r="22" fill="#ffd300"/>
                <path d="M-6 5 L0 -8 L6 5 Z" fill="#000"/>
              </g>

              {/* Chassis */}
              <g className="robot__body" transform="translate(100,120)">
                <rect x="0" y="40" width="240" height="140" rx="22" fill="#0f0f10" stroke="#000" strokeWidth="8"/>
                <rect x="10" y="50" width="220" height="120" rx="18" fill="#1a1a1d"/>

                {/* panel */}
                <g transform="translate(42,82)">
                  <rect x="0" y="0" width="156" height="58" rx="10" fill="#000"/>
                  <rect x="12" y="30" width="14" height="22" fill="#ffd300"/>
                  <rect x="34" y="22" width="14" height="30" fill="#ffd300"/>
                  <rect x="56" y="16" width="14" height="36" fill="#ffd300"/>
                  <rect x="78" y="10" width="14" height="42" fill="#ffd300"/>
                  <rect x="100" y="6" width="14" height="46" fill="#ffd300"/>
                </g>

                {/* head */}
                <g transform="translate(28,-26)">
                  <rect x="0" y="0" width="184" height="96" rx="28" fill="#0f0f10" stroke="#000" strokeWidth="8"/>
                  <rect x="8" y="8" width="168" height="80" rx="24" fill="#1a1a1d"/>
                  {/* eyes */}
                  <g transform="translate(54,48)">
                    <circle cx="0" cy="0" r="18" fill="#000"/>
                    <circle cx="0" cy="0" r="10" fill="#ffd300"/>
                    <circle cx="0" cy="0" r="6" fill="#000"/>
                    <ellipse className="robot__eyelid-left" cx="0" cy="0" rx="18" ry="18" fill="#000" opacity=".12"/>
                  </g>
                  <g transform="translate(124,48)">
                    <circle cx="0" cy="0" r="18" fill="#000"/>
                    <circle cx="0" cy="0" r="10" fill="#ffd300"/>
                    <circle cx="0" cy="0" r="6" fill="#000"/>
                    <ellipse className="robot__eyelid-right" cx="0" cy="0" rx="18" ry="18" fill="#000" opacity=".12"/>
                  </g>
                  <rect x="60" y="14" width="64" height="8" rx="4" fill="#9c9c9c" opacity=".35"/>
                </g>

                {/* arms */}
                <g transform="translate(-24,96)">
                  <rect x="0" y="0" width="52" height="22" rx="11" fill="#000"/>
                  <rect x="44" y="-10" width="26" height="42" rx="13" fill="#1a1a1d"/>
                </g>
                <g transform="translate(236,96)">
                  <rect x="0" y="0" width="52" height="22" rx="11" fill="#000"/>
                  <rect x="-18" y="-10" width="26" height="42" rx="13" fill="#1a1a1d"/>
                </g>

                {/* tracks */}
                <g transform="translate(-8,188)">
                  <rect x="0" y="0" width="120" height="36" rx="18" fill="#000"/>
                  <rect x="132" y="0" width="120" height="36" rx="18" fill="#000"/>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Band */}
      <section className="mt-4 bg-[#0b0b0e] text-[#ffd300] border-t-2 border-b-2 border-black">
        <div className="container-aw py-4 band">
          <span className="band-item">Security</span>
          <span className="band-item">Algorithms</span>
          <span className="band-item">Analytics</span>
          <span className="band-item">Backtesting</span>
          <span className="band-item">Risk Control</span>
        </div>
      </section>

      {/* Simulation + controls */}
      <section id="sim" className="container-aw my-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-5">
          <div className="card reveal">
            <h3 className="card-title mb-3">Risk mode</h3>
            <div className="flex flex-wrap gap-8">
              {(["low","medium","high"] as RiskMode[]).map((r)=>(
                <button key={r}
                  onClick={()=>setRisk(r)}
                  className={`px-5 py-2 rounded-full font-semibold ${risk===r ? "bg-black text-yellow-300" : "border border-black hover:bg-black hover:text-yellow-300"}`}
                >
                  {r[0].toUpperCase()+r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="card reveal">
            <h3 className="card-title mb-3">Term</h3>
            <div className="flex flex-wrap gap-8">
              {[1,7,30,90].map((t)=>(
                <button key={t}
                  onClick={()=>setTerm(t as Term)}
                  className={`px-5 py-2 rounded-full font-semibold ${term===t ? "bg-black text-yellow-300" : "border border-black hover:bg-black hover:text-yellow-300"}`}
                >
                  {t}D
                </button>
              ))}
            </div>
          </div>

          <div className="card reveal">
            <h3 className="card-title mb-2">Deposit (USDT)</h3>
            <input type="range" min={100} max={10000} step={50}
              value={deposit} onChange={(e)=>setDeposit(parseInt(e.target.value,10))}
              className="w-full accent-black"
            />
            <div className="mt-3 text-sm text-white/90">
              <div className="flex justify-between"><span>Deposit</span><span>{deposit} USDT</span></div>
              <div className="flex justify-between"><span>End capital</span><span>{end} USDT</span></div>
              <div className="flex justify-between"><span>PNL</span><span className={pnl>=0?"text-emerald-400":"text-red-400"}>{pnl>=0?"+":""}{pnl} USDT</span></div>
              <div className="flex justify-between"><span>ROI</span><span className={roi>=0?"text-emerald-400":"text-red-400"}>{roi>=0?"+":""}{roi}%</span></div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-8">
          <div className="card reveal">
            <div className="flex items-center justify-between mb-2">
              <h3 className="card-title">Performance simulation</h3>
              <span className="text-xs md:text-sm text-white/80">{term}d • {risk.toUpperCase()}</span>
            </div>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,211,0,.22)" />
                  <XAxis dataKey="name" stroke="rgba(255,211,0,.75)" />
                  <YAxis stroke="rgba(255,211,0,.75)" width={60} tickFormatter={(v)=>`$${v}`} />
                  <Tooltip
                    contentStyle={{ background:"#000", border:"1px solid rgba(255,211,0,.35)", borderRadius:12, color:"#ffd300" }}
                    formatter={(value:number)=>[`$${value}`,"Balance"]}
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
