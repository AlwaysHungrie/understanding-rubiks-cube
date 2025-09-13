"use client";

import { FACE_DIRECTIONS, FACE_LEVELS, FACE_TYPES } from "@/lib/constants";

export default function Controls({
  hightlightFace,
  removeHighlights,
  handleClick,
}: {
  hightlightFace: (
    faceType: (typeof FACE_TYPES)[number],
    faceLevel: (typeof FACE_LEVELS)[number]
  ) => void;
  removeHighlights: () => void;
  handleClick: (
    faceType: (typeof FACE_TYPES)[number],
    faceLevel: (typeof FACE_LEVELS)[number],
    direction: (typeof FACE_DIRECTIONS)[number]
  ) => void;
}) {
  return (
    <div className="absolute top-4 left-4 grid grid-cols-3 gap-2 z-10">
      {FACE_TYPES.map((faceType, i) =>
        FACE_LEVELS.map((faceLevel, j) => {
          // Calculate background position for each sprite
          // Each sprite is 256x256, with 40px spacing
          // So each sprite starts at: col * (256 + 40) = col * 296
          // Scale down to fit 60px button: 60/256
          const scale = 60 / 256;
          const backgroundX = j * 296 * scale;
          const backgroundY = i * 296 * scale;

          return (
            <button
              key={`sprite-${i}-${j}`}
              className="w-20 h-20 bg-white rounded-md border-2 flex items-center justify-center border-gray-300 hover:border-gray-500 transition-colors overflow-hidden"
              onClick={() => {
                handleClick(faceType, faceLevel, 1);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                handleClick(faceType, faceLevel, -1);
              }}
              onMouseEnter={() => hightlightFace(faceType, faceLevel)}
              onMouseLeave={removeHighlights}
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
