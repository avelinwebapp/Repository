"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface SwipeToEnterProps {
  onSwipeComplete: () => void;
}

export const SwipeToEnter = ({ onSwipeComplete }: SwipeToEnterProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(150);
  const dragX = useMotionValue(0);

  // Smooth opacity and colors based on drag progress
  const textOpacity = useTransform(dragX, [0, maxDrag], [1, 0.1]);
  const handleBg = useTransform(dragX, [0, maxDrag], ["rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.95)"]);
  const handleColor = useTransform(dragX, [0, maxDrag], ["#ffffff", "#000000"]);

  useEffect(() => {
    const updateMaxDrag = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const handleWidth = 48; // w-12
        const padding = 8; // px-1 (4px * 2)
        setMaxDrag(containerWidth - handleWidth - padding);
      }
    };
    updateMaxDrag();
    window.addEventListener("resize", updateMaxDrag);
    return () => window.removeEventListener("resize", updateMaxDrag);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center w-[72%] sm:w-[80%] max-w-[280px] sm:max-w-[380px] md:max-w-[440px] h-13 sm:h-14 p-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md select-none overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.2)]"
    >
      {/* Background track text */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-semibold tracking-wider text-white/80 pointer-events-none pl-6 sm:pl-8"
      >
        밀어서 입장하기 (Swipe to Enter)
      </motion.div>

      {/* Dragging Handle */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0.05}
        dragMomentum={false}
        style={{ x: dragX, backgroundColor: handleBg, color: handleColor }}
        onDragEnd={() => {
          if (dragX.get() >= maxDrag - 5) {
            onSwipeComplete();
          } else {
            // Spring back if not fully swiped
            dragX.set(0);
          }
        }}
        className="flex items-center justify-center w-12 h-12 rounded-full cursor-grab active:cursor-grabbing shadow-lg select-none shrink-0"
      >
        <ChevronRight className="w-6 h-6" />
      </motion.div>
    </div>
  );
};
