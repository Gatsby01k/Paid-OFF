'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

type RiskMode = 'low' | 'medium' | 'high';
type Term = 1 | 7 | 30 | 90;

const RISK_MAP: Record<RiskMode, { dailyReturn: number; noise: number }> = {
  low: { dailyReturn: 0.001, noise: 0.002 },
  medium: { dailyReturn: 0.002, noise: 0.005 },
  high: { dailyReturn: 0.004, noise: 0.012 },
};

function simulateSeries(term: Term, deposit: number, risk: RiskMode) {
  const days = term;
  const cfg = RISK_MAP[risk];
  const data: { name: string; balance: number }[] = [];
  let bal = deposit;

  for (let d = 0; d <= days; d++) {
    if (d > 0) {
      const drift = bal * cfg.dailyReturn;
      const noise = bal * (Math.random() * cfg.noise - cfg.noise / 2);
      bal = Math.max(0, bal + drift + noise);
    }
    data.push({ name: `${d}d`, balance: +bal.toFixed(2) });
  }

  const pnl = +(bal - deposit).toFixed(2);
  const roi = +((bal / deposit - 1) * 100).toFixed(2);
  return { data, pnl, roi, endBalance: +bal.toFixed(2) };
}

export default function Page() {
  const [risk, setRisk] = useState<RiskMode>('medium');
  const [term, setTerm] = useState<Term>(30);
  const [deposit, setDeposit] = useState<number>(500);

  const { data, pnl, roi, endBalance } = useMemo(
    () => simulateSeries(term, deposit, risk),
    [term, deposit, risk]
  );

  return (
    <main>
      {/* NAV */}
      <div className="container-aw navbar">
        <div className="flex items-center gap-3">
          <span className="tagline">PAIDOFF</span>
        </div>
        <nav className="nav-links">
          <a className="nav-link" href="#about">About</a>
          <a className="nav-link" href="#features">Algorithms</a>
          <a className="nav-link" href="#contact">Contact</a>
          <Link href="#" className="btn btn-cta">Get Started</Link>
        </nav>
      </div>

      {/* HERO */}
      <section className="container-aw mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7">
          <div className="tagline mb-3">Automated trading with artificial intelligence</div>
          <h1 className="headline headline-xl headline-shadow">
            AI CRYPT<br/>TRADING
          </h1>
          <div className="mt-6 flex gap-3">
            <Link href="#sim" className="btn btn-cta">Get Started</Link>
            <a href="#features" className="btn btn-outline">Learn more</a>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="hero-wrap">
            {/* Картинка робота из /public — «один в один» */}
            <Image
              src="/robot-hero.png"
              alt="PaidOFF Robot"
              width={900}
              height={900}
              priority
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* Нижняя чёрная полоса как на референсе */}
      <section className="bottom-band mt-10">
        <div className="container-aw py-4">
          <ul className="band-list">
            <li className="band-item">Security</li>
            <li className="band-item">Algorithms</li>
            <li className="band-item">Analytics</li>
            <li className="band-item">Backtesting</li>
            <li className="band-item">Risk Control</li>
          </ul>
        </div>
      </section>

      {/* SIM + CHART */}
      <section id="sim" className="container-aw mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-5">
          <div className="card-dark">
            <h3 className="card-title">Risk mode</h3>
            <div className="segmented mt-3">
              {(['low','medium','high'] as RiskMode[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRisk(r)}
                  className={`segmented-btn ${risk === r ? 'is-active' : ''}`}
                >
                  {r === 'low' ? 'Low' : r === 'medium' ? 'Medium' : 'High'}
                </button>
              ))}
            </div>
          </div>

          <div className="card-dark">
            <h3 className="card-title">Term</h3>
            <div className="segmented mt-3">
              {[1,7,30,90].map((t) => (
                <button
                  key={t}
                  onClick={() => setTerm(t as Term)}
                  className={`segmented-btn ${term === t ? 'is-active' : ''}`}
                >
                  {t}D
                </button>
              ))}
            </div>
          </div>

          <div className="card-dark">
            <h3 className="card-title">Deposit (USDT)</h3>
            <input
              type="range"
              min={100}
              max={10000}
              step={50}
              value={deposit}
              onChange={(e) => setDeposit(parseInt(e.target.value, 10))}
              className="range-aw mt-2"
            />
            <div className="mt-3 text-sm">
              <div className="row"><span>Deposit</span><span>{deposit} USDT</span></div>
              <div className="row"><span>End capital</span><span>{endBalance} USDT</span></div>
              <div className="row"><span>PNL</span><span className={pnl >= 0 ? 'pos' : 'neg'}>{pnl >= 0 ? '+' : ''}{pnl} USDT</span></div>
              <div className="row"><span>ROI</span><span className={roi >= 0 ? 'pos' : 'neg'}>{roi >= 0 ? '+' : ''}{roi}%</span></div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-8">
          <div className="chart-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="card-title">Performance simulation</h3>
              <span className="text-xs md:text-sm"> {term}d • {risk.toUpperCase()} </span>
            </div>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,211,0,.22)" />
                  <XAxis dataKey="name" stroke="rgba(255,211,0,.75)" />
                  <YAxis stroke="rgba(255,211,0,.75)" width={60} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{
                      background: '#000',
                      border: '1px solid rgba(255,211,0,.35)',
                      borderRadius: 12,
                      color: '#ffd300',
                    }}
                    formatter={(value: number) => [`$${value}`, 'Balance']}
                  />
                  <Line type="monotone" dataKey="balance" dot={false} stroke="#ffd300" strokeWidth={2.2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER/CONTACT (минимум) */}
      <footer id="contact" className="container-aw py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="tagline">PAIDOFF</div>
          <div className="text-sm">© {new Date().getFullYear()} PaidOFF. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
