"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCube } from "@/context/cubeContext";
import { ALL_CUBE_COORDINATES, CENTER_PIECE_COORDINATES } from "@/lib/scene/cube";

export default function Home() {
  const sceneContainerRef = useRef<HTMLDivElement>(null);
  const { initScene, initFloor, initCube } = useCube();

  const [visibleCoordinates, setVisibleCoordinates] = useState<Set<string>>(ALL_CUBE_COORDINATES);

  useLayoutEffect(() => {
    if (!sceneContainerRef.current) return;

    const renderer = initScene(sceneContainerRef, window);
    if (!renderer) return;

    initFloor();
    initCube(visibleCoordinates);
  }, [initScene, initFloor, initCube]);

  // useEffect(() => {
  //   setVisibleCoordinates(CENTER_PIECE_COORDINATES);
  // }, []);

  useEffect(() => {
    initCube(visibleCoordinates);
  }, [visibleCoordinates, initCube]);

  return (
    <div ref={sceneContainerRef} className="relative w-full h-screen"></div>
  );
}
