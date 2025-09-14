"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const LIKED_CONTENT_KEY = "rubik-cube-liked-content";
const CURRENT_SECTION_KEY = "rubik-cube-current-section-index";

export const ProgressContext = createContext<{
  likedContent: Set<number>;
  toggleStatus: (id: number) => void;
  isLoaded: boolean;
  currentSectionIndex: number;
  setCurrentSectionIndex: (index: number) => void;
}>({
  likedContent: new Set(),
  toggleStatus: () => {},
  isLoaded: false,
  currentSectionIndex: 0,
  setCurrentSectionIndex: () => {},
});

export const ProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [likedContent, setLikedContent] = useState<Set<number>>(new Set());
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Load liked content from localStorage on component mount
  useEffect(() => {
    const savedLikedContent = localStorage.getItem(LIKED_CONTENT_KEY);
    const savedCurrentSectionIndex = localStorage.getItem(CURRENT_SECTION_KEY);
    if (savedLikedContent) {
      try {
        const parsed = JSON.parse(savedLikedContent);
        setLikedContent(new Set(parsed));
      } catch (error) {
        console.error(
          "Failed to parse liked content from localStorage:",
          error
        );
      }
    }

    if (savedCurrentSectionIndex) {
      try {
        const parsed = JSON.parse(savedCurrentSectionIndex);
        setCurrentSectionIndex(parsed);
      } catch (error) {
        console.error(
          "Failed to parse current section index from localStorage:",
          error
        );
      }
    }

    setIsLoaded(true);
  }, []);

  // Save liked content to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LIKED_CONTENT_KEY, JSON.stringify([...likedContent]));
  }, [likedContent]);

  // Save current section index to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      CURRENT_SECTION_KEY,
      JSON.stringify(currentSectionIndex)
    );
  }, [currentSectionIndex]);

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
    <ProgressContext.Provider
      value={{
        likedContent,
        toggleStatus,
        isLoaded,
        currentSectionIndex,
        setCurrentSectionIndex,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  return useContext(ProgressContext);
};
