"use client";

import { SCENE_CLICKABLE_TYPES } from "@/lib/constants";
import { drawCube } from "@/lib/scene/cube";
import { drawFloor } from "@/lib/scene/floor";
import { setupScene } from "@/lib/scene/setup";
import { checkObjectClick } from "@/lib/threejsHelpers/clickHelper";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";

export default function Home() {
  const sceneContainerRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<THREE.Scene>(null);
  const cameraRef = useRef<THREE.Camera>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);

  const cubeRef = useRef<THREE.Group>(null);
  const cubeletsRef = useRef<THREE.Mesh[]>([]);

  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  const animate = useCallback(() => {
    if (!rendererRef.current) return;
    if (!sceneRef.current) return;
    if (!cameraRef.current) return;

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;

    renderer.render(scene, camera);
  }, [sceneRef, cameraRef, rendererRef]);

  const resetCube = useCallback(() => {
    console.log("resetCube");
  }, []);

  // Mouse handlers
  const handleMouseDown = useCallback((event: MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDraggingRef.current || !cubeRef.current) return;

    const deltaX = event.clientX - previousMousePositionRef.current.x;
    const deltaY = event.clientY - previousMousePositionRef.current.y;

    const cube = cubeRef.current;
    const maximumRotation = Math.PI / 2;

    cube.rotation.y += deltaX * 0.01;
    cube.rotation.x = Math.max(
      Math.min(cube.rotation.x + deltaY * 0.01, maximumRotation),
      -maximumRotation
    );

    previousMousePositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }, []);

  const handleMouseUp = useCallback((event: MouseEvent) => {
    isDraggingRef.current = false;
    // Check for 3D object clicks using raycasting
    if (sceneRef.current && cameraRef.current && rendererRef.current) {
      checkObjectClick(
        event,
        sceneRef.current,
        cameraRef.current,
        rendererRef.current,
        SCENE_CLICKABLE_TYPES
      );
    }
  }, []);

  const initScene = useCallback(() => {
    if (!sceneContainerRef.current) return;
    const { scene, camera, renderer } = setupScene(window);
    renderer.setAnimationLoop(animate);
    sceneContainerRef.current.appendChild(renderer.domElement);
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    drawFloor(scene, resetCube);
    const { cubelets, cubeGroup } = drawCube(scene);
    cubeletsRef.current = cubelets;
    cubeRef.current = cubeGroup;

    return renderer;
  }, [animate, resetCube, handleMouseDown, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const renderer = initScene();
    if (!renderer) return;

    const canvas = renderer.domElement;
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [initScene, handleMouseDown, handleMouseMove, handleMouseUp]);

  return <div ref={sceneContainerRef} />;
}
