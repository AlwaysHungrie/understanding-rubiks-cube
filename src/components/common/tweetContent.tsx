import { Heart } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";

const profile = {
  pictureUrl:
    "/cube.jpg",
  name: "Rubik's Cube",
  username: "@rubikscube",
  time: "2h",
};

export const TweetContent = ({
  index,
  content,
  isLiked,
  isLast,
  toggleStatus,
}: {
  index: number;
  content: string[];
  isLiked: boolean;
  isLast: boolean;
  toggleStatus: () => void;
}) => {
  return (
    <div className="relative">
      {/* Tweet content */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-sm transition-shadow duration-200">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 border-gray-300 overflow-hidden">
              <Image
                src={profile.pictureUrl}
                alt={profile.name}
                width={40}
                height={40}
              />
            </div>
          </div>

          {/* Connecting line */}
          {!isLast && (
            <div className="absolute left-8 md:left-11 top-12 md:top-16 w-0.5 h-150 md:h-100 bg-gray-300"></div>
          )}

          {/* Tweet body */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold text-gray-900 dark:text-white text-lg">
                {profile.name}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {profile.username}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {profile.time}
              </span>
            </div>

            {/* Tweet text */}
            <div className="text-gray-900 dark:text-white mb-4 leading-relaxed text-lg">
              {content.map((c, i) => (
                <Fragment key={`${index}-${i}`}>
                  <div>{c}</div>
                  {i < content.length - 1 && <br />}
                </Fragment>
              ))}
            </div>

            {/* Like button */}
            <div className="flex items-center">
              <button
                onClick={() => toggleStatus()}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
