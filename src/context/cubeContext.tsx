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
  removeHighlights as removeHighlightsHelper,
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
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { Font } from "three/addons/loaders/FontLoader.js";

const CubeContext = createContext<{
  cube: THREE.Group | null;
  initScene: (
    sceneContainerRef: React.RefObject<HTMLDivElement | null>,
    window: Window
  ) => THREE.WebGLRenderer | undefined;
  initFloor: (allowShuffle?: boolean) => void;
  initCube: (
    visibleCoordinates: Set<string>,
    visibleModifiers?: Record<string, number>,
    font?: Font,
    labels?: Record<
      string,
      { text: string; position: THREE.Vector3; rotation: THREE.Vector3 }
    >
  ) => void;
  cubelets: THREE.Mesh[] | null;
  faceGroup: THREE.Group | null;
  primaryNormals: { front: string; top: string; left: string };
  moveFace: (
    faceType: (typeof FACE_TYPES)[number],
    faceLevel: (typeof FACE_LEVELS)[number],
    direction: (typeof FACE_DIRECTIONS)[number],
    skipSaveMove?: boolean
  ) => Promise<void>;
  removeHighlights: () => void;
  hightlightFace: (
    faceType: (typeof FACE_TYPES)[number],
    faceLevel: (typeof FACE_LEVELS)[number]
  ) => void;
  reverseMoves: (moves: FaceMove[]) => Promise<void>;
  rotateCube: (rotation: { x: number; y: number }) => Promise<void>;
  moves: FaceMove[];
  shuffleCube: (moves: number) => Promise<void>;
}>({
  cube: null,
  initScene: () => undefined,
  initFloor: () => {},
  initCube: () => {},
  cubelets: null,
  faceGroup: null,
  primaryNormals: { front: "", top: "", left: "" },
  moveFace: () => Promise.resolve(),
  removeHighlights: () => {},
  hightlightFace: () => {},
  reverseMoves: () => Promise.resolve(),
  rotateCube: () => Promise.resolve(),
  moves: [],
  shuffleCube: () => Promise.resolve(),
});

