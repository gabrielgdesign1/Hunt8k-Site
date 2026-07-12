"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const MAIN_URLS = [
  "/hero/main-1.webp",
  "/hero/main-2.webp",
  "/hero/main-3.webp",
  "/hero/main-4.webp",
];
const BG_URLS = ["/hero/bg-1.webp", "/hero/bg-2.webp", "/hero/bg-3.webp"];
const ALL_URLS = [...MAIN_URLS, ...BG_URLS];

const PLANE_W = 3.5;
const PLANE_H = 1.97;

const PARALLAX_X = 0.16;
const PARALLAX_Y = 0.12;

type PlaneDef = {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  tex: number;
  opacity: number;
};

function rand(i: number) {
  return Math.abs((Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1);
}

// A curated, scattered collage. Positions are fractions of the half-viewport
// (fx/fy in -1..1) and each image's width is a fraction of the viewport width
// (wFrac), so the montage scales with any aspect ratio. The headline is an
// HTML overlay drawn ON TOP of this canvas, so images can freely fill the
// whole frame — a strong center scrim (in Hero.tsx) keeps the text readable.
type Scatter = {
  wFrac: number;
  fx: number;
  fy: number;
  rot: number;
  tex: number;
  opacity: number;
};

const SCATTER: Scatter[] = [
  // bold corner pieces
  { wFrac: 0.38, fx: -0.56, fy: 0.52, rot: -5, tex: 0, opacity: 1 },
  { wFrac: 0.36, fx: 0.6, fy: 0.56, rot: 6, tex: 1, opacity: 1 },
  { wFrac: 0.35, fx: -0.6, fy: -0.54, rot: 4, tex: 2, opacity: 1 },
  { wFrac: 0.38, fx: 0.58, fy: -0.52, rot: -6, tex: 3, opacity: 1 },
  // top/bottom + side edge fillers
  { wFrac: 0.26, fx: 0.03, fy: 0.86, rot: 3, tex: 4, opacity: 1 },
  { wFrac: 0.26, fx: -0.04, fy: -0.9, rot: -3, tex: 5, opacity: 1 },
  { wFrac: 0.24, fx: -0.9, fy: 0.02, rot: -7, tex: 6, opacity: 1 },
  { wFrac: 0.24, fx: 0.92, fy: -0.05, rot: 7, tex: 0, opacity: 1 },
  // mid pieces closing the inner gaps
  { wFrac: 0.22, fx: 0.44, fy: 0.1, rot: -8, tex: 1, opacity: 1 },
  { wFrac: 0.22, fx: -0.46, fy: -0.12, rot: 8, tex: 2, opacity: 1 },
  // faded pieces sitting behind the headline for depth
  { wFrac: 0.28, fx: -0.18, fy: 0.05, rot: 6, tex: 3, opacity: 0.3 },
  { wFrac: 0.28, fx: 0.2, fy: -0.08, rot: -6, tex: 5, opacity: 0.3 },
];

// portrait phones are tall + narrow: use big images stacked top & bottom
// (16:9 images barely cover height otherwise), keeping the vertical center
// band lighter so the headline stays readable.
const SCATTER_MOBILE: Scatter[] = [
  { wFrac: 0.92, fx: -0.1, fy: 0.78, rot: -4, tex: 0, opacity: 1 },
  { wFrac: 0.85, fx: 0.16, fy: 0.46, rot: 5, tex: 1, opacity: 1 },
  { wFrac: 0.88, fx: 0.12, fy: -0.46, rot: 4, tex: 2, opacity: 1 },
  { wFrac: 0.92, fx: -0.12, fy: -0.78, rot: -5, tex: 3, opacity: 1 },
  { wFrac: 0.8, fx: -0.05, fy: 0.16, rot: 3, tex: 4, opacity: 0.55 },
  { wFrac: 0.8, fx: 0.06, fy: -0.16, rot: -3, tex: 5, opacity: 0.55 },
];

function buildScatter(vw: number, vh: number, isMobile: boolean): PlaneDef[] {
  const set = isMobile ? SCATTER_MOBILE : SCATTER;
  return set.map((s) => {
    const scale = (vw * s.wFrac) / PLANE_W;
    return {
      pos: [s.fx * (vw / 2), s.fy * (vh / 2), s.opacity < 1 ? -1 : 0],
      rot: [0, 0, (s.rot * Math.PI) / 180],
      scale,
      tex: s.tex,
      opacity: s.opacity,
    };
  });
}

function Plane({ def, tex }: { def: PlaneDef; tex: THREE.Texture }) {
  const ref = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => rand(def.pos[0] * 3.7 + def.pos[1]) * 10, [def.pos]);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.4 + seed) * 0.05;
  });
  return (
    <group position={def.pos} rotation={def.rot}>
      <mesh ref={ref} scale={[PLANE_W * def.scale, PLANE_H * def.scale, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={tex}
          toneMapped={false}
          side={THREE.DoubleSide}
          transparent={def.opacity < 1}
          opacity={def.opacity}
        />
      </mesh>
    </group>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 160;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = -Math.random() * 20 + 4;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.015;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.04} color="#ff5a4d" transparent opacity={0.45} />
    </points>
  );
}

function Scene({ isMobile }: { isMobile: boolean }) {
  const { viewport } = useThree();
  const defs = useMemo(
    () => buildScatter(viewport.width, viewport.height, isMobile),
    [viewport.width, viewport.height, isMobile]
  );
  const textures = useTexture(ALL_URLS);
  const mouse = useRef({ x: 0, y: 0 });

  useMemo(() => {
    (Array.isArray(textures) ? textures : [textures]).forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
    });
  }, [textures]);

  useFrame((state) => {
    mouse.current.x += (state.pointer.x - mouse.current.x) * 0.05;
    mouse.current.y += (state.pointer.y - mouse.current.y) * 0.05;
    state.camera.position.x += (mouse.current.x * PARALLAX_X - state.camera.position.x) * 0.05;
    state.camera.position.y += (-mouse.current.y * PARALLAX_Y - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, -10);
  });

  return (
    <>
      <fog attach="fog" args={["#060607", 7, 18]} />
      {defs.map((def, i) => (
        <Plane key={i} def={def} tex={(textures as THREE.Texture[])[def.tex]} />
      ))}
      <Dust />
    </>
  );
}

export default function ThumbnailTunnel() {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 68 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <Scene isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
}
