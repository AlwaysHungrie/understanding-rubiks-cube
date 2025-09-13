"use client";

import Footer from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { SectionCard } from "@/components/landing/sectionCard";
import { useState } from "react";

export default function Home() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 pt-12 pb-4">
        <Header />

        <div className="mt-20 max-w-4xl mx-auto">
          <div className="grid gap-8">
            {[
              {
                label: "Foreword: A promise this is guide is not clickbait",
                backgroundColor: "#EBB998",
                backgroundImageUrl:
                  "https://unsplash.com/photos/MuB8snLj2xQ/download?ixid=M3wxMjA3fDB8MXx0b3BpY3x8Ym84alFLVGFFMFl8fHx8fDJ8fDE3NTc4MDIxNjV8&force=true&w=640",
              },
              {
                label: "Anatomy of a Rubik's Cube",
                backgroundColor: "#BEC0B7",
                backgroundImageUrl:
                  "https://unsplash.com/photos/aYPGdQBoq5Y/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzU3ODA2Mjc1fA&force=true&w=640",
              },
            ].map((sectionInfo, index) => (
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
