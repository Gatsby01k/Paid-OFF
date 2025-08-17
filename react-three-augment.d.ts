// react-three-augment.d.ts
// Подмешиваем типы JSX тэгов (<mesh/>, <boxGeometry/> и т.д.) из @react-three/fiber
import type { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    // расширяем стандартные IntrinsicElements типами из R3F
    interface IntrinsicElements extends ThreeElements {}
  }
}

export {};
