import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useUiStore } from "../../store/useUiStore";

function ParticleSphere() {
  const ref = useRef<any>();
  const theme = useUiStore((state) => state.theme);
  const isLight = theme === "light";
  
  const sphere = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Points on a sphere
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 0.2; // radius with slight variation
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.05;
      ref.current.rotation.x -= delta * 0.02;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={isLight ? "#2563eb" : "#6366f1"}
          size={isLight ? 0.025 : 0.015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={isLight ? 0.9 : 0.6}
        />
      </Points>
    </group>
  );
}

export default function Hero3DScene() {
  const theme = useUiStore((state) => state.theme);
  const isLight = theme === "light";

  return (
    <div className={`absolute inset-0 z-0 pointer-events-none ${isLight ? "opacity-60 md:opacity-80" : "opacity-40 md:opacity-60"}`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ParticleSphere />
      </Canvas>
    </div>
  );
}
