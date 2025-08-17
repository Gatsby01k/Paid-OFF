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
    <main className="container-aw py-7 md:py-12">
      {/* NAV */}
      <header className="flex items-center justify-between">
        <Link href="/" className="logo-aw">PAIDOFF</Link>
        <Link href="#" className="btn-aw btn-primary">Launch App</Link>
      </header>

      {/* HERO */}
      <section className="mt-8 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7">
          <p className="tagline">AUTOMATED TRADING (AI)</p>
          <h1 className="h1-aw">PAID<span className="italic">OFF</span></h1>
          <p className="p-aw mt-4 max-w-2xl">
            Чистый интерфейс и прозрачная симуляция PNL/ROI. Подбери риск, срок и депозит —
            увидишь ожидаемую динамику капитала.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#sim" className="btn-aw btn-primary">Смоделировать</a>
            <a href="#features" className="btn-aw btn-ghost">О продукте</a>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="hero-wrap">
            <Image
              src="/robot-hero.png"             // ← имя файла в /public
              alt="PaidOFF Robot"
              width={900}
              height={640}
              priority
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* CONTROLS + CHART */}
      <section id="sim" className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-5">
          <div className="card-black">
            <h3 className="card-title">Режим риска</h3>
            <div className="segmented">
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

          <div className="card-black">
            <h3 className="card-title">Срок</h3>
            <div className="segmented">
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

          <div className="card-black">
            <h3 className="card-title">Депозит (USDT)</h3>
            <input
              type="range"
              min={100}
              max={10000}
              step={50}
              value={deposit}
              onChange={(e) => setDeposit(parseInt(e.target.value, 10))}
              className="range-aw"
            />
            <div className="mt-3 text-sm">
              <div className="row"><span>Депозит</span><span>{deposit} USDT</span></div>
              <div className="row"><span>Капитал к концу</span><span>{endBalance} USDT</span></div>
              <div className="row">
                <span>PNL</span>
                <span className={pnl >= 0 ? 'pos' : 'neg'}>{pnl >= 0 ? '+' : ''}{pnl} USDT</span>
              </div>
              <div className="row">
                <span>ROI</span>
                <span className={roi >= 0 ? 'pos' : 'neg'}>{roi >= 0 ? '+' : ''}{roi}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-8">
          <div className="chart-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="card-title">Симуляция доходности</h3>
              <span className="badge-aw">{term}d • {risk.toUpperCase()}</span>
            </div>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,212,0,.22)" />
                  <XAxis dataKey="name" stroke="rgba(255,212,0,.75)" />
                  <YAxis
                    stroke="rgba(255,212,0,.75)"
                    width={60}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#000',
                      border: '1px solid rgba(255,212,0,.35)',
                      borderRadius: 12,
                      color: '#ffd400',
                    }}
                    formatter={(value: number) => [`$${value}`, 'Баланс']}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    dot={false}
                    stroke="#ffd400"
                    strokeWidth={2.2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mt-14 grid gap-6 md:grid-cols-3">
        {[
          ['Automation First', 'Алгоритмический риск-менеджмент.'],
          ['Clarity', 'Прозрачная симуляция PNL/ROI.'],
          ['Focus', 'Никакого визуального мусора — только результат.'],
        ].map(([title, text]) => (
          <div key={title} className="card-black">
            <h4 className="card-title">{title}</h4>
            <p className="muted mt-2">{text}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-16 text-center">
        <h3 className="h1-aw text-3xl md:text-4xl not-italic">Готов начать?</h3>
        <p className="p-aw mt-2">Запусти демо или подключи биржу за пару минут.</p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Link href="#" className="btn-aw btn-primary">Launch App</Link>
          <a href="#sim" className="btn-aw btn-ghost">Симуляция</a>
        </div>
      </section>
    </main>
  );
}
