"use client";

import { useCube } from "@/context/cubeContext";
import { useProgress } from "@/context/progressContext";
import { FaceMove, INITIAL_CUBE_ROTATION } from "@/lib/constants";
import { ALGORITHM_CONTENT, AlgorithmContent } from "@/lib/content";
import { useRouter } from "next/navigation";
import {
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import * as THREE from "three";
import { ALL_CUBE_COORDINATES } from "@/lib/scene/cube";
import Controls from "@/components/Controls";
import { MessageActions } from "@/components/common/messageActions";
import { PrimaryButton } from "@/components/common/primaryButton";

export default function Algorithm() {
  const sceneContainerRef = useRef<HTMLDivElement>(null);
  const {
    initScene,
    initFloor,
    initCube,
    moveFace,
    removeHighlights,
    reverseMoves,
    rotateCube,
    moves,
  } = useCube();
  const [currentStep, setCurrentStep] = useState(0);

  const drawCube = useCallback(async () => {
    const fontLoader = new FontLoader();
    const font = await fontLoader.loadAsync("/Oswald_Regular.json");

    initCube(ALL_CUBE_COORDINATES);
  }, [initCube]);

  useLayoutEffect(() => {
    if (!sceneContainerRef.current) return;

    const renderer = initScene(sceneContainerRef, window);
    if (!renderer) return;

    initFloor(true);
    drawCube();
  }, [initScene, initFloor, drawCube]);

  return (
    <>
      <div ref={sceneContainerRef} className="relative w-full h-screen"></div>
      {currentStep !== 1 && <Controls />}
      <MessageActions
        message={"Use the algorithms you created"}
        pointers={[
          "Do not move the cube while an algorithm is running",
          "Try to solve layer by layer",
        ]}
        className="ml-auto absolute top-4 right-4"
        actions={
          <div className="flex gap-2 flex-col w-full">
            <PrimaryButton className="gap-2" onClick={async () => {}}>
              Show Control Panel
            </PrimaryButton>

            <div className="flex gap-2">
              <PrimaryButton className="gap-2" onClick={async () => {}}>
                Move Edges
              </PrimaryButton>

              <PrimaryButton className="gap-2" onClick={async () => {}}>
                Flip Edges
              </PrimaryButton>
            </div>

            <div className="flex gap-2">
              <PrimaryButton className="gap-2" onClick={async () => {}}>
                Move Corners
              </PrimaryButton>

              <PrimaryButton className="gap-2" onClick={async () => {}}>
                Flip Corners
              </PrimaryButton>
            </div>
          </div>
        }
      />
    </>
  );
}