export default function CubeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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
  const previousClickPositionRef = useRef({ x: 0, y: 0 });

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

    // Handle cube orientation reset
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
            cube
          );
        }
        if (onRotationCompleteCallbackRef.current) {
          onRotationCompleteCallbackRef.current();
        }
      }
      cubeVelocityRef.current = finalVelocity;
    }

    // Handle face rotation
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
  const handleMouseDown = useCallback((event: MouseEvent | TouchEvent) => {
    const clientX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY =
      event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    isDraggingRef.current = true;
    previousMousePositionRef.current = {
      x: clientX,
      y: clientY,
    };
    previousClickPositionRef.current = {
      x: clientX,
      y: clientY,
    };
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDraggingRef.current || !cubeRef.current) return;

    const clientX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY =
      event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    const deltaX = clientX - previousMousePositionRef.current.x;
    const deltaY = clientY - previousMousePositionRef.current.y;

    const cube = cubeRef.current;

    // if cube is flipped (rotated ~180° around X-axis), invert deltaX for intuitive control
    // const normalizedXRotation =
    //   ((cube.rotation.x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    // if (
    //   normalizedXRotation > Math.PI / 2 &&
    //   normalizedXRotation < (3 * Math.PI) / 2
    // ) {
    //   deltaX = -deltaX;
    // }
    cube.rotation.y += deltaX * 0.01;
    cube.rotation.x += deltaY * 0.01;

    // cube.rotation.x = Math.max(
    //   Math.min(cube.rotation.x + deltaY * 0.01, maximumYRotation),
    //   -maximumYRotation
    // );

    previousMousePositionRef.current = {
      x: clientX,
      y: clientY,
    };
  }, []);

  const handleMouseUp = useCallback((event: MouseEvent | TouchEvent) => {
    if (!faceNormalsRef.current || !cubeRef.current) return;

    const clientX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY =
      event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    const previousClientX = previousClickPositionRef.current.x;
    const previousClientY = previousClickPositionRef.current.y;

    const moveDistance =
      Math.abs(clientX - previousClientX) + Math.abs(clientY - previousClientY);

    // Check for 3D object clicks using raycasting
    if (sceneRef.current && cameraRef.current && rendererRef.current) {
      if (moveDistance < 1) {
        checkObjectClick(
          event,
          sceneRef.current,
          cameraRef.current,
          rendererRef.current,
          SCENE_CLICKABLE_TYPES
        );
      }
    }

    isDraggingRef.current = false;

    if (faceNormalsRef.current && cubeRef.current) {
      primaryNormalsRef.current = findPrimaryNormals(
        faceNormalsRef.current,
        cubeRef.current
      );
    }
  }, []);

  const rotateCube = useCallback(async (rotation: { x: number; y: number }) => {
    if (cubeletsRef.current) {
      removeHighlightsHelper(cubeletsRef.current);
    }
    cubeRotationTargetRef.current = rotation;
    cubeVelocityRef.current = { x: 0, y: 0 };

    await new Promise((resolve) => {
      onRotationCompleteCallbackRef.current = () => resolve(true);
    });
  }, []);

  const initScene = useCallback(
    (
      sceneContainerRef: React.RefObject<HTMLDivElement | null>,
      window: Window
    ) => {
      if (!sceneContainerRef.current) return;
      const { scene, camera, renderer } = setupScene(window);
      renderer.setAnimationLoop(animate);

      // remove all canvas elements from sceneContainerRef.current
      while (sceneContainerRef.current.firstChild) {
        sceneContainerRef.current.removeChild(
          sceneContainerRef.current.firstChild
        );
      }
      sceneContainerRef.current.appendChild(renderer.domElement);
      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;

      const canvas = renderer.domElement;
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);

      // touch handlers
      canvas.addEventListener("touchstart", handleMouseDown);
      canvas.addEventListener("touchmove", handleMouseMove);
      canvas.addEventListener("touchend", handleMouseUp);

      return renderer;
    },
    [animate, handleMouseDown, handleMouseMove, handleMouseUp]
  );

  // Helper function to dispose of any Three.js object and its children
  const disposeObject = useCallback((object: THREE.Object3D) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            if (material instanceof THREE.Material) {
              material.dispose();
            }
          });
        } else if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
    });
  }, []);

  const initCube = useCallback(
    (
      visibleCoordinates: Set<string>,
      visibleModifiers?: Record<string, number>,
      font?: Font,
      labels?: Record<
        string,
        { text: string; position: THREE.Vector3; rotation: THREE.Vector3 }
      >
    ) => {
      const scene = sceneRef.current;
      if (!scene) return;

      // Clean up existing cube and its resources
      if (cubeRef.current) {
        disposeObject(cubeRef.current);
        scene.remove(cubeRef.current);
      }

      setMoves([]);
      const { cubelets, cubeGroup, faceNormals } = drawCube(
        scene,
        visibleCoordinates,
        visibleModifiers,
        font,
        labels
      );
      cubeletsRef.current = cubelets;
      cubeRef.current = cubeGroup;
      faceNormalsRef.current = faceNormals;
      if (faceNormalsRef.current && cubeRef.current) {
        primaryNormalsRef.current = findPrimaryNormals(
          faceNormalsRef.current,
          cubeRef.current
        );
      }
    },
    [disposeObject]
  );

  const moveFace = useCallback(
    async (
      faceType: (typeof FACE_TYPES)[number],
      faceLevel: (typeof FACE_LEVELS)[number],
      direction: (typeof FACE_DIRECTIONS)[number],
      skipSaveMove?: boolean
    ) => {
      if (cubeletsRef.current) {
        removeHighlightsHelper(cubeletsRef.current);
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

        if (!skipSaveMove) {
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
        }

        await new Promise((resolve) => {
          onMoveCompleteCallbackRef.current = () => resolve(true);
        });
      }
    },
    []
  );

  const removeHighlights = useCallback(() => {
    if (cubeletsRef.current) {
      removeHighlightsHelper(cubeletsRef.current);
    }
  }, []);

  const hightlightFace = useCallback(
    (
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
        removeHighlightsHelper(cubeletsRef.current);
      }
    },
    [moveFace, rotateCube]
  );

  const shuffleCube = useCallback(
    async (moves: number) => {
      for (let i = 0; i < moves; i++) {
        const randomFaceType =
          FACE_TYPES[Math.floor(Math.random() * FACE_TYPES.length)];
        const randomFaceLevel =
          FACE_LEVELS[Math.floor(Math.random() * FACE_LEVELS.length)];
        const randomDirection =
          FACE_DIRECTIONS[Math.floor(Math.random() * FACE_DIRECTIONS.length)];
        await moveFace(randomFaceType, randomFaceLevel, randomDirection, true);
      }
    },
    [moveFace]
  );

  const initFloor = useCallback(
    (allowShuffle?: boolean) => {
      if (!sceneRef.current) return;
      drawFloor(
        sceneRef.current,
        () => rotateCube(INITIAL_CUBE_ROTATION),
        allowShuffle ? () => shuffleCube(20) : undefined
      );
    },
    [rotateCube, shuffleCube]
  );

  // Cleanup function for Three.js resources
  const cleanupThreeJS = useCallback(() => {
    // Stop animation loop
    if (rendererRef.current) {
      rendererRef.current.setAnimationLoop(null);
    }

    // Remove event listeners
    if (rendererRef.current) {
      const canvas = rendererRef.current.domElement;
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleMouseDown);
      canvas.removeEventListener("touchmove", handleMouseMove);
      canvas.removeEventListener("touchend", handleMouseUp);
    }

    // Dispose of cube and all its children
    if (cubeRef.current) {
      disposeObject(cubeRef.current);
      if (sceneRef.current) {
        sceneRef.current.remove(cubeRef.current);
      }
    }

    // Clear scene (this removes all remaining objects)
    if (sceneRef.current) {
      sceneRef.current.clear();
    }

    // Dispose of renderer
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }

    // Clear refs
    cubeRef.current = null;
    cubeletsRef.current = null;
    faceNormalsRef.current = null;
    sceneRef.current = null;
    cameraRef.current = null;
    rendererRef.current = null;
  }, [handleMouseDown, handleMouseMove, handleMouseUp, disposeObject]);

  useEffect(() => {
    return cleanupThreeJS;
  }, [cleanupThreeJS]);

  return (
    <CubeContext.Provider
      value={{
        cube: cubeRef.current,
        initScene,
        initFloor,
        initCube,
        cubelets: cubeletsRef.current,
        faceGroup: faceGroupRef.current,
        primaryNormals: primaryNormalsRef.current,
        moveFace,
        removeHighlights,
        hightlightFace,
        reverseMoves,
        rotateCube,
        moves,
        shuffleCube,
      }}
    >
      {children}
    </CubeContext.Provider>
  );
}

export const useCube = () => {
  return useContext(CubeContext);
};
