import { FaceMove } from "@/lib/constants";

export const MoveList = ({
  moves,
  resetCube,
  reverseMoves,
}: {
  moves: FaceMove[];
  resetCube: () => void;
  reverseMoves: () => void;
}) => {
  const formatMove = (move: FaceMove) => {
    const directionSymbol = move.direction === 1 ? "C.W." : "A.C.W.";

    let levelText = "";
    if (move.level === 0) {
      levelText = "1st";
    } else if (move.level === 1) {
      levelText = "2nd";
    } else if (move.level === 2) {
      levelText = "3rd";
    }

    return `${levelText} face from ${move.face.toLocaleUpperCase()} ${directionSymbol}`;
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <div className="w-72 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">Move History</h3>
          <p className="text-xs text-gray-500">{moves.length} moves</p>
        </div>
        <div className="max-h-[160px] overflow-y-auto">
          {moves.length === 0 ? (
            <div className="p-3 text-center text-gray-400 text-sm">
              No moves yet
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {moves.map((move, i) => (
                <div
                  className="px-3 py-2 hover:bg-gray-50 transition-colors duration-150"
                  key={`move-${i}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">#{i + 1}</span>

                    <span className="text-sm font-mono text-gray-700">
                      {formatMove(move)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="flex-1 bg-blue-500 text-white p-2 font-sm rounded-md"
          onClick={resetCube}
        >
          Reset Cube
        </button>
        <button 
          className="flex-1 bg-blue-500 text-white p-2 font-sm rounded-md"
          onClick={reverseMoves}
        >
          Reverse Moves
        </button>
      </div>
    </div>
  );
};
