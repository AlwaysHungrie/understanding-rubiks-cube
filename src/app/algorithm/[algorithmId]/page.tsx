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

export default function Algorithm({
  params,
}: {
  params: Promise<{ algorithmId: string }>;
}) {
  const router = useRouter();
  const { algorithmId } = use(params);

  const { setCurrentSectionIndex } = useProgress();
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

  const [extraMoves, setExtraMoves] = useState<FaceMove[]>([]);
  const [algorithm, setAlgorithm] = useState<string>("");
  const [algorithmContent, setAlgorithmContent] =
    useState<AlgorithmContent | null>(null);

  const content = algorithmContent?.content || [];
  const nextStep = algorithmContent?.nextStep || null;
  const labels = algorithmContent?.labels || {};

  const drawCube = useCallback(async () => {
    const fontLoader = new FontLoader();
    const font = await fontLoader.loadAsync("/Oswald_Regular.json");

    initCube(ALL_CUBE_COORDINATES, undefined, font, labels);
  }, [initCube, labels]);

  useLayoutEffect(() => {
    if (!algorithmContent) return;
    if (!sceneContainerRef.current) return;

    const renderer = initScene(sceneContainerRef, window);
    if (!renderer) return;

    initFloor();
    drawCube();
  }, [initScene, initFloor, drawCube, algorithmContent]);

  useEffect(() => {
    if (!Object.keys(ALGORITHM_CONTENT).includes(algorithmId)) {
      router.push("/");
      return;
    }

    const key = algorithmId as keyof typeof ALGORITHM_CONTENT;
    const content = ALGORITHM_CONTENT[key];
    setAlgorithmContent(content);
  }, [algorithmId]);

  return (
    <>
      <div ref={sceneContainerRef} className="relative w-full h-screen"></div>
      {currentStep !== 1 && <Controls />}
      <MessageActions
        message={content[currentStep]?.main || ""}
        pointers={content[currentStep]?.pointers}
        className="ml-auto absolute top-4 right-4"
        actions={
          <>
            {content[currentStep]?.secondaryActionLabel && (
              <PrimaryButton
                className="gap-2"
                onClick={() => {
                  if (currentStep === 0) {
                    drawCube();
                    setCurrentStep(0);
                  } else if (currentStep === 1) {
                    moveFace("top", 0, 1, true);
                    setExtraMoves((prevMoves) => [
                      ...prevMoves,
                      {
                        face: "top",
                        level: 0,
                        direction: 1,
                        rotation: { x: 0, y: 0 },
                      },
                    ]);
                    removeHighlights();
                  } else if (currentStep === 2) {
                    drawCube();
                    setAlgorithm("");
                    setExtraMoves([]);
                    setCurrentStep(0);
                  }
                }}
              >
                {content[currentStep]?.secondaryActionLabel}
              </PrimaryButton>
            )}
            {content[currentStep]?.nextActionLabel && (
              <PrimaryButton
                className="gap-2"
                onClick={async () => {
                  if (currentStep === 0) {
                    setCurrentStep(currentStep + 1);
                    rotateCube(INITIAL_CUBE_ROTATION);
                  } else if (currentStep === 1) {
                    setAlgorithm(JSON.stringify(moves));
                    await reverseMoves(moves);
                    await reverseMoves(extraMoves);
                    rotateCube(INITIAL_CUBE_ROTATION);
                    setCurrentStep(currentStep + 1);
                    removeHighlights();
                  } else if (currentStep === 2) {
                    router.push("/");
                    if (nextStep) {
                      setCurrentSectionIndex(nextStep);
                      localStorage.setItem(algorithmId, algorithm);
                    }
                  }
                }}
              >
                {content[currentStep].nextActionLabel}
              </PrimaryButton>
            )}
          </>
        }
      />
    </>
  );
}
