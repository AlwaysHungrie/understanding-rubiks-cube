"use client";

import { useCube } from "@/context/cubeContext";
import { FACE_LEVELS, FACE_TYPES } from "@/lib/constants";
import { ControlContainer } from "./common/controlContainer";
import {
  RotateCcw,
  RotateCw,
} from "lucide-react";

const faceLabels: Record<(typeof FACE_TYPES)[number], string> = {
  front: "Front Face",
  top: "Top Face",
  left: "Side Face",
};

export default function Controls() {
  const { removeHighlights, hightlightFace, moveFace } = useCube();

  return (
    <ControlContainer className="flex md:absolute top-4 left-4">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-extrabold text-white w-full text-center mb-2">
          CONTROL PANEL
        </div>
        {FACE_TYPES.map((faceType, i) => (
          <div key={faceType} className="flex flex-col gap-1">
            <div className="text-sm font-bold text-white capitalize w-full text-center">
              {faceLabels[faceType]}
            </div>
            <div className="flex gap-2">
              {FACE_LEVELS.map((faceLevel, j) => {
                // Calculate background position for each sprite
                // Each sprite is 256x256, with 40px spacing
                // So each sprite starts at: col * (256 + 40) = col * 296
                // Scale down to fit 60px button: 60/256
                const imageSize = 35;
                const scale = imageSize / 256;
                const backgroundX = j * 296 * scale;
                const backgroundY = i * 296 * scale;

                return (
                  <div
                    key={`sprite-${i}-${j}`}
                    onMouseEnter={() => hightlightFace(faceType, faceLevel)}
                    onMouseLeave={removeHighlights}
                    className="w-12 h-12 bg-white rounded-md flex items-center justify-center overflow-hidden hover:bg-gray-200"
                    onClick={() => {
                      if (faceType === "top") {
                        moveFace(faceType, faceLevel, -1);
                      } else {
                        moveFace(faceType, faceLevel, 1);
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (faceType === "top") {
                        moveFace(faceType, faceLevel, 1);
                      } else {
                        moveFace(faceType, faceLevel, -1);
                      }
                    }}
                  >
                    <div
                      style={{
                        backgroundImage: "url(/buttons.svg)",
                        backgroundSize: `${848 * scale}px ${848 * scale}px`,
                        backgroundPosition: `-${backgroundX}px -${backgroundY}px`,
                        backgroundRepeat: "no-repeat",
                        width: `${imageSize}px`,
                        height: `${imageSize}px`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="text-[0.6rem] font-black text-white w-full text-center mt-2 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center justify-center gap-px uppercase">
            <RotateCcw className="w-3 h-3" />
            Left Click
          </div>
          <div className="flex items-center justify-center gap-px uppercase">
            Right Click <RotateCw className="w-3 h-3" />
          </div>
        </div>
      </div>
    </ControlContainer>
  );
}
