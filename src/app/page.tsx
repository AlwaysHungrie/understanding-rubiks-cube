"use client";

import {
  FACE_DIRECTIONS,
  FACE_LEVELS,
  FACE_TYPES,
  FaceMove,
  INITIAL_CUBE_ROTATION,
  SCENE_CLICKABLE_TYPES,
} from "@/lib/constants";
import {
  drawCube,
  findFace,
  removeHighlights,
  rotateFace,
} from "@/lib/scene/cube";
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
import { MoveList } from "@/components/MoveList";

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
  const cubeRotationTargetRef = useRef<{ x: number; y: number } | null>(null);
  const cubeVelocityRef = useRef({ x: 0, y: 0 });

  // for moving faces, velocity refers to angular velocity
  const faceGroupRef = useRef<THREE.Group | null>(null);
  const faceVelocityRef = useRef(0);
  const faceRotationAxisRef = useRef<THREE.Vector3 | null>(null);

  const primaryNormalsRef = useRef<{
    front: string;
    top: string;
    left: string;
  }>({ front: "", top: "", left: "" });

  const onRotationCompleteCallbackRef = useRef<(() => void) | null>(null);
  const onMoveCompleteCallbackRef = useRef<(() => void) | null>(null);

  const [moves, setMoves] = useState<FaceMove[]>([]);

  const animate = useCallback(() => {
    if (!rendererRef.current) return;
    if (!sceneRef.current) return;
    if (!cameraRef.current) return;

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;

    const cube = cubeRef.current;
    if (cubeRotationTargetRef.current && cube) {
      const finalVelocity = rotateObjectToTarget(
        cube,
        cubeRotationTargetRef.current,
        cubeVelocityRef.current
      );

      if (finalVelocity.x === 0 && finalVelocity.y === 0) {
        cubeRotationTargetRef.current = null;
        if (faceNormalsRef.current) {
          primaryNormalsRef.current = findPrimaryNormals(
            faceNormalsRef.current,
            cube,
            primaryNormalsRef.current
          );
        }
        if (onRotationCompleteCallbackRef.current) {
          onRotationCompleteCallbackRef.current();
        }
      }
      cubeVelocityRef.current = finalVelocity;
    }

    if (faceGroupRef.current && faceRotationAxisRef.current) {
      const finalVelocity = rotateObjectOnAxisTillTarget(
        faceGroupRef.current,
        Math.PI / 2,
        faceVelocityRef.current,
        faceRotationAxisRef.current
      );

      if (finalVelocity === 0) {
        // clean up temporary face, add cublets back to main group
        const cublets = faceGroupRef.current?.children;
        if (cublets) {
          // Apply the temporary group's local transformation to each cublet
          const tempGroup = faceGroupRef.current;
          tempGroup.updateMatrix();

          cublets.forEach((cublet) => {
            cublet.applyMatrix4(tempGroup.matrix);
          });

          cubeRef.current?.remove(faceGroupRef.current);
          cubeRef.current?.add(...cublets);
        }

        // reset velocity and axis
        faceVelocityRef.current = 0;
        faceRotationAxisRef.current = null;
        faceGroupRef.current = null;

        if (onMoveCompleteCallbackRef.current) {
          onMoveCompleteCallbackRef.current();
        }
      }
    }

    renderer.render(scene, camera);
  }, [sceneRef, cameraRef, rendererRef]);

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

  const initCube = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;
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
  }, []);

  const rotateCube = useCallback(async (rotation: { x: number; y: number }) => {
    if (cubeletsRef.current) {
      removeHighlights(cubeletsRef.current);
    }
    cubeRotationTargetRef.current = rotation;
    cubeVelocityRef.current = { x: 0, y: 0 };

    await new Promise((resolve) => {
      onRotationCompleteCallbackRef.current = () => resolve(true);
    });
  }, []);

  const initScene = useCallback(() => {
    if (!sceneContainerRef.current) return;
    const { scene, camera, renderer } = setupScene(window);
    renderer.setAnimationLoop(animate);
    sceneContainerRef.current.appendChild(renderer.domElement);
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    drawFloor(scene, () => rotateCube(INITIAL_CUBE_ROTATION));
    initCube();
    return renderer;
  }, [
    animate,
    rotateCube,
    initCube,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  ]);

  const resetCube = useCallback(() => {
    const scene = sceneRef.current;
    const cube = cubeRef.current;
    if (!scene || !cube) return;
    // destroy cube
    scene.remove(cube);

    // reset all refs
    cubeRef.current = null;
    cubeletsRef.current = null;
    faceNormalsRef.current = null;
    isDraggingRef.current = false;
    previousMousePositionRef.current = { x: 0, y: 0 };
    cubeRotationTargetRef.current = null;
    cubeVelocityRef.current = { x: 0, y: 0 };

    faceGroupRef.current = null;
    faceVelocityRef.current = 0;
    faceRotationAxisRef.current = null;
    primaryNormalsRef.current = { front: "", top: "", left: "" };

    onRotationCompleteCallbackRef.current = null;
    onMoveCompleteCallbackRef.current = null;

    // init scene
    initCube();

    // reset moves
    setMoves([]);
  }, [initCube]);

  const moveFace = useCallback(
    async (
      faceType: (typeof FACE_TYPES)[number],
      faceLevel: (typeof FACE_LEVELS)[number],
      direction: (typeof FACE_DIRECTIONS)[number]
    ) => {
      if (cubeletsRef.current) {
        removeHighlights(cubeletsRef.current);
      }
      if (faceGroupRef.current) return;
      if (cubeletsRef.current && cubeRef.current) {
        const rotationResult = rotateFace(
          cubeletsRef.current,
          primaryNormalsRef.current[faceType],
          cubeRef.current,
          faceLevel
        );
        if (!rotationResult) return;

        const currentCubeRotation = {
          x: cubeRef.current.rotation.x,
          y: cubeRef.current.rotation.y,
        };

        const { tempGroup, axis } = rotationResult;

        faceVelocityRef.current = 0;
        axis.multiplyScalar(direction);
        faceRotationAxisRef.current = axis;
        faceGroupRef.current = tempGroup;

        setMoves((prevMoves) => {
          if (prevMoves.length === 0)
            return [
              {
                face: faceType,
                level: faceLevel,
                direction,
                rotation: currentCubeRotation,
              },
            ];

          const lastMove = prevMoves[prevMoves.length - 1];

          if (
            lastMove.face === faceType &&
            lastMove.level === faceLevel &&
            lastMove.direction === -1 * direction
          ) {
            return prevMoves.slice(0, -1);
          }
          return [
            ...prevMoves,
            {
              face: faceType,
              level: faceLevel,
              direction,
              rotation: currentCubeRotation,
            },
          ];
        });

        await new Promise((resolve) => {
          onMoveCompleteCallbackRef.current = () => resolve(true);
        });
      }
    },
    []
  );

  const reverseMoves = useCallback(
    async (moves: FaceMove[]) => {
      const movesCopy = [...moves].reverse();
      for (const move of movesCopy) {
        const direction = move.direction === 1 ? -1 : 1;
        await rotateCube(move.rotation);
        await moveFace(move.face, move.level, direction);
      }
      if (cubeletsRef.current) {
        removeHighlights(cubeletsRef.current);
      }
    },
    [moveFace]
  );

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
        removeHighlights={() => {
          if (cubeletsRef.current) {
            removeHighlights(cubeletsRef.current);
          }
        }}
        hightlightFace={(
          faceType: (typeof FACE_TYPES)[number],
          faceLevel: (typeof FACE_LEVELS)[number]
        ) => {
          if (faceGroupRef.current) return;
          if (cubeletsRef.current && cubeRef.current) {
            findFace(
              cubeletsRef.current,
              primaryNormalsRef.current[faceType],
              cubeRef.current,
              faceLevel
            );
          }
        }}
        handleClick={moveFace}
      />
      <MoveList
        moves={moves}
        resetCube={resetCube}
        reverseMoves={() => reverseMoves(moves)}
      />
    </div>
  );
}
