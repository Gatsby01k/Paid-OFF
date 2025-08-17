// Позволяет использовать JSX-теги R3F: <mesh/>, <boxGeometry/>, ...
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
// Нужно, чтобы файл считался модулем
export {};
