"use client";

import { useCube } from "@/context/cubeContext";
import { useCallback, useLayoutEffect, useRef } from "react";
import { ALL_CUBE_COORDINATES } from "@/lib/scene/cube";
import Controls from "@/components/Controls";
import { MessageActions } from "@/components/common/messageActions";

export default function Algorithm() {
  const sceneContainerRef = useRef<HTMLDivElement>(null);
  const { initScene, initFloor, initCube } = useCube();

  const drawCube = useCallback(async () => {
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
      <Controls />

      <MessageActions
        message={"Solve the cube using the 4 algorithms"}
        pointers={[
          "Solve layer by layer. Top layer can be solved without any algorithms.",
          "Swap pieces to correct position, then flip them to correct orientation.",
          "Try not to rotate the cube while applying an algorithm.",
        ]}
        className="ml-auto absolute top-4 right-4"
        actions={<> </>}
      />
    </>
  );
}
