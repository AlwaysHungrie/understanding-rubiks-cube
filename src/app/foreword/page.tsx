"use client";

import { Header } from "@/components/landing/header";
import { TweetContent } from "@/components/common/tweetContent";
import Footer from "@/components/landing/footer";
import { MessageActions } from "@/components/common/messageActions";
import { PrimaryButton } from "@/components/common/primaryButton";
import { ControlContainer } from "@/components/common/controlContainer";
import { useProgress } from "@/context/progressContext";
import { useRouter } from "next/navigation";

const content = [
  {
    id: 0,
    content: [
      "This guide will walk you through all the logical steps to solve the Rubik's Cube all by yourself.",
      "My main goal is for you to start using logical reasoning in your daily life. And stop relying on others to solve your problems for you.",
      "It is easy and something all of us are naturally good at. Don't let anyone tell you otherwise.",
    ],
  },
  {
    id: 1,
    content: [
      "Rubik's Cube does look intimidating. At first glance, it looks like you will need advanced visualization and reasoning skills in 3 dimensions in order to solve it.",
      "Because of its scary appearance, simply knowing the solution is widely regarded as a demonstration of some form of intelligence or talent.",
    ],
  },
  {
    id: 2,
    content: [
      "Due to its popularity, the internet is flooded with solutions and guides that only rely on remembering said solutions.",
      "Almost all guides only focus on using your memory, not your thinking skills.",
      "Worst of all, it is now generally understood that this puzzle can only be solved by memorizing a set of algorithms.",
    ],
  },
  {
    id: 3,
    content: [
      "What was once a beautiful puzzle, is now reduced to a hand eye coordination exercise.",
      "Even a monkey can be taught how to solve it.",
      "Do you want to remain a monkey, or learn to think like a human?",
    ],
  },
  {
    id: 4,
    content: [
      "I am assuming you can already solve one side by yourself. But doing so jumbles the rest of the cube.",
      "Knowing how to solve one side is enough to solve the entire cube.",
      "Let us see how...",
    ],
  },
];

export default function Foreword() {
  const router = useRouter();
  const { setCurrentSectionIndex, likedContent, toggleStatus } = useProgress();

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 md:px-6 pt-4 md:pt-8 pb-4">
        <div className="w-full flex items-start mb-8 md:mb-4 sticky top-4 md:top-12 gap-4 flex-col md:flex-row z-10">
          <ControlContainer className="flex">
            <div className="font-bold text-white py-2">Foreword</div>
          </ControlContainer>
          <MessageActions
            message="Click the button below if you can solve one side of the cube by yourself."
            className="ml-auto"
            actions={
              <PrimaryButton
                className="gap-2"
                onClick={() => {
                  setCurrentSectionIndex(1);
                  router.push("/");
                }}
              >
                Start Guide
              </PrimaryButton>
            }
          />
        </div>
        <Header />
        <div className="max-w-2xl mx-auto mt-16 px-0 md:px-0">
          <div className="space-y-4">
            {content.map((tweet, index) => (
              <div key={tweet.id} className="relative">
                <TweetContent
                  index={index}
                  content={tweet.content}
                  isLiked={likedContent.has(tweet.id)}
                  toggleStatus={() => toggleStatus(tweet.id)}
                  isLast={index === content.length - 1}
                />
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
