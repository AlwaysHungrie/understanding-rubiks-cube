"use client";

import Footer from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { SectionCard } from "@/components/landing/sectionCard";
import { useState } from "react";
import { ControlContainer } from "@/components/common/controlContainer";
import { MessageActions } from "@/components/common/messageActions";
import { PrimaryButton } from "@/components/common/primaryButton";
import { LockIcon } from "lucide-react";
import { useProgress } from "@/context/progressContext";

const sectionInfo = [
  {
    label: "Foreword: This is guide is not clickbait",
    description:
      "Rubik's Cube is a logical puzzle and not a memorization game",
    link: "/foreword",
    backgroundColor: "#EBB998",
    backgroundImageUrl:
      "https://unsplash.com/photos/MuB8snLj2xQ/download?ixid=M3wxMjA3fDB8MXx0b3BpY3x8Ym84alFLVGFFMFl8fHx8fDJ8fDE3NTc4MDIxNjV8&force=true&w=1920",
  },
  {
    label: "Anatomy of a Rubik's Cube",
    description: "Indentifying the subtleties of the Rubik's Cube design",
    link: "/anatomy",
    backgroundColor: "#BEC0B7",
    backgroundImageUrl:
      "https://unsplash.com/photos/aYPGdQBoq5Y/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzU3ODA2Mjc1fA&force=true&w=1920",
  },
];

export default function Home() {
  const { currentSectionIndex } = useProgress();
  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 md:px-6 pt-4 md:pt-12 pb-4">
        <div className="w-full relative flex items-start mb-16 gap-4 flex-col md:flex-row">
          <ControlContainer className="flex">
            <div className="text-white">
              Estimated Time: <span className="font-bold">90 minutes</span>
            </div>
          </ControlContainer>

          <MessageActions
            message="Finish all the steps of the guide to unlock this action."
            className="ml-auto"
            actions={
              <PrimaryButton disabled className="gap-2">
                Solve Now
                <LockIcon className="w-4 h-4" />
              </PrimaryButton>
            }
          />
        </div>

        <Header />

        <div className="mt-20 max-w-4xl mx-auto">
          <div className="grid gap-8">
            {sectionInfo.map((sectionInfo, index) => (
              <SectionCard
                key={index}
                number={index}
                sectionInfo={sectionInfo}
                isLocked={index > currentSectionIndex}
                isCurrent={index === currentSectionIndex}
              />
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
