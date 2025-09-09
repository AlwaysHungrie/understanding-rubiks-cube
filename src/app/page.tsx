"use client";

import { drawFloor } from "@/lib/scene/floor";
import { setupScene } from "@/lib/scene/setup";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";

export default function Home() {
  const sceneContainerRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<THREE.Scene>(null);
  const cameraRef = useRef<THREE.Camera>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);

  const animate = useCallback(() => {
    if (!rendererRef.current) return;
    if (!sceneRef.current) return;
    if (!cameraRef.current) return;

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;

    renderer.render(scene, camera);
  }, [sceneRef, cameraRef, rendererRef]);

  const resetCube = useCallback(() => {}, []);

  const initScene = useCallback(() => {
    if (!sceneContainerRef.current) return;
    const { scene, camera, renderer } = setupScene(window);
    renderer.setAnimationLoop(animate);
    sceneContainerRef.current.appendChild(renderer.domElement);
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    drawFloor(scene, resetCube);
  }, [animate, resetCube]);

  useEffect(() => {
    initScene();
  }, [initScene]);

  return <div ref={sceneContainerRef} />;
}
