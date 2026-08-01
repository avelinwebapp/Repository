"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Coffee, Cake, Armchair, Utensils } from "lucide-react";
import type { ViewState } from "@/app/page";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NextPageProps {
  onBack: () => void;
  setVideoSrc: (src: string) => void;
  setView: (view: ViewState) => void;
  setCategory?: (category: "drink" | "food" | null) => void;
  selectedDrink: string | null;
  selectedFood: string | null;
  setSelectedDrink: (val: string | null) => void;
  setSelectedFood: (val: string | null) => void;
}

export const NextPage = ({
  onBack,
  setVideoSrc,
  setView,
  setCategory,
  selectedDrink,
  selectedFood,
  setSelectedDrink,
  setSelectedFood,
}: NextPageProps) => {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { ease: "easeInOut", duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col justify-between w-full h-full max-w-none p-4 sm:p-6 md:p-10 bg-transparent text-[#F4E8DD] overflow-y-auto relative gap-4 sm:gap-6"
    >
      {/* Header with Back Button */}
      <motion.div variants={itemVariants} className="flex justify-between items-center w-full border-b border-[#F4E8DD]/10 pb-3 sm:pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[#F4E8DD]/60 hover:text-[#F4E8DD] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 sm:w-7 sm:h-7 transition-transform group-hover:-translate-x-1" />
          처음으로 (Back)
        </button>
        <span className="text-xs sm:text-sm uppercase tracking-widest text-[#F4E8DD]/40 font-bold">Menu / Overview</span>
      </motion.div>

      {/* Selection Status Banner */}
      <motion.div
        variants={itemVariants}
        className="hidden md:flex flex-col md:flex-row justify-between items-center p-4 rounded-2xl bg-[#F4E8DD]/5 border border-[#F4E8DD]/10 gap-4"
      >
        <div className="flex flex-col text-left w-full md:w-auto">
          <span className="text-xs text-[#F4E8DD]/40 uppercase tracking-widest font-semibold">나의 선택한 메뉴 (Selected Menu)</span>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2 text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${selectedDrink ? "bg-[#C4A03E]" : "bg-[#F4E8DD]/20"}`}></span>
              <span className="text-[#F4E8DD]/60">음료:</span>
              <span className={selectedDrink ? "text-[#C4A03E] font-bold" : "text-[#F4E8DD]/30 font-normal"}>
                {selectedDrink ? selectedDrink : "선택 안 됨"}
              </span>
              {selectedDrink && (
                <button
                  onClick={() => {
                    setSelectedDrink(null);
                    localStorage.removeItem("selected_drink");
                    setVideoSrc("/main_page_1_3.mp4");
                    if (setCategory) setCategory("drink");
                    setView("experience");
                  }}
                  className="ml-2 text-[10px] text-[#C4A03E] hover:text-[#d4b04e] transition-colors bg-[#C4A03E]/10 border border-[#C4A03E]/20 px-2 py-0.5 rounded-full font-bold"
                >
                  수정
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${selectedFood ? "bg-[#C4A03E]" : "bg-[#F4E8DD]/20"}`}></span>
              <span className="text-[#F4E8DD]/60">음식:</span>
              <span className={selectedFood ? "text-[#C4A03E] font-bold" : "text-[#F4E8DD]/30 font-normal"}>
                {selectedFood ? selectedFood : "선택 안 됨"}
              </span>
              {selectedFood && (
                <button
                  onClick={() => {
                    setSelectedFood(null);
                    localStorage.removeItem("selected_food");
                    setVideoSrc("/main_page_1_3.mp4");
                    if (setCategory) setCategory("food");
                    setView("experience");
                  }}
                  className="ml-2 text-[10px] text-[#C4A03E] hover:text-[#d4b04e] transition-colors bg-[#C4A03E]/10 border border-[#C4A03E]/20 px-2 py-0.5 rounded-full font-bold"
                >
                  수정
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0 w-full md:w-auto text-center md:text-right mt-2 md:mt-0">
          {selectedDrink && selectedFood ? (
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 shadow-sm shadow-green-500/10">
              ✓ 예약 가능
            </span>
          ) : (
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-[#C4A03E]/10 text-[#C4A03E] border border-[#C4A03E]/20 animate-pulse">
              음료 & 음식 선택 필요
            </span>
          )}
        </div>
      </motion.div>

      {/* Warning message when user tries to book without selection */}
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold text-center flex items-center justify-center gap-2"
        >
          ⚠️ 예약을 하려면 음료와 음식을 모두 선택하셔야 합니다. 아래 리스트에서 음료와 음식을 선택해 주세요.
        </motion.div>
      )}

      {/* Main Showcase (Left-Right Layout: Brand Statement on Left Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-2 sm:mt-4">
        <motion.div variants={itemVariants} className="flex flex-col gap-3 text-left max-w-xl">
          <h2 className="font-serif text-6xl sm:text-7xl md:text-8xl text-[#F4E8DD] tracking-wide leading-tight">
            THE CAFE <br />
            EXPERIENCE
          </h2>
          <p className="text-lg sm:text-lg md:text-xl text-[#F4E8DD]/70 leading-relaxed font-medium">
            함께 'AVEC'와 연결 'link'을 의미하는 아벨린은 단순한 식음료 이용을 넘어 현대의 비대면 기술을 결합함으로써, 카페 본연의 가치 '머무름과 교감'의 라이프스타일을 제안하고자 고안되었습니다.
          </p>
        </motion.div>
        <div className="hidden md:block" />
      </div>

      {/* Action Buttons Anchored at Bottom */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full mt-auto pb-4 sm:pb-6">
        {/* Button 1: Menu */}
        <motion.button
          type="button"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setVideoSrc("/main_page_1_3.mp4");
            if (setCategory) setCategory("drink");
            setView("experience");
          }}
          className="w-full p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#F4E8DD] text-black font-extrabold flex items-center justify-between shadow-2xl transition-all hover:bg-[#e8dcd0] group cursor-pointer"
        >
          <div className="flex items-center gap-4 sm:gap-5 text-left">
            <div className="p-3 sm:p-4 rounded-xl bg-black/10 text-black group-hover:scale-110 transition-transform">
              <Utensils className="w-7 h-7 sm:w-9 sm:h-9" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black leading-tight text-black">메뉴보기</h3>
              <p className="text-xs sm:text-sm font-semibold text-black/60 mt-1">Coffee, Drinks & Food</p>
            </div>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black text-[#F4E8DD] flex items-center justify-center font-bold text-lg group-hover:translate-x-1 transition-transform">
            →
          </div>
        </motion.button>

        {/* Button 2: Reservation */}
        {(() => {
          const isReadyToBook = !!selectedDrink && !!selectedFood;
          const isLocked = !isReadyToBook && !isMobile;

          return (
            <motion.button
              type="button"
              variants={itemVariants}
              whileHover={isLocked ? {} : { scale: 1.02, y: -4 }}
              whileTap={isLocked ? {} : { scale: 0.98 }}
              onClick={() => {
                if (isLocked) {
                  alert("음료와 음식을 선택해주세요");
                  setShowWarning(true);
                  setTimeout(() => setShowWarning(false), 4000);
                  return;
                }
                router.push("/place");
              }}
              className={cn(
                "w-full p-5 sm:p-7 rounded-2xl sm:rounded-3xl font-extrabold flex items-center justify-between transition-all shadow-2xl group text-left",
                isLocked
                  ? "bg-[#F4E8DD]/10 text-[#F4E8DD]/40 border border-[#F4E8DD]/10 cursor-not-allowed"
                  : "bg-[#C4A03E] text-black hover:bg-[#d4b04e] cursor-pointer"
              )}
            >
              <div className="flex items-center gap-4 sm:gap-5 text-left">
                <div className={cn(
                  "p-3 sm:p-4 rounded-xl transition-transform group-hover:scale-110",
                  isLocked ? "bg-[#F4E8DD]/5 text-[#F4E8DD]/40" : "bg-black/10 text-black"
                )}>
                  <Armchair className="w-7 h-7 sm:w-9 sm:h-9" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={cn("text-xl sm:text-2xl font-black leading-tight", isLocked ? "text-[#F4E8DD]/40" : "text-black")}>
                      예약하기
                    </h3>
                    {isLocked && (
                      <span className="text-[10px] sm:text-xs bg-[#C4A03E]/20 text-[#C4A03E] border border-[#C4A03E]/30 px-2 py-0.5 rounded-full font-bold">
                        선택 후 활성화
                      </span>
                    )}
                  </div>
                  <p className={cn("text-xs sm:text-sm font-semibold mt-1", isLocked ? "text-[#F4E8DD]/30" : "text-black/60")}>
                    Seats & Space
                  </p>
                </div>
              </div>
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg transition-transform",
                isLocked ? "bg-[#F4E8DD]/5 text-[#F4E8DD]/30" : "bg-black text-[#F4E8DD] group-hover:translate-x-1"
              )}>
                →
              </div>
            </motion.button>
          );
        })()}
      </div>

      {/* Bottom Action Cards */}
      <motion.div variants={itemVariants} className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-white/10 to-transparent border border-[#F4E8DD]/5 flex justify-between items-center group cursor-pointer hover:border-[#F4E8DD]/20 transition-all">
          <div className="text-left">
            <h4 className="text-sm font-semibold text-[#F4E8DD]">PAST PROJECT</h4>
            <p className="text-xs text-[#F4E8DD]/50">지난 프로젝트</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#F4E8DD]/60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-transparent to-white/10 border border-[#F4E8DD]/5 flex justify-between items-center group cursor-pointer hover:border-[#F4E8DD]/20 transition-all">
          <div className="text-left">
            <h4 className="text-sm font-semibold text-[#F4E8DD]">NEXT PROJECT</h4>
            <p className="text-xs text-[#F4E8DD]/50">다음 프로젝트</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#F4E8DD]/60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
      </motion.div>
    </motion.div>
  );
};
