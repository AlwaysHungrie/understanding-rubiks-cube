import { LockIcon, CheckIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export type SectionInfo = {
  label: string;
  description: string;
  backgroundImageUrl: string;
  backgroundColor: string;
  link: string;
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
  const { label, backgroundImageUrl, backgroundColor, link, description } =
    sectionInfo;
  return (
    <Link
      className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
        isLocked
          ? "shadow-lg pointer-events-none"
          : "shadow-xl hover:shadow-2xl"
      }`}
      style={{
        backgroundColor: isLocked ? "#444444" : backgroundColor,
      }}
      href={link}
    >
      {/* Background Image */}
      <Image
        src={backgroundImageUrl}
        alt={label}
        fill
        className={`object-cover transition-all duration-500 group-hover:scale-110 ${
          isLocked
            ? "brightness-[0.7] grayscale-[80%] opacity-40"
            : "brightness-100 opacity-100"
        }`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 h-56 md:h-64 flex flex-col justify-between">
        {/* Header with number and label */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-white/80 text-sm font-semibold mb-1">
              Step {number + 1}
            </div>
            <h3 className="font-oswald font-bold text-2xl md:text-3xl text-white drop-shadow-2xl">
              {label}
            </h3>
            <p className="text-white/80 font-medium mb-2 text-sm md:text-base">
              {description}
            </p>
          </div>

          {/* Status Icon */}
          {isCurrent ? (
            <div className="p-2 md:p-3 border-2 border-white/30 rounded-full">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-green-600 rounded-full" />
            </div>
          ) : !isLocked ? (
            <div className="p-2 md:p-3 rounded-full backdrop-blur-sm transition-all duration-300 bg-white/20 border border-white/30 group-hover:bg-white/30">
              <CheckIcon className="w-3 h-3 md:w-6 md:h-6 text-white" />
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
          ) : isCurrent ? (
            <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors duration-300">
              <span className="text-sm font-medium">Start</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors duration-300">
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
