// types/r3f.d.ts
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      ambientLight: any;
      directionalLight: any;
      // geometries
      boxGeometry: any;
      sphereGeometry: any;
      cylinderGeometry: any;
      // materials
      meshStandardMaterial: any;
    }
  }
}
export {};
