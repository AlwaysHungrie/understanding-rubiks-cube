"use client";

import { findFace, removeHighlights, rotateFace } from "@/lib/scene/cube";
import { RefObject } from "react";
import * as THREE from "three";

interface ControlsProps {
  cubeletsRef: RefObject<THREE.Mesh[] | null>;
  cubeRef: RefObject<THREE.Group | null>;
  faceNormalsRef: RefObject<{ key: string; normal: THREE.Group }[] | null>;
  primaryNormalsRef: RefObject<{
    front: string;
    top: string;
    left: string;
  }>;
  temporaryFaceGroupRef: RefObject<THREE.Group | null>;
  temporaryFaceVelocityRef: RefObject<number>;
  temporaryFaceRotationAxisRef: RefObject<THREE.Vector3 | null>;
}

export default function Controls({
  cubeletsRef,
  cubeRef,
  faceNormalsRef,
  primaryNormalsRef,
  temporaryFaceGroupRef,
  temporaryFaceVelocityRef,
  temporaryFaceRotationAxisRef,
}: ControlsProps) {
  const handleClick = (face: "front" | "top" | "left", col: 0 | 1 | 2) => {
    if (cubeletsRef.current) {
      removeHighlights(cubeletsRef.current);
    }
    if (temporaryFaceGroupRef.current) return;
    if (cubeletsRef.current && cubeRef.current) {
      const rotationResult = rotateFace(
        cubeletsRef.current,
        primaryNormalsRef.current[face],
        cubeRef.current,
        col
      );
      if (!rotationResult) return;
      const { tempGroup, axis } = rotationResult;
      temporaryFaceVelocityRef.current = 0.01;
      temporaryFaceRotationAxisRef.current = axis;
      temporaryFaceGroupRef.current = tempGroup;
    }
  };
  return (
    <div className="absolute top-4 left-4 grid grid-cols-3 gap-2 z-10">
      {(["front", "top", "left"] as ("front" | "top" | "left")[]).map(
        (face, faceIndex) =>
          ([0, 1, 2] as (0 | 1 | 2)[]).map((col) => {
            // Calculate background position for each sprite
            // Each sprite is 256x256, with 40px spacing
            // So each sprite starts at: col * (256 + 40) = col * 296
            // Scale down to fit 60px button: 60/256
            const scale = 60 / 256;
            const backgroundX = col * 296 * scale;
            const backgroundY = faceIndex * 296 * scale;

            return (
              <button
                key={`sprite-${faceIndex}-${col}`}
                className="w-20 h-20 bg-white rounded-md border-2 flex items-center justify-center border-gray-300 hover:border-gray-500 transition-colors overflow-hidden"
                onClick={() => {
                  handleClick(face, col);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleClick(face, col);
                }}
                onMouseEnter={() => {
                  if (temporaryFaceGroupRef.current) return;
                  if (cubeletsRef.current && cubeRef.current) {
                    findFace(
                      cubeletsRef.current,
                      primaryNormalsRef.current[face],
                      cubeRef.current,
                      col
                    );
                  }
                }}
                onMouseLeave={() => {
                  if (cubeletsRef.current) {
                    removeHighlights(cubeletsRef.current);
                  }
                }}
              >
                <div
                  style={{
                    backgroundImage: "url(/buttons.svg)",
                    backgroundSize: `${848 * scale}px ${848 * scale}px`,
                    backgroundPosition: `-${backgroundX}px -${backgroundY}px`,
                    backgroundRepeat: "no-repeat",
                  }}
                  className="w-[60px] h-[60px]"
                />
              </button>
            );
          })
      )}
    </div>
  );
}
