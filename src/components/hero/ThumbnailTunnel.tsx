"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

// four "2x2" images for the foreground grid + three for the background
const MAIN_URLS = [
  "/hero/main-1.webp",
  "/hero/main-2.webp",
  "/hero/main-3.webp",
  "/hero/main-4.webp",
];
const BG_URLS = ["/hero/bg-1.webp", "/hero/bg-2.webp", "/hero/bg-3.webp"];
const ALL_URLS = [...MAIN_URLS, ...BG_URLS];
const BG_OFFSET = MAIN_URLS.length;

const PLANE_W = 3.5;
const PLANE_H = 1.97;

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

// four foreground images, one per corner, sized to the viewport so they fill
// the space as much as possible without ever clipping the edges.
function buildCorners(halfW: number, halfH: number, isMobile: boolean): PlaneDef[] {
  const scale = isMobile ? 0.82 : 1.06;
  const planeHalfW = (PLANE_W * scale) / 2 * 0.95;
  const planeHalfH = (PLANE_H * scale) / 2;
  // keep a margin that also accounts for the mouse-parallax drift
  const x = Math.max(planeHalfW * 0.35, halfW - planeHalfW - 0.55);
  const y = Math.max(planeHalfH * 0.6, halfH - planeHalfH - 0.45);
  const corners: [number, number][] = [
    [-x, y],
    [x, y],
    [-x, -y],
    [x, -y],
  ];
  const dummy = new THREE.Object3D();
  return corners.map(([px, py], i) => {
    const z = i % 2 === 0 ? -0.4 : -1.0;
    dummy.position.set(px, py, z);
    dummy.lookAt(0, 0, z + 9);
    return {
      pos: [px, py, z],
      rot: [dummy.rotation.x, dummy.rotation.y, dummy.rotation.z],
      scale,
      tex: i % MAIN_URLS.length,
      opacity: 1,
    };
  });
}

// the three background images clustered toward the CENTER, receding and faded —
// depth that sits behind the headline, not directly behind the corner images.
function buildDepth(count: number): PlaneDef[] {
  const dummy = new THREE.Object3D();
  const defs: PlaneDef[] = [];
  for (let i = 0; i < count; i++) {
    const z = -4.5 - i * 2.6;
    const angle = rand(i) * Math.PI * 2;
    const r = 0.4 + rand(i + 21) * 1.7;
    const pos: [number, number, number] = [
      Math.cos(angle) * r,
      Math.sin(angle) * r * 0.7,
      z,
    ];
    dummy.position.set(pos[0], pos[1], pos[2]);
    dummy.lookAt(0, 0, z + 9);
    defs.push({
      pos,
      rot: [dummy.rotation.x, dummy.rotation.y, dummy.rotation.z],
      scale: 0.6 + rand(i + 5) * 0.3,
      tex: BG_OFFSET + (i % BG_URLS.length),
      opacity: 0.32,
    });
  }
  return defs;
}

function Plane({ def, tex }: { def: PlaneDef; tex: THREE.Texture }) {
  const ref = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => rand(def.pos[2]) * 10, [def.pos]);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.4 + seed) * 0.06;
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
    const n = 180;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = -Math.random() * 40 + 4;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.015;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.04} color="#ff5a4d" transparent opacity={0.5} />
    </points>
  );
}

function Scene({ depthCount, isMobile }: { depthCount: number; isMobile: boolean }) {
  const { viewport } = useThree();
  const defs = useMemo(
    () => [
      ...buildCorners(viewport.width / 2, viewport.height / 2, isMobile),
      ...buildDepth(depthCount),
    ],
    [viewport.width, viewport.height, depthCount, isMobile]
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
    state.camera.position.x += (mouse.current.x * 0.4 - state.camera.position.x) * 0.05;
    state.camera.position.y += (-mouse.current.y * 0.3 - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, -12);
  });

  return (
    <>
      <fog attach="fog" args={["#060607", 6, 16]} />
      {defs.map((def, i) => (
        <Plane key={i} def={def} tex={(textures as THREE.Texture[])[def.tex]} />
      ))}
      <Dust />
    </>
  );
}

export default function ThumbnailTunnel() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const depthCount = isMobile ? 5 : 8;
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 68 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <Scene depthCount={depthCount} isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
}
