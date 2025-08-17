'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

/* ======= простая симуляция для графика ======= */
type RiskMode = 'low' | 'medium' | 'high';
type Term = 1 | 7 | 30 | 90;
const RISK: Record<RiskMode, { daily: number; noise: number }> = {
  low: { daily: 0.001, noise: 0.002 },
  medium: { daily: 0.002, noise: 0.005 },
  high: { daily: 0.004, noise: 0.012 },
};
function simulate(term: Term, deposit: number, risk: RiskMode) {
  const cfg = RISK[risk]; const data: { name: string; balance: number }[] = [];
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

/* ======= компонент ======= */
export default function Page() {
  const [risk, setRisk] = useState<RiskMode>('medium');
  const [term, setTerm] = useState<Term>(30);
  const [deposit, setDeposit] = useState(500);
  const { data, pnl, roi, end } = useMemo(() => simulate(term, deposit, risk), [term, deposit, risk]);

  /* IntersectionObserver для .reveal */
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = rootRef.current ?? document;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('show'); }),
      { root: null, threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main ref={rootRef}>
      {/* NAV */}
      <div className="container-aw navbar">
        <div className="flex items-center gap-3">
          <span className="text-sm font-extrabold tracking-widest">PAIDOFF</span>
        </div>
        <nav className="nav-links">
          <a className="nav-link" href="#about">About</a>
          <a className="nav-link" href="#features">Algorithms</a>
          <a className="nav-link" href="#contact">Contact</a>
          <Link href="#" className="btn btn-cta">Get Started</Link>
        </nav>
      </div>

      {/* HERO */}
      <section className="container-aw mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7 reveal">
          <div className="text-xs md:text-sm font-extrabold uppercase tracking-widest mb-2">
            Automated trading with artificial intelligence
          </div>
          <h1 className="headline head-xl">AI CRYPT<br/>TRADING</h1>
          <p className="mt-4 text-[15px] md:text-[17px] max-w-xl text-black/80">
            Умный риск-менеджмент, прозрачная симуляция доходности и чистый интерфейс уровня awwwards.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="#sim" className="btn btn-cta">Get Started</Link>
            <a href="#features" className="btn btn-outline">Learn more</a>
          </div>
        </div>

        {/* ANIMATED SVG ROBOT */}
        <div className="md:col-span-5 reveal">
          <div className="robot">
            <svg viewBox="0 0 340 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PaidOFF robot">
              {/* coin */}
              <g className="robot__coin" transform="translate(270,65)">
                <circle cx="0" cy="0" r="26" fill="#000"/>
                <circle cx="0" cy="0" r="22" fill="#ffd300"/>
                <path d="M-6 5 L0 -8 L6 5 Z" fill="#000"/>
              </g>
              {/* body */}
              <g className="robot__body" transform="translate(80,110)">
                <rect x="0" y="30" rx="16" ry="16" width="180" height="120" fill="#000" stroke="#000" strokeWidth="6"/>
                <rect x="8" y="38" rx="12" ry="12" width="164" height="104" fill="#111"/>
                <g transform="translate(22,58)">
                  <rect x="0" y="0" width="120" height="56" rx="10" fill="#000"/>
                  <rect x="10" y="30" width="12" height="18" fill="#ffd300"/>
                  <rect x="28" y="22" width="12" height="26" fill="#ffd300"/>
                  <rect x="46" y="16" width="12" height="32" fill="#ffd300"/>
                  <rect x="64" y="10" width="12" height="38" fill="#ffd300"/>
                  <rect x="82" y="6"  width="12" height="42" fill="#ffd300"/>
                </g>
                {/* head */}
                <g transform="translate(20,-30)">
                  <rect x="0" y="0" width="140" height="86" rx="26" fill="#000" stroke="#000" strokeWidth="6"/>
                  <rect x="6" y="6" width="128" height="74" rx="22" fill="#111"/>
                  <g transform="translate(40,43)">
                    <ellipse className="robot__blink" cx="0" cy="0" rx="12" ry="7" fill="#ffd300"/>
                    <circle className="robot__eye" cx="0" cy="0" r="7" fill="#000"/>
                  </g>
                  <g transform="translate(100,43)">
                    <ellipse className="robot__blink" cx="0" cy="0" rx="12" ry="7" fill="#ffd300"/>
                    <circle className="robot__eye" cx="0" cy="0" r="7" fill="#000"/>
                  </g>
                  <rect x="58" y="60" width="24" height="6" rx="3" fill="#000" opacity=".7"/>
                  <rect className="robot__shine" x="-20" y="10" width="60" height="6" rx="3" fill="#fff"/>
                </g>
                {/* arms */}
                <g transform="translate(-26,60)">
                  <rect x="0" y="0" width="40" height="18" rx="9" fill="#000"/>
                  <rect x="34" y="-8" width="22" height="34" rx="11" fill="#111"/>
                </g>
                <g transform="translate(178,60)">
                  <rect x="0" y="0" width="40" height="18" rx="9" fill="#000"/>
                  <rect x="-16" y="-8" width="22" height="34" rx="11" fill="#111"/>
                </g>
                {/* tracks */}
                <g transform="translate(-6,148)">
                  <rect x="0" y="0" width="88" height="30" rx="14" fill="#000"/>
                  <rect x="90" y="0" width="88" height="30" rx="14" fill="#000"/>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Чёрная лента преимуществ */}
      <section className="mt-10 bg-[#0b0b0e] text-[var(--yellow)] border-t-2 border-b-2 border-black">
        <div className="container-aw py-4 band">
          <span className="band-item">Security</span>
          <span className="band-item">Algorithms</span>
          <span className="band-item">Analytics</span>
          <span className="band-item">Backtesting</span>
          <span className="band-item">Risk Control</span>
        </div>
      </section>

      {/* Симуляция + контролы */}
      <section id="sim" className="container-aw my-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-5">
          <div className="card reveal">
            <h3 className="card-title mb-3">Risk mode</h3>
            <div className="segmented">
              {(['low','medium','high'] as RiskMode[]).map((r) => (
                <button key={r}
                  onClick={() => setRisk(r)}
                  className={`segmented-btn ${risk === r ? 'is-active' : ''}`}
                >
                  {r === 'low' ? 'Low' : r === 'medium' ? 'Medium' : 'High'}
                </button>
              ))}
            </div>
          </div>

          <div className="card reveal">
            <h3 className="card-title mb-3">Term</h3>
            <div className="segmented">
              {[1,7,30,90].map((t) => (
                <button key={t}
                  onClick={() => setTerm(t as Term)}
                  className={`segmented-btn ${term === t ? 'is-active' : ''}`}
                >
                  {t}D
                </button>
              ))}
            </div>
          </div>

          <div className="card reveal">
            <h3 className="card-title mb-2">Deposit (USDT)</h3>
            <input
              type="range" min={100} max={10000} step={50}
              value={deposit} onChange={(e)=>setDeposit(parseInt(e.target.value,10))}
              className="range-aw"
            />
            <div className="mt-3 text-sm text-white/90">
              <div className="row"><span>Deposit</span><span>{deposit} USDT</span></div>
              <div className="row"><span>End capital</span><span>{end} USDT</span></div>
              <div className="row"><span>PNL</span><span className={pnl>=0?'pos':'neg'}>{pnl>=0?'+':''}{pnl} USDT</span></div>
              <div className="row"><span>ROI</span><span className={roi>=0?'pos':'neg'}>{roi>=0?'+':''}{roi}%</span></div>
            </div>
          </div>
        </div>

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
                    contentStyle={{ background:'#000', border:'1px solid rgba(255,211,0,.35)', borderRadius:12, color:'#ffd300' }}
                    formatter={(value:number)=>[`$${value}`, 'Balance']}
                  />
                  <Line type="monotone" dataKey="balance" dot={false} stroke="#ffd300" strokeWidth={2.2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="container-aw py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm font-extrabold tracking-widest">PAIDOFF</div>
          <div className="text-sm">© {new Date().getFullYear()} PaidOFF. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
