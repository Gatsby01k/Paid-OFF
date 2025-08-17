'use client';

import React, { useState, useEffect, Suspense, useRef } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("@react-three/fiber").then(m => m.Canvas), { ssr: false });
import { OrbitControls, Float, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

/* ===== Types ===== */
type RiskKey = "low" | "medium" | "high";
type Risk = { label: string; range: [number, number]; color: string };
type Period = { label: string; days: number };
type Point = { day: number; balance: number };

/* ===== Data ===== */
const RISKS: Record<RiskKey, Risk> = {
  low: { label: "Low", range: [0.001, 0.003], color: "#16a34a" },
  medium: { label: "Medium", range: [0.003, 0.007], color: "#f59e0b" },
  high: { label: "High", range: [0.008, 0.02], color: "#ef4444" },
};

const PERIODS: Period[] = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

/* ===== Utils ===== */
function simulateSeries(args: { days: number; dailyRange: [number, number]; deposit: number }): Point[] {
  const { days, dailyRange, deposit } = args;
  const [min, max] = dailyRange;
  let balance = deposit;
  return Array.from({ length: days + 1 }, (_: unknown, i: number) => {
    if (i === 0) return { day: 0, balance };
    const dailyPrc = min + Math.random() * (max - min);
    balance = +(balance * (1 + dailyPrc)).toFixed(2);
    return { day: i, balance };
  });
}

/* ===== 3D Robot ===== */
function Robot3D() {
  const headRef = useRef<any>(null);
  const eyelidsRefL = useRef<any>(null);
  const eyelidsRefR = useRef<any>(null);
  const pupilsRefL = useRef<any>(null);
  const pupilsRefR = useRef<any>(null);

  const [blink, setBlink] = useState<boolean>(false);
  const [pupilScale, setPupilScale] = useState<number>(1);
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setPupilScale(0.7);
      setTimeout(() => {
        setBlink(false);
        setPupilScale(1 + Math.random() * 0.3);
      }, 250);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime / 2) * 0.2;
    }
    if (eyelidsRefL.current && eyelidsRefR.current) {
      const scaleY = blink ? 0.1 : 1;
      eyelidsRefL.current.scale.y = scaleY;
      eyelidsRefR.current.scale.y = scaleY;
    }
    if (pupilsRefL.current && pupilsRefR.current) {
      const maxOffset = 0.15;
      pupilsRefL.current.position.x = -0.6 + mouse.x * maxOffset;
      pupilsRefL.current.position.y = mouse.y * maxOffset;
      pupilsRefR.current.position.x = 0.6 + mouse.x * maxOffset;
      pupilsRefR.current.position.y = mouse.y * maxOffset;
      pupilsRefL.current.scale.set(pupilScale, pupilScale, pupilScale);
      pupilsRefR.current.scale.set(pupilScale, pupilScale, pupilScale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#FFD400" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Head */}
      <group ref={headRef} position={[0, 1.6, 0]}>
        <mesh>
          <boxGeometry args={[2.2, 1, 1]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Eyes (emissive) */}
        <mesh position={[-0.6, 0, 0.6]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="white" emissive="#FFD400" emissiveIntensity={2} metalness={0.1} roughness={0.1} />
        </mesh>
        <mesh position={[0.6, 0, 0.6]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="white" emissive="#FFD400" emissiveIntensity={2} metalness={0.1} roughness={0.1} />
        </mesh>
        {/* Pupils */}
        <mesh ref={pupilsRefL} position={[-0.6, 0, 0.9]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#000" metalness={1} roughness={0.5} />
        </mesh>
        <mesh ref={pupilsRefR} position={[0.6, 0, 0.9]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#000" metalness={1} roughness={0.5} />
        </mesh>
        {/* Eyelids */}
        <mesh ref={eyelidsRefL} position={[-0.6, 0, 0.61]}>
          <boxGeometry args={[0.32, 0.32, 0.05]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh ref={eyelidsRefR} position={[0.6, 0, 0.61]}>
          <boxGeometry args={[0.32, 0.32, 0.05]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>
      {/* Arms */}
      <group>
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
          <mesh position={[-1.8, 0.5, 0]}>
            <boxGeometry args={[0.6, 0.6, 2]} />
            <meshStandardMaterial color="#FFD400" metalness={0.6} roughness={0.3} />
          </mesh>
        </Float>
        <Float speed={2} rotationIntensity={-0.3} floatIntensity={0.3}>
          <mesh position={[1.8, 0.5, 0]}>
            <boxGeometry args={[0.6, 0.6, 2]} />
            <meshStandardMaterial color="#FFD400" metalness={0.6} roughness={0.3} />
          </mesh>
        </Float>
      </group>
      {/* Wheels */}
      <mesh position={[-1.2, -1.2, 0]} rotation={[Math.PI/2,0,0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.5, 32]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.4} />
      </mesh>
      <mesh position={[1.2, -1.2, 0]} rotation={[Math.PI/2,0,0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.5, 32]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.4} />
      </mesh>
    </Float>
  );
}

/* ===== Coins ===== */
function Coin({ color, position }: { color: string; position: [number, number, number] }) {
  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={1}>
      <mesh position={position}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </Float>
  );
}

/* ===== Page ===== */
export default function PaidOFFLanding() {
  const [risk, setRisk] = useState<RiskKey>("medium");
  const [period, setPeriod] = useState<Period>(PERIODS[2]);
  const [deposit, setDeposit] = useState<number>(500);
  const [series, setSeries] = useState<Point[]>(
    () => simulateSeries({ days: period.days, dailyRange: RISKS[risk].range, deposit })
  );

  useEffect(() => {
    setSeries(simulateSeries({ days: period.days, dailyRange: RISKS[risk].range, deposit }));
  }, [risk, period, deposit]);

  const endBalance = series[series.length - 1]?.balance ?? deposit;
  const roi = ((endBalance - deposit) / deposit) * 100;

  return (
    <div className="bg-[#0a0a0a] text-white font-sans">
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="text-2xl font-black text-yellow-300">PAIDOFF</div>
          <button className="px-4 py-2 rounded-full bg-white text-black">Launch App</button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold leading-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            AI Trading with <span className="text-yellow-300">PaidOFF</span>
          </motion.h1>
          <p className="mt-6 text-lg text-gray-300 max-w-xl">
            Торгуй с роботом в 3D! Криптомонеты летают вокруг, а твоя прибыль растет.
          </p>
        </div>
        <div className="h-[400px] rounded-3xl overflow-hidden border border-yellow-300/30 shadow-2xl">
          <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Suspense fallback={null}>
              <Robot3D />
              <Coin color="orange" position={[-3, 1, -2]} />
              <Coin color="blue" position={[2, -1, -1]} />
              <Coin color="green" position={[1, 2, -3]} />
              <Environment preset="city" />
            </Suspense>
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-700">
            <h3 className="font-bold mb-2">Режим риска</h3>
            <div className="flex gap-2">
              {Object.entries(RISKS).map(([key, r]) => (
                <button
                  key={key}
                  onClick={() => setRisk(key as RiskKey)}
                  className={`flex-1 rounded-xl py-2 ${risk===key ? "bg-yellow-300 text-black" : "bg-zinc-800 text-yellow-300"}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-700">
            <h3 className="font-bold mb-2">Срок</h3>
            <div className="flex gap-2">
              {PERIODS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setPeriod(p)}
                  className={`flex-1 rounded-xl py-2 ${period.label===p.label ? "bg-yellow-300 text-black" : "bg-zinc-800 text-yellow-300"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-700">
            <h3 className="font-bold mb-2">Депозит (USDT)</h3>
            <input
              type="range"
              min={50}
              max={5000}
              value={deposit}
              onChange={(e) => setDeposit(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="mt-2 text-lg font-bold">{deposit} USDT</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black rounded-2xl p-4 border border-zinc-700">
              <div className="text-xs text-gray-400">Конец периода</div>
              <div className="text-2xl font-extrabold text-yellow-300">{endBalance.toFixed(2)} USDT</div>
            </div>
            <div className="bg-black rounded-2xl p-4 border border-zinc-700">
              <div className="text-xs text-gray-400">ROI</div>
              <div className="text-2xl font-extrabold text-yellow-300">{roi.toFixed(1)}%</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-black/10">
          <h3 className="text-xl font-bold mb-4 text-black">Симуляция доходности</h3>
          <div style={{ width: "100%", height: 340 }}>
            <ResponsiveContainer>
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tickFormatter={(d) => `${d}d`} />
                <YAxis />
                <Tooltip formatter={(v: any) => `${v} USDT`} labelFormatter={(l: any) => `День ${l}`} />
                <Line type="monotone" dataKey="balance" stroke={RISKS[risk].color} strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
