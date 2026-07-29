"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  TEXTURES                                                           */
/* ------------------------------------------------------------------ */
// One unique image per plane — repeats were the main reason the old
// arrangement read as a jumbled mosaic. The curated hero shots carry the
// foreground; work thumbnails (already optimised as small -tex files) fill
// the mid and back layers.
const HERO_URLS = [
  "/hero/main-1.webp", // 0
  "/hero/main-2.webp", // 1
  "/hero/main-3.webp", // 2
  "/hero/main-4.webp", // 3
  "/hero/bg-1.webp", // 4
  "/hero/bg-2.webp", // 5
  "/hero/bg-3.webp", // 6
];
const WORK_URLS = [
  "/work/gaming/black-ops-7-tex.webp", // 7
  "/work/irl/sketch-jynxzi-madden-tex.webp", // 8
  "/work/gaming/kreekcraft-roblox-tex.webp", // 9
  "/work/irl/gavin-magnus-car-tex.webp", // 10
  "/work/gaming/faze-replays-simpson-tex.webp", // 11
  "/work/irl/max-reaction-tex.webp", // 12
];
const ALL_URLS = [...HERO_URLS, ...WORK_URLS];

const PLANE_W = 3.5;
const PLANE_H = 1.97; // 16:9

const CAM_Z = 6;
const PARALLAX_X = 0.5;
const PARALLAX_Y = 0.34;

/* ------------------------------------------------------------------ */
/*  LAYOUT                                                             */
/* ------------------------------------------------------------------ */
// Each card is authored in SCREEN space and then projected onto its own
// depth plane, so `z` never shifts a card off its intended spot — it only
// buys the things that actually read as depth:
//   • mouse parallax (near cards swing further than far ones)
//   • fog fade toward the ink background
//   • dimming/darkening of the back layer
//
//  wFrac   card width as a fraction of the viewport width
//  fx/fy   centre position as a fraction of the half-viewport (-1…1)
//  rot     tilt in degrees
//  z       depth: > 0 is toward the camera, < 0 is away from it
//  tex     index into ALL_URLS
//  opacity 1 = crisp foreground, < 1 = faded depth behind the headline
type Scatter = {
  wFrac: number;
  fx: number;
  fy: number;
  rot: number;
  z: number;
  tex: number;
  opacity: number;
};

const Z_FRONT = 1.5;
const Z_SIDE = 0.8;
const Z_MID = 0;
const Z_BACK = -4;

const SCATTER: Scatter[] = [
  // ---- FRONT: big corner cards, bleeding off the edges so they read as
  //      the closest thing to the viewer.
  { wFrac: 0.24, fx: -0.87, fy: 0.6, rot: -7, z: Z_FRONT, tex: 0, opacity: 1 },
  { wFrac: 0.23, fx: 0.86, fy: 0.63, rot: 6, z: Z_FRONT, tex: 1, opacity: 1 },
  { wFrac: 0.24, fx: -0.89, fy: -0.63, rot: 5, z: Z_FRONT, tex: 2, opacity: 1 },
  { wFrac: 0.23, fx: 0.87, fy: -0.66, rot: -6, z: Z_FRONT, tex: 3, opacity: 1 },

  // ---- SIDES: smaller cards plugging the vertical gap between the corners.
  { wFrac: 0.16, fx: -0.97, fy: 0.0, rot: 8, z: Z_SIDE, tex: 8, opacity: 1 },
  { wFrac: 0.16, fx: 0.99, fy: -0.03, rot: -8, z: Z_SIDE, tex: 9, opacity: 1 },

  // ---- MID: top & bottom edge cards, one step back from the corners.
  { wFrac: 0.19, fx: -0.30, fy: 0.86, rot: 4, z: Z_MID, tex: 4, opacity: 1 },
  { wFrac: 0.18, fx: 0.30, fy: 0.9, rot: -5, z: Z_MID, tex: 5, opacity: 1 },
  { wFrac: 0.19, fx: -0.28, fy: -0.88, rot: -4, z: Z_MID, tex: 6, opacity: 1 },
  { wFrac: 0.18, fx: 0.32, fy: -0.86, rot: 5, z: Z_MID, tex: 7, opacity: 1 },

  // ---- BACK: dim, fogged cards drifting behind the headline. These are what
  //      give the composition its sense of distance — never fully readable.
  { wFrac: 0.22, fx: -0.44, fy: 0.24, rot: 9, z: Z_BACK, tex: 10, opacity: 0.52 },
  { wFrac: 0.21, fx: 0.48, fy: -0.22, rot: -8, z: Z_BACK, tex: 11, opacity: 0.52 },
  { wFrac: 0.18, fx: 0.04, fy: 0.36, rot: 5, z: Z_BACK - 1.2, tex: 12, opacity: 0.4 },
];

