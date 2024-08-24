"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei'

export default function Home() {
  return (
    <Canvas>
      <OrbitControls />
      <directionalLight />
      <ambientLight />
      <mesh>
        <boxGeometry position={[1, 0, 0]} args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />

      </mesh>
    </Canvas>
  );
}