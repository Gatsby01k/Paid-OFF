'use client';

import Link from 'next/link';
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
    <main className="container-aw py-8 md:py-14">
      {/* NAV */}
      <header className="flex items-center justify-between">
        <Link href="/" className="logo-aw">PAIDOFF</Link>
        <Link href="#" className="btn-aw btn-primary">Launch App</Link>
      </header>

      {/* HERO */}
      <section className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7">
          <h1 className="h1-aw grad-text">AI Trading with PaidOFF</h1>
          <p className="p-aw mt-5 max-w-2xl">
            Торговый движок с прозрачной симуляцией PNL и ROI. Чистый интерфейс, без визуального мусора.
            Подбери риск-профиль, срок и размер депозита — увидишь ожидаемую динамику капитала.
          </p>
          <div className="mt-7 flex gap-3">
            <a href="#sim" className="btn-aw btn-primary">Смоделировать</a>
            <a href="#features" className="btn-aw btn-ghost">О продукте</a>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="hero-card">
            <div className="hero-badge">Realtime • Backtested</div>
            <div className="hero-stats">
              <div>
                <span className="hero-kpi">16.4%</span>
                <span className="hero-kpi-label">Projected ROI</span>
              </div>
              <div>
                <span className="hero-kpi">$532.36</span>
                <span className="hero-kpi-label">Capital in 30d</span>
              </div>
              <div>
                <span className="hero-kpi">0.32</span>
                <span className="hero-kpi-label">Sharpe (sim)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTROLS + CHART */}
      <section id="sim" className="mt-12 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-5">
          <div className="card-aw">
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

          <div className="card-aw">
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

          <div className="card-aw">
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
            <div className="mt-4 text-sm">
              <div className="row">
                <span className="p-aw">Депозит</span>
                <span>{deposit} USDT</span>
              </div>
              <div className="row">
                <span className="p-aw">Капитал к концу</span>
                <span>{endBalance} USDT</span>
              </div>
              <div className="row">
                <span className="p-aw">PNL</span>
                <span className={pnl >= 0 ? 'pos' : 'neg'}>
                  {pnl >= 0 ? '+' : ''}{pnl} USDT
                </span>
              </div>
              <div className="row">
                <span className="p-aw">ROI</span>
                <span className={roi >= 0 ? 'pos' : 'neg'}>
                  {roi >= 0 ? '+' : ''}{roi}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-8">
          <div className="card-aw">
            <div className="flex items-center justify-between mb-3">
              <h3 className="card-title">Симуляция доходности</h3>
              <span className="badge-aw">{term}d • {risk.toUpperCase()}</span>
            </div>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="name" stroke="rgba(231,233,238,0.6)" />
                  <YAxis
                    stroke="rgba(231,233,238,0.6)"
                    width={60}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(13,16,20,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      color: 'white',
                    }}
                    formatter={(value: number) => [`$${value}`, 'Баланс']}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    dot={false}
                    stroke="#f59e0b"
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
          ['Алгоритмический риск-менеджмент', 'Стабилизация доходности при любой волатильности.'],
          ['Прозрачная симуляция', 'Смотри, как меняются PNL и ROI под разные параметры.'],
          ['Чистый интерфейс', 'Без анимаций ради анимаций. Только то, что помогает решать задачу.'],
        ].map(([title, text]) => (
          <div key={title} className="card-aw">
            <h4 className="card-title">{title}</h4>
            <p className="p-aw mt-2">{text}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-16 text-center">
        <h3 className="h1-aw text-3xl md:text-4xl">Готов начать?</h3>
        <p className="p-aw mt-3">Запусти демо или подключи биржу за пару минут.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="#" className="btn-aw btn-primary">Launch App</Link>
          <a href="#sim" className="btn-aw btn-ghost">Симуляция</a>
        </div>
      </section>
    </main>
  );
}