// Portrait phones are tall and narrow, so 16:9 cards cover very little
// height. Fewer, much wider cards stacked top and bottom, with the centre
// band left to the dim back layer so the headline stays readable.
const SCATTER_MOBILE: Scatter[] = [
  // The inner pair sits one tier back so that where it meets the outer pair
  // it tucks *behind* it — on a narrow screen cards have to touch, and
  // stacking them across depths is what stops that reading as a blob.
  { wFrac: 0.62, fx: -0.42, fy: 0.8, rot: -5, z: Z_FRONT, tex: 0, opacity: 1 },
  { wFrac: 0.6, fx: 0.46, fy: 0.52, rot: 6, z: Z_SIDE, tex: 1, opacity: 1 },
  { wFrac: 0.6, fx: -0.4, fy: -0.52, rot: 5, z: Z_SIDE, tex: 2, opacity: 1 },
  { wFrac: 0.62, fx: 0.44, fy: -0.8, rot: -5, z: Z_FRONT, tex: 3, opacity: 1 },
  { wFrac: 0.5, fx: 0.52, fy: 0.98, rot: 4, z: Z_MID, tex: 4, opacity: 1 },
  { wFrac: 0.5, fx: -0.5, fy: -0.98, rot: -4, z: Z_MID, tex: 6, opacity: 1 },
  { wFrac: 0.72, fx: -0.06, fy: 0.2, rot: 4, z: Z_BACK, tex: 10, opacity: 0.32 },
  { wFrac: 0.72, fx: 0.08, fy: -0.2, rot: -4, z: Z_BACK, tex: 11, opacity: 0.32 },
];

type PlaneDef = {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  depthK: number;
  tex: number;
  opacity: number;
};

function rand(i: number) {
  return Math.abs((Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1);
}

function buildScatter(vw: number, vh: number, isMobile: boolean): PlaneDef[] {
  const set = isMobile ? SCATTER_MOBILE : SCATTER;
  return set.map((s) => {
    // `vw`/`vh` describe the frustum at z = 0. A plane sitting at depth `z`
    // is (CAM_Z - z) away, so everything about it — position and size — has
    // to be scaled by `k` to land on the same spot on screen.
    const k = (CAM_Z - s.z) / CAM_Z;
    return {
      pos: [s.fx * (vw / 2) * k, s.fy * (vh / 2) * k, s.z],
      rot: [0, 0, (s.rot * Math.PI) / 180],
      scale: (vw * s.wFrac * k) / PLANE_W,
      depthK: k,
      tex: s.tex,
      opacity: s.opacity,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  PLANES                                                             */
/* ------------------------------------------------------------------ */
function Plane({ def, tex }: { def: PlaneDef; tex: THREE.Texture }) {
  const ref = useRef<THREE.Group>(null);
  const seed = useMemo(() => rand(def.pos[0] * 3.7 + def.pos[1]) * 10, [def.pos]);
  const w = PLANE_W * def.scale;
  const h = PLANE_H * def.scale;
  const solid = def.opacity >= 1;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // Drift in world units scaled by depth, so every card appears to move
    // the same small amount on screen no matter how far back it sits.
    ref.current.position.y = Math.sin(t * 0.4 + seed) * 0.06 * def.depthK;
    ref.current.position.x = Math.cos(t * 0.29 + seed * 1.7) * 0.04 * def.depthK;
    ref.current.rotation.z = Math.sin(t * 0.23 + seed) * 0.007;
  });

  return (
    <group position={def.pos} rotation={def.rot}>
      <group ref={ref}>
        {/* A slightly oversized black card behind each solid image reads as a
            drop shadow — it keeps neighbouring thumbnails from melting into
            one another wherever they do overlap. */}
        {solid && (
          <mesh position={[0, 0, -0.01]} scale={[w * 1.035, h * 1.05, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.6}
              depthWrite={false}
            />
          </mesh>
        )}
        <mesh scale={[w, h, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={tex}
            toneMapped={false}
            transparent={!solid}
            opacity={def.opacity}
            depthWrite={solid}
            // Push the back layer down toward the ink so it sits behind the
            // headline instead of competing with it.
            color={solid ? "#ffffff" : "#b4b4bd"}
          />
        </mesh>
      </group>
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
    state.camera.position.x +=
      (mouse.current.x * PARALLAX_X - state.camera.position.x) * 0.05;
    state.camera.position.y +=
      (-mouse.current.y * PARALLAX_Y - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, -10);
  });

  return (
    <>
      {/* Reaches the back layer (~10 units out) but leaves the front and mid
          cards untouched, so distance alone desaturates the depth. */}
      <fog attach="fog" args={["#060607", 6.5, 16]} />
      {defs.map((def, i) => (
        <Plane key={i} def={def} tex={(textures as THREE.Texture[])[def.tex]} />
      ))}
      <Dust />
    </>
  );
}

export default function ThumbnailTunnel() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, CAM_Z], fov: 68 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <Scene isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
}
