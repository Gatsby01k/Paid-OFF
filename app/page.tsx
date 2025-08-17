'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

/* ------------------------ types & helpers ------------------------ */

type RiskMode = 'low' | 'medium' | 'high';
type Term = 1 | 7 | 30 | 90;

const RISK_MAP: Record<RiskMode, { dailyReturn: number; noise: number }> = {
  low: { dailyReturn: 0.001, noise: 0.002 },     // ~0.1% в день
  medium: { dailyReturn: 0.002, noise: 0.005 },  // ~0.2% в день
  high: { dailyReturn: 0.004, noise: 0.012 },    // ~0.4% в день
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

/* ------------------------------ UI ------------------------------ */

export default function Page() {
  const [enable3D, setEnable3D] = useState(false);  // 3D выключен по умолчанию
  const [risk, setRisk] = useState<RiskMode>('medium');
  const [term, setTerm] = useState<Term>(30);
  const [deposit, setDeposit] = useState<number>(500);

  const { data, pnl, roi, endBalance } = useMemo(
    () => simulateSeries(term, deposit, risk),
    [term, deposit, risk]
  );

  return (
    <main className="container-aw py-8 md:py-12">
      {/* Topbar */}
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm tracking-widest uppercase">PAIDOFF</Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setEnable3D(v => !v)}
            className="btn-aw btn-ghost"
            aria-pressed={enable3D}
            title={enable3D ? 'Выключить 3D' : 'Включить 3D'}
          >
            {enable3D ? '3D: On' : '3D: Off'}
          </button>

          <Link href="#" className="btn-aw btn-primary">Launch App</Link>
        </div>
      </div>

      {/* Hero */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7">
          <h1 className="h1-aw">AI Trading with PaidOFF</h1>
          <p className="p-aw mt-4 max-w-2xl">
            Торгуй с роботом. 3D-визуализация — опционально: включи её переключателем, когда понадобится.
            Мы показываем понятную симуляцию доходности под твой риск-профиль.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#sim" className="btn-aw btn-primary">Смоделировать</a>
            <a href="#features" className="btn-aw btn-ghost">Подробнее</a>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="card-aw aspect-[4/3] flex items-center justify-center">
            {!enable3D ? (
              <div className="text-center">
                <div className="text-sm uppercase tracking-widest mb-1 text-[var(--muted)]">3D DISABLED</div>
                <p className="p-aw">Переключи «3D: Off» наверху, чтобы отобразить сцену.</p>
              </div>
            ) : (
              <div className="text-center p-aw">
                {/* Заменишь на динамический импорт R3F-сцены */}
                {/* const Hero3D = dynamic(() => import('../components/Hero3D'), { ssr:false }) */}
                Здесь будет R3F-сцена (Canvas). Сейчас плейсхолдер.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Controls + Chart */}
      <section id="sim" className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card-aw">
            <h3 className="text-lg font-medium mb-3">Режим риска</h3>
            <div className="flex flex-wrap gap-2">
              {(['low','medium','high'] as RiskMode[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRisk(r)}
                  className={`btn-aw ${risk === r ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {r === 'low' ? 'Low' : r === 'medium' ? 'Medium' : 'High'}
                </button>
              ))}
            </div>
          </div>

          <div className="card-aw">
            <h3 className="text-lg font-medium mb-3">Срок</h3>
            <div className="flex flex-wrap gap-2">
              {[1,7,30,90].map((t) => (
                <button
                  key={t}
                  onClick={() => setTerm(t as Term)}
                  className={`btn-aw ${term === t ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {t}D
                </button>
              ))}
            </div>
          </div>

          <div className="card-aw">
            <h3 className="text-lg font-medium mb-3">Депозит (USDT)</h3>
            <input
              type="range"
              min={100}
              max={10000}
              step={50}
              value={deposit}
              onChange={(e) => setDeposit(parseInt(e.target.value, 10))}
              className="w-full"
            />
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="p-aw">Депозит</div>
              <div className="text-right">{deposit} USDT</div>

              <div className="p-aw">Капитал к концу</div>
              <div className="text-right">{endBalance} USDT</div>

              <div className="p-aw">PNL</div>
              <div className="text-right">+{pnl} USDT</div>

              <div className="p-aw">ROI</div>
              <div className="text-right">+{roi}%</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-8">
          <div className="card-aw h-[420px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Симуляция доходности</h3>
              <span className="text-sm text-[var(--muted)]">
                {term}d • {risk.toUpperCase()}
              </span>
            </div>

            <div className="h-[340px]">
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
      <section id="features" className="mt-12 grid md:grid-cols-3 gap-6">
        {[
          ['Алгоритмический риск-менеджмент', 'Стабилизация доходности при любой волатильности.'],
          ['Прозрачная симуляция', 'Смотри, как меняются PNL и ROI под разные параметры.'],
          ['Опциональный 3D', 'Включай WebGL-сцену только тогда, когда нужно.'],
        ].map(([title, text]) => (
          <div key={title} className="card-aw">
            <h4 className="font-medium">{title}</h4>
            <p className="p-aw mt-2">{text}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-12 text-center">
        <h3 className="h1-aw text-3xl md:text-4xl">Готов начать?</h3>
        <p className="p-aw mt-3">Запусти демо или подключи биржу за пару минут.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="#" className="btn-aw btn-primary">Launch App</Link>
          <Link href="#sim" className="btn-aw btn-ghost">Симуляция</Link>
        </div>
      </section>
    </main>
  );
}
