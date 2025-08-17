// @ts-nocheck
'use client';

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import { useRef, useEffect } from 'react'

export default function Home() {
  return (
    <main style={{ width: "100%", height: "100vh", background: "black", color: "white" }}>
      <h1 style={{ textAlign: "center", padding: "20px" }}>🤖 AI Trading with PaidOFF</h1>
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Робот */}
        <Robot />

        {/* Управление камерой */}
        <OrbitControls />
      </Canvas>
    </main>
  )
}

function Robot() {
  const eyesRef = useRef<any>()

  // Следим за курсором
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (eyesRef.current) {
        eyesRef.current.rotation.y = (e.clientX / window.innerWidth - 0.5) * 0.5
        eyesRef.current.rotation.x = -(e.clientY / window.innerHeight - 0.5) * 0.3
      }
    }
    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [])

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
      {/* Тело */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#FFD400" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Голова */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.5, 1, 1.2]} />
        <meshStandardMaterial color="#FFD400" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Глаза */}
      <group ref={eyesRef}>
        <mesh position={[-0.4, 1.5, 0.65]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial emissive="cyan" emissiveIntensity={1} color="white" />
        </mesh>
        <mesh position={[0.4, 1.5, 0.65]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial emissive="cyan" emissiveIntensity={1} color="white" />
        </mesh>
      </group>

      {/* Руки */}
      <mesh position={[-1.8, 0.5, 0]}>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
        <meshStandardMaterial color="#FFD400" />
      </mesh>
      <mesh position={[1.8, 0.5, 0]}>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
        <meshStandardMaterial color="#FFD400" />
      </mesh>
    </Float>
  )
}
