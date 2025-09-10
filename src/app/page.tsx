"use client";

import { INITIAL_CUBE_ROTATION, SCENE_CLICKABLE_TYPES } from "@/lib/constants";
import { drawCube } from "@/lib/scene/cube";
import { drawFloor } from "@/lib/scene/floor";
import { setupScene } from "@/lib/scene/setup";
import {
  rotateObjectOnAxisTillTarget,
  rotateObjectToTarget,
} from "@/lib/threejsHelpers/accelerationHelper";
import { checkObjectClick } from "@/lib/threejsHelpers/clickHelper";
import { findPrimaryNormals } from "@/lib/threejsHelpers/line";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Controls from "@/components/Controls";

export default function Home() {
  const sceneContainerRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<THREE.Scene>(null);
  const cameraRef = useRef<THREE.Camera>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);

  const cubeRef = useRef<THREE.Group | null>(null);
  const cubeletsRef = useRef<THREE.Mesh[] | null>(null);
  const faceNormalsRef = useRef<{ key: string; normal: THREE.Group }[] | null>(
    null
  );

  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  // for reseting cube to original position
  const isCubeAnimatingRef = useRef(false);
  const cubeVelocityRef = useRef({ x: 0, y: 0 });

  // for moving faces, velocity refers to angular velocity
  const temporaryFaceGroupRef = useRef<THREE.Group | null>(null);
  const temporaryFaceVelocityRef = useRef(0);
  const temporaryFaceRotationAxisRef = useRef<THREE.Vector3 | null>(null);

  const primaryNormalsRef = useRef<{
    front: string;
    top: string;
    left: string;
  }>({ front: "", top: "", left: "" });

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
        if (faceNormalsRef.current) {
          primaryNormalsRef.current = findPrimaryNormals(
            faceNormalsRef.current,
            cube,
            primaryNormalsRef.current
          );
        }
      }
      cubeVelocityRef.current = finalVelocity;
    }

    if (temporaryFaceGroupRef.current && temporaryFaceRotationAxisRef.current) {
      const finalVelocity = rotateObjectOnAxisTillTarget(
        temporaryFaceGroupRef.current,
        Math.PI / 2,
        temporaryFaceVelocityRef.current,
        temporaryFaceRotationAxisRef.current
      );

      if (finalVelocity === 0) {
        // clean up temporary face, add cublets back to main group
        const cublets = temporaryFaceGroupRef.current?.children;
        if (cublets) {
          // Apply the temporary group's local transformation to each cublet
          const tempGroup = temporaryFaceGroupRef.current;
          tempGroup.updateMatrix();

          cublets.forEach((cublet) => {
            cublet.applyMatrix4(tempGroup.matrix);
          });

          cubeRef.current?.remove(temporaryFaceGroupRef.current);
          cubeRef.current?.add(...cublets);
        }

        // reset velocity and axis
        temporaryFaceVelocityRef.current = 0;
        temporaryFaceRotationAxisRef.current = null;
        temporaryFaceGroupRef.current = null;
      }
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

    let deltaX = event.clientX - previousMousePositionRef.current.x;
    const deltaY = event.clientY - previousMousePositionRef.current.y;

    const cube = cubeRef.current;

    // if cube is flipped (rotated ~180° around X-axis), invert deltaX for intuitive control
    const normalizedXRotation =
      ((cube.rotation.x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    if (
      normalizedXRotation > Math.PI / 2 &&
      normalizedXRotation < (3 * Math.PI) / 2
    ) {
      deltaX = -deltaX;
    }
    cube.rotation.y += deltaX * 0.01;

    cube.rotation.x += deltaY * 0.01;
    // cube.rotation.x = Math.max(
    //   Math.min(cube.rotation.x + deltaY * 0.01, maximumYRotation),
    //   -maximumYRotation
    // );

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

    if (faceNormalsRef.current && cubeRef.current) {
      primaryNormalsRef.current = findPrimaryNormals(
        faceNormalsRef.current,
        cubeRef.current,
        primaryNormalsRef.current
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
    const { cubelets, cubeGroup, faceNormals } = drawCube(scene);
    cubeletsRef.current = cubelets;
    cubeRef.current = cubeGroup;
    faceNormalsRef.current = faceNormals;
    if (faceNormalsRef.current && cubeRef.current) {
      primaryNormalsRef.current = findPrimaryNormals(
        faceNormalsRef.current,
        cubeRef.current,
        primaryNormalsRef.current
      );
    }

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
    <div ref={sceneContainerRef} className="relative w-full h-screen">
      <Controls
        cubeletsRef={cubeletsRef}
        cubeRef={cubeRef}
        faceNormalsRef={faceNormalsRef}
        primaryNormalsRef={primaryNormalsRef}
        temporaryFaceGroupRef={temporaryFaceGroupRef}
        temporaryFaceVelocityRef={temporaryFaceVelocityRef}
        temporaryFaceRotationAxisRef={temporaryFaceRotationAxisRef}
      />
    </div>
  );
}
