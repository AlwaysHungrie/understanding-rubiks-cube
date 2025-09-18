"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCube } from "@/context/cubeContext";
import {
  ALL_CUBE_COORDINATES,
  CENTER_PIECE_COORDINATES,
} from "@/lib/scene/cube";
import Controls from "@/components/Controls";
import { MessageActions } from "@/components/common/messageActions";
import { PrimaryButton } from "@/components/common/primaryButton";
import { useRouter } from "next/navigation";
import { useProgress } from "@/context/progressContext";

const content = [
  {
    main: "Drag to inspect the Rubik's cube",
    pointers: [
      "Only three faces are visible at a time.",
      "Control panel can rotate any visible face.",
      "Each piece can only have 1, 2 or 3 colored faces.",
    ],
    nextActionLabel: "Got it",
  },
  {
    main: "Consider ONLY the Center pieces",
    pointers: [
      "They always remain in the center.",
      "If a Center piece is moved, just rotate the entire cube back to its position.",
      "It is safe to assume Center pieces are fixed, we only need to place remaining pieces around them.",
    ],
    previousActionLabel: "Go back",
    nextActionLabel: "I understand",
  },
  {
    main: "Consider the Edge pieces",
    pointers: [
      "An Edge piece has 2 colored faces.",
      "It need to be placed in the right position w.r.t. their center pieces.",
      "An Edge piece can also be in correct position but flipped.",
    ],
    previousActionLabel: "Go back",
    nextActionLabel: "Okay",
  },
  {
    main: "Consider the Corner pieces",
    pointers: [
      "A Corner piece has 3 colored faces.",
      "Again, it can be in correct position but flipped.",
      "This piece however can have 3 different orientations, only one of which is correct.",
    ],
    previousActionLabel: "Go back",
    nextActionLabel: "Finish Chapter",
  },
];

export default function Home() {
  const router = useRouter();
  const { setCurrentSectionIndex } = useProgress();
  const sceneContainerRef = useRef<HTMLDivElement>(null);
  const { initScene, initFloor, initCube } = useCube();
  const [currentStep, setCurrentStep] = useState(0);

  const [visibleCoordinates, setVisibleCoordinates] =
    useState<Set<string>>(ALL_CUBE_COORDINATES);
  const [visibleModifiers, setVisibleModifiers] = useState<
    Record<string, number>
  >({});

  useLayoutEffect(() => {
    if (!sceneContainerRef.current) return;

    const renderer = initScene(sceneContainerRef, window);
    if (!renderer) return;

    initFloor();
    initCube(visibleCoordinates);
  }, [initScene, initFloor, initCube]);

  useEffect(() => {
    initCube(visibleCoordinates, visibleModifiers);
  }, [visibleCoordinates, initCube]);

  useEffect(() => {
    if (currentStep === 0) {
      setVisibleCoordinates(ALL_CUBE_COORDINATES);
      setVisibleModifiers({});
    } else if (currentStep === 1) {
      setVisibleCoordinates(CENTER_PIECE_COORDINATES);
      setVisibleModifiers({});
    } else if (currentStep === 2) {
      const edgeStepPieces = new Set<string>();
      edgeStepPieces.add("0,0,1");
      edgeStepPieces.add("0,1,0");
      edgeStepPieces.add("-1,0,0");

      edgeStepPieces.add("-1,1,0");
      edgeStepPieces.add("0,1,1");

      setVisibleCoordinates(edgeStepPieces);
      setVisibleModifiers({"0,1,1": 1})
    } else if (currentStep === 3) {
      const edgeStepPieces = new Set<string>();
      edgeStepPieces.add("0,0,1");
      edgeStepPieces.add("0,1,0");
      edgeStepPieces.add("-1,0,0");
      edgeStepPieces.add("0,0,-1");
      edgeStepPieces.add("0,-1,0");
      edgeStepPieces.add("1,0,0");

      edgeStepPieces.add("-1,1,1");
      edgeStepPieces.add("-1,-1,1");

      edgeStepPieces.add("1,1,1");
      edgeStepPieces.add("-1,-1,-1");
      edgeStepPieces.add("1,-1,-1");
      edgeStepPieces.add("1,-1,1");
      edgeStepPieces.add("1,1,-1");
      edgeStepPieces.add("-1,1,-1");

      setVisibleCoordinates(edgeStepPieces);
      setVisibleModifiers({"-1,1,1": 2})
    }
  }, [currentStep]);

  return (
    <>
      <div ref={sceneContainerRef} className="relative w-full h-screen"></div>
      <Controls />
      <MessageActions
        message={content[currentStep].main}
        pointers={content[currentStep].pointers}
        className="ml-auto absolute top-4 right-4"
        actions={
          <>
            {content[currentStep].previousActionLabel && (
              <PrimaryButton
                className="gap-2"
                onClick={() => {
                  setCurrentStep(currentStep - 1);
                }}
              >
                {content[currentStep].previousActionLabel}
              </PrimaryButton>
            )}
            <PrimaryButton
              className="gap-2"
              onClick={() => {
                if (currentStep === 3) {
                  setCurrentSectionIndex(2);
                  router.push("/");
                  return;
                }
                setCurrentStep(currentStep + 1);
              }}
            >
              {content[currentStep].nextActionLabel}
            </PrimaryButton>
          </>
        }
      />
    </>
  );
}
