import { LockIcon, CheckIcon, ArrowRightIcon, Circle } from "lucide-react";
import Link from "next/link";

export type SectionInfo = {
  label: string;
  backgroundImageUrl: string;
  backgroundColor: string;
};

export const SectionCard = ({
  number,
  sectionInfo,
  isLocked,
  isCurrent,
}: {
  number: number;
  sectionInfo: SectionInfo;
  isLocked: boolean;
  isCurrent: boolean;
}) => {
  const { label, backgroundImageUrl, backgroundColor } = sectionInfo;
  return (
    <Link
      className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
        isLocked ? "shadow-lg" : "shadow-xl hover:shadow-2xl"
      }`}
      style={{
        backgroundColor: isLocked ? "#444444" : backgroundColor,
      }}
      href={`/section/${number}`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 group-hover:scale-110"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          filter: isLocked ? "brightness(0.7) grayscale(80%)" : "brightness(1)",
          opacity: isLocked ? 0.4 : 1,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 h-64 flex flex-col justify-between">
        {/* Header with number and label */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-white/80 text-sm font-semibold mb-1">
              Step {number + 1}
            </div>
            <h3 className="font-oswald font-bold text-3xl text-white drop-shadow-2xl">
              {label}
            </h3>
          </div>

          {/* Status Icon */}
          {isCurrent ? (
            <div className="p-3 border border-white/30 rounded-full">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
            </div>
          ) : !isLocked ? (
            <div className="p-3 rounded-full backdrop-blur-sm transition-all duration-300 bg-white/20 border border-white/30 group-hover:bg-white/30">
              <CheckIcon className="w-6 h-6 text-white" />
            </div>
          ) : null}
        </div>

        {/* Bottom section with centered action text */}
        <div className="flex items-center justify-center">
          {isLocked ? (
            <div className="flex items-center gap-2 text-white/70">
              <LockIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Locked</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors duration-300">
              <span className="text-sm font-medium">Start</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
