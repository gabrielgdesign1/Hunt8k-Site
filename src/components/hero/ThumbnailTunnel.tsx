"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { WORK, workSrc } from "@/lib/site";

const URLS = WORK.map((w) => workSrc(w, true));

type PlaneDef = {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  tex: number;
};

function buildLayout(count: number): PlaneDef[] {
  const step = 3.7;
  const defs: PlaneDef[] = [];
  for (let i = 0; i < count; i++) {
    const z = 2 - i * step;
    const side = i % 4;
    const jitter = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const rad = 3.1 + Math.abs(jitter) * 1.1;
    let pos: [number, number, number];
    let rot: [number, number, number];
    if (side === 0) {
      pos = [-rad, -0.4 + jitter * 1.6, z];
      rot = [0, 0.62, 0];
    } else if (side === 1) {
      pos = [rad, 0.4 - jitter * 1.6, z];
      rot = [0, -0.62, 0];
    } else if (side === 2) {
      pos = [-0.6 + jitter, rad - 0.6, z];
      rot = [0.5, 0, 0];
    } else {
      pos = [0.6 - jitter, -rad + 0.6, z];
      rot = [-0.5, 0, 0];
    }
    defs.push({
      pos,
      rot,
      scale: 0.92 + Math.abs(jitter) * 0.4,
      tex: i % URLS.length,
    });
  }
  return defs;
}

function Plane({ def, tex }: { def: PlaneDef; tex: THREE.Texture }) {
  const ref = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => Math.random() * 10, []);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = def.pos[1] + Math.sin(t * 0.5 + seed) * 0.09;
  });
  return (
    <group position={def.pos} rotation={def.rot}>
      <mesh ref={ref} scale={[3.55 * def.scale, 2 * def.scale, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {/* red edge frame */}
      <mesh scale={[3.55 * def.scale + 0.08, 2 * def.scale + 0.08, 1]} position={[0, 0, -0.01]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ff2116" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 260;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = -Math.random() * 90 + 4;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.02;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.045} color="#ff5a4d" transparent opacity={0.6} />
    </points>
  );
}

function Scene({
  progress,
  count,
}: {
  progress: MutableRefObject<number>;
  count: number;
}) {
  const defs = useMemo(() => buildLayout(count), [count]);
  const textures = useTexture(URLS);
  const mouse = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  useMemo(() => {
    (Array.isArray(textures) ? textures : [textures]).forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
    });
  }, [textures]);

  useFrame((state) => {
    mouse.current.x += (state.pointer.x - mouse.current.x) * 0.05;
    mouse.current.y += (state.pointer.y - mouse.current.y) * 0.05;
    const travel = count * 3.7;
    const targetZ = 6 - progress.current * travel;
    camera.position.z += (targetZ - camera.position.z) * 0.08;
    camera.position.x += (mouse.current.x * 1.1 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.current.y * 0.7 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, camera.position.z - 8);
  });

  return (
    <>
      <fog attach="fog" args={["#060607", 8, 34]} />
      {defs.map((def, i) => (
        <Plane key={i} def={def} tex={(textures as THREE.Texture[])[def.tex]} />
      ))}
      <Dust />
    </>
  );
}

export default function ThumbnailTunnel({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  const count =
    typeof window !== "undefined" && window.innerWidth < 768 ? 16 : 28;
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 68 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <Scene progress={progress} count={count} />
      </Suspense>
    </Canvas>
  );
}
