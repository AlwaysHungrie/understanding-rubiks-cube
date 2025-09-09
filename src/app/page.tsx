"use client";

import { INITIAL_CUBE_ROTATION, SCENE_CLICKABLE_TYPES } from "@/lib/constants";
import { drawCube, highlightCubelet, removeHighlights } from "@/lib/scene/cube";
import { drawFloor } from "@/lib/scene/floor";
import { setupScene } from "@/lib/scene/setup";
import { rotateObjectToTarget } from "@/lib/threejsHelpers/accelerationHelper";
import { checkObjectClick } from "@/lib/threejsHelpers/clickHelper";
import { findPrimaryNormals } from "@/lib/threejsHelpers/line";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";

export default function Home() {
  const sceneContainerRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<THREE.Scene>(null);
  const cameraRef = useRef<THREE.Camera>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);

  const cubeRef = useRef<THREE.Group>(null);
  const cubeletsRef = useRef<THREE.Mesh[]>([]);
  const faceNormalsRef = useRef<{ key: string; normal: THREE.Group }[]>([]);

  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  // for reseting cube to original position
  const isCubeAnimatingRef = useRef(false);
  const cubeVelocityRef = useRef({ x: 0, y: 0 });

  const animate = useCallback(() => {
    if (!rendererRef.current) return;
    if (!sceneRef.current) return;
    if (!cameraRef.current) return;

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;

    const cube = cubeRef.current;
    if (isCubeAnimatingRef.current && cube) {
      const finalVelocity = rotateObjectToTarget(
        cube,
        INITIAL_CUBE_ROTATION,
        cubeVelocityRef.current
      );

      if (finalVelocity.x === 0 && finalVelocity.y === 0) {
        isCubeAnimatingRef.current = false;
        findPrimaryNormals(faceNormalsRef.current, cube);
      }
      cubeVelocityRef.current = finalVelocity;
    }

    renderer.render(scene, camera);
  }, [sceneRef, cameraRef, rendererRef]);

  const resetCube = useCallback(() => {
    isCubeAnimatingRef.current = true;
    cubeVelocityRef.current = { x: 0, y: 0 };

    // reset dragging
    isDraggingRef.current = false;
    previousMousePositionRef.current = { x: 0, y: 0 };

    console.log("resetCube");
  }, []);

  // Mouse handlers
  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (isCubeAnimatingRef.current) return;
    isDraggingRef.current = true;
    previousMousePositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isCubeAnimatingRef.current) return;
    if (!isDraggingRef.current || !cubeRef.current) return;

    const deltaX = event.clientX - previousMousePositionRef.current.x;
    const deltaY = event.clientY - previousMousePositionRef.current.y;

    const cube = cubeRef.current;
    const maximumYRotation = Math.PI / 2;

    cube.rotation.y += deltaX * 0.01;
    cube.rotation.x = Math.max(
      Math.min(cube.rotation.x + deltaY * 0.01, maximumYRotation),
      -maximumYRotation
    );

    previousMousePositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }, []);

  const handleMouseUp = useCallback((event: MouseEvent) => {
    if (isCubeAnimatingRef.current) return;
    if (!faceNormalsRef.current || !cubeRef.current) return;

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

    findPrimaryNormals(faceNormalsRef.current, cubeRef.current);
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
    const { cubelets, cubeGroup, faceNormals } = drawCube(scene);
    cubeletsRef.current = cubelets;
    cubeRef.current = cubeGroup;
    faceNormalsRef.current = faceNormals;
    findPrimaryNormals(faceNormalsRef.current, cubeRef.current);

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

  return (
    <div ref={sceneContainerRef}>
      <div className="absolute top-0 left-0">
        <button
          onMouseEnter={() => highlightCubelet(cubeletsRef.current[0])}
          onMouseLeave={() => removeHighlights(cubeletsRef.current)}
        >
          Highlight Cubelet
        </button>
      </div>
    </div>
  );
}
