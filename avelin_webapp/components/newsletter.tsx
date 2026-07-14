"use client";

import { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useIsV0 } from "@/lib/context";
import { SwipeToEnter } from "./swipe-to-enter";
import { NextPage } from "./next-page";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ViewState } from "@/app/page";

const DURATION = 0.3;
const DELAY = DURATION;
const EASE_OUT = "easeOut";
const EASE_OUT_OPACITY = [0.25, 0.46, 0.45, 0.94] as const;
const SPRING = {
  type: "spring" as const,
  stiffness: 60,
  damping: 10,
  mass: 0.8,
};

const EXPERIENCE_VIDEOS = [
  "/main_page_1_2.mp4",
  "/main_page_1_3.jpg",
  "/main_page_1_4.mp4",
];

export const Newsletter = ({
  videoSrc,
  setVideoSrc,
  view,
  setView,
}: {
  videoSrc: string;
  setVideoSrc: (src: string) => void;
  view: ViewState;
  setView: (v: ViewState) => void;
}) => {
  const isInitialRender = useRef(true);

  const handleNextVideo = () => {
    const currentIndex = EXPERIENCE_VIDEOS.indexOf(videoSrc);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % EXPERIENCE_VIDEOS.length;
      setVideoSrc(EXPERIENCE_VIDEOS[nextIndex]);
    }
  };

  const handlePrevVideo = () => {
    const currentIndex = EXPERIENCE_VIDEOS.indexOf(videoSrc);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + EXPERIENCE_VIDEOS.length) % EXPERIENCE_VIDEOS.length;
      setVideoSrc(EXPERIENCE_VIDEOS[prevIndex]);
    }
  };

  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  return (
    <div className="flex overflow-hidden relative flex-col gap-4 justify-center items-center pt-10 w-full h-full short:lg:pt-10 pb-footer-safe-area 2xl:pt-footer-safe-area px-sides short:lg:gap-4 lg:gap-8">
      {view === "home" && (
        <motion.div
          key="header"
          layout="position"
          transition={{ duration: DURATION, ease: EASE_OUT }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h1 className="font-serif text-5xl short:lg:text-8xl sm:text-8xl lg:text-9xl text-foreground text-center">
            Enter the Avelin System, SWIPE!
          </h1>
        </motion.div>
      )}

      <div className="flex flex-col items-center min-h-0 shrink w-full">
        <AnimatePresenceGuard>
          {view === "home" && (
            <motion.div
              key="newsletter"
              initial={isInitialRender.current ? false : "hidden"}
              animate="visible"
              exit="exit"
              variants={{
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: {
                    delay: DELAY,
                    duration: DURATION,
                    ease: EASE_OUT,
                  },
                },
                hidden: {
                  scale: 0.9,
                  opacity: 0,
                  transition: { duration: DURATION, ease: EASE_OUT },
                },
                exit: {
                  y: -100,
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: DURATION, ease: EASE_OUT },
                },
              }}
              className="flex flex-col items-center w-full"
            >
              <div className="flex flex-col gap-4 w-full max-w-xl md:gap-6 lg:gap-8 items-center">
                <SwipeToEnter onSwipeComplete={() => {
                  setVideoSrc("/main_page_1_FB.mp4");
                  setView("transition");

                  // 영상이 끝나기 전에 모달창을 띄우려면 여기서 시간을 조절하세요 (1000 = 1초)
                  setTimeout(() => {
                    setView("next");
                  }, 800);
                }} />
              </div>
            </motion.div>
          )}

          {view === "next" && (
            <motion.div
              key="next-page"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="w-full flex justify-center"
            >
              <NextPage
                onBack={() => {
                  setVideoSrc("/main_page_1_1.mp4");
                  setView("home");
                }}
                setVideoSrc={setVideoSrc}
                setView={setView}
              />
            </motion.div>
          )}

          {view === "experience" && (
            <motion.div
              key="drag-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-[100dvh] cursor-grab active:cursor-grabbing z-30"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                const swipeThreshold = 50; // pixels
                if (info.offset.x < -swipeThreshold) {
                  handleNextVideo();
                } else if (info.offset.x > swipeThreshold) {
                  handlePrevVideo();
                }
              }}
            />
          )}

          {view === "experience" && videoSrc === "/main_page_1_4.mp4" && (
            <motion.div
              key="controls-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-[100dvh] pointer-events-none z-40"
            >
              {/* Left Arrow */}
              <button
                onClick={handlePrevVideo}
                className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all pointer-events-auto hover:scale-105 active:scale-95 shadow-lg"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={handleNextVideo}
                className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all pointer-events-auto hover:scale-105 active:scale-95 shadow-lg"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* Bottom MENU Button */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex justify-center pointer-events-auto">
                <button
                  onClick={() => setView("next")}
                  className="font-serif text-4xl text-white hover:text-white/80 transition-colors uppercase tracking-widest hover:scale-105 transition-transform font-bold"
                  style={{ fontFamily: "Moniqa, serif" }}
                >
                  MENU
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresenceGuard>
      </div>
    </div>
  );
};

const AnimatePresenceGuard = ({ children }: { children: React.ReactNode }) => {
  const isV0 = useIsV0();

  return isV0 ? <>{children}</> : <AnimatePresence mode="popLayout" propagate>{children}</AnimatePresence>;
};
