"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { WORK, workSrc } from "@/lib/site";

const URLS = WORK.map((w) => workSrc(w, true));
const STEP = 2.4;

type PlaneDef = {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  tex: number;
};

// deterministic pseudo-random so SSR/CSR agree and layout is stable
function rand(i: number) {
  return Math.abs((Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1);
}

// the four foreground images, pinned one to each corner in a clean 2x2 grid
function buildCorners(isMobile: boolean): PlaneDef[] {
  const x = isMobile ? 1.55 : 3.5;
  const y = isMobile ? 2.6 : 2.1;
  const corners: [number, number][] = [
    [-x, y], // top-left
    [x, y], // top-right
    [-x, -y], // bottom-left
    [x, -y], // bottom-right
  ];
  const dummy = new THREE.Object3D();
  return corners.map(([px, py], i) => {
    const z = i % 2 === 0 ? 0.5 : -0.3;
    dummy.position.set(px, py, z);
    dummy.lookAt(0, 0, z + 9);
    return {
      pos: [px, py, z],
      rot: [dummy.rotation.x, dummy.rotation.y, dummy.rotation.z],
      scale: isMobile ? 0.85 : 1.15,
      tex: i % URLS.length,
    };
  });
}

// extra thumbnails receding further back, purely for ambient depth
function buildDepth(count: number, texOffset: number): PlaneDef[] {
  const dummy = new THREE.Object3D();
  const defs: PlaneDef[] = [];
  for (let i = 0; i < count; i++) {
    const z = -3 - i * STEP;
    const slot = i % 4;
    const j = rand(i + 500);
    const k = rand(i + 700);
    let pos: [number, number, number];
    if (slot === 0) pos = [-(3.0 + j * 1.1), -1.0 + k * 2.2, z];
    else if (slot === 1) pos = [3.0 + j * 1.1, 1.0 - k * 2.2, z];
    else if (slot === 2) pos = [-1.0 + k * 2.2, 2.1 + j * 0.6, z];
    else pos = [1.0 - k * 2.2, -(2.1 + j * 0.6), z];

    dummy.position.set(pos[0], pos[1], pos[2]);
    dummy.lookAt(0, 0, z + 9);

    defs.push({
      pos,
      rot: [dummy.rotation.x, dummy.rotation.y, dummy.rotation.z],
      scale: 0.75 + j * 0.3,
      tex: (texOffset + i * 3 + slot) % URLS.length,
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
    ref.current.position.y = Math.sin(t * 0.4 + seed) * 0.07;
  });
  return (
    <group position={def.pos} rotation={def.rot}>
      <mesh ref={ref} scale={[3.5 * def.scale, 1.97 * def.scale, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={tex} toneMapped={false} side={THREE.DoubleSide} />
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
  const defs = useMemo(
    () => [...buildCorners(isMobile), ...buildDepth(depthCount, 4)],
    [depthCount, isMobile]
  );
  const textures = useTexture(URLS);
  const mouse = useRef({ x: 0, y: 0 });

  useMemo(() => {
    (Array.isArray(textures) ? textures : [textures]).forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
    });
  }, [textures]);

  useFrame((state) => {
    // gentle parallax only — camera never dollies forward, so scrolling
    // just scrolls the page rather than flying through the scene
    mouse.current.x += (state.pointer.x - mouse.current.x) * 0.05;
    mouse.current.y += (state.pointer.y - mouse.current.y) * 0.05;
    state.camera.position.x += (mouse.current.x * 1.3 - state.camera.position.x) * 0.05;
    state.camera.position.y += (-mouse.current.y * 0.9 - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, -12);
  });

  return (
    <>
      <fog attach="fog" args={["#060607", 7, 20]} />
      {defs.map((def, i) => (
        <Plane key={i} def={def} tex={(textures as THREE.Texture[])[def.tex]} />
      ))}
      <Dust />
    </>
  );
}

export default function ThumbnailTunnel() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const depthCount = isMobile ? 6 : 10;
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
