import { Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const profile = {
  pictureUrl:
    "https://upload.wikimedia.org/wikipedia/commons/6/61/Rubiks_cube_solved.jpg",
  name: "Rubik's Cube",
  username: "@rubikscube",
  time: "2h",
};

export const TweetContent = ({
  index,
  content,
  isLiked,
  toggleStatus,
}: {
  index: number;
  content: string;
  isLiked: boolean;
  toggleStatus: () => void;
}) => {
  return (
    <div className="relative">
      {/* Tweet content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm transition-shadow duration-200">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-300 overflow-hidden">
              <Image
                src={profile.pictureUrl}
                alt={profile.name}
                width={40}
                height={40}
              />
            </div>
          </div>

          {/* Connecting line */}
          {index < 2 && (
            <div className="absolute left-11 top-16 w-0.5 h-80 bg-gray-300"></div>
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
              {content}
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
