"use client";

import { Header } from "@/components/landing/header";
import { TweetContent } from "@/components/common/tweetContent";
import { useCallback, useState } from "react";
import Footer from "@/components/landing/footer";

const content = [
  {
    id: 1,
    content:
      "The Rubik's Cube isn't just a puzzle—it's a 3D representation of mathematical beauty. Each of the 43,252,003,274,489,856,000 possible positions tells a story of permutation and combination.",
  },
  {
    id: 2,
    content:
      "What makes solving the cube fascinating isn't memorizing algorithms, but understanding the underlying logic. Every move affects multiple pieces, creating a delicate dance of cause and effect. The challenge? Thinking in 3D space.",
  },
  {
    id: 3,
    content:
      "The beauty of the Rubik's Cube lies in its deceptive simplicity. Six faces, nine squares each, yet it represents one of the most complex puzzles ever created. It teaches us that complex problems often have elegant solutions.",
  },
];

export default function Foreword() {
  const [likedContent, setLikedContent] = useState<Set<number>>(new Set());
  const toggleStatus = useCallback((id: number) => {
    setLikedContent((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto mt-16 px-4">
        <div className="space-y-4">
          {content.map((tweet, index) => (
            <div key={tweet.id} className="relative">
              <TweetContent
                index={index}
                content={tweet.content}
                isLiked={likedContent.has(tweet.id)}
                toggleStatus={() => toggleStatus(tweet.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
