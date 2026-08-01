"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Coffee, Cake, Armchair } from "lucide-react";
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
      className="flex flex-col gap-6 w-full max-w-4xl px-sides py-8 backdrop-blur-xl border border-white/10 bg-black/30 rounded-[32px] shadow-2xl relative overflow-hidden max-h-[80vh] overflow-y-auto text-white"
    >
      {/* Header with Back Button */}
      <motion.div variants={itemVariants} className="flex justify-between items-center w-full border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          처음으로 (Back)
        </button>
        <span className="text-xs uppercase tracking-widest text-white/40">Menu / Overview</span>
      </motion.div>

      {/* Selection Status Banner */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-center p-5 rounded-2xl bg-white/5 border border-white/10 gap-4"
      >
        <div className="flex flex-col text-left w-full md:w-auto">
          <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">나의 선택한 메뉴 (Selected Menu)</span>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2.5 text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${selectedDrink ? "bg-amber-400" : "bg-white/20"}`}></span>
              <span className="text-white/60">음료 (Drink):</span>
              <span className={selectedDrink ? "text-amber-300 font-bold" : "text-white/30 font-normal"}>
                {selectedDrink ? selectedDrink : "선택 안 됨 (No Selection)"}
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
                  className="ml-2 text-[10px] text-amber-300 hover:text-amber-200 transition-colors bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold"
                >
                  수정
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${selectedFood ? "bg-amber-400" : "bg-white/20"}`}></span>
              <span className="text-white/60">음식 (Food):</span>
              <span className={selectedFood ? "text-amber-300 font-bold" : "text-white/30 font-normal"}>
                {selectedFood ? selectedFood : "선택 안 됨 (No Selection)"}
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
                  className="ml-2 text-[10px] text-amber-300 hover:text-amber-200 transition-colors bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold"
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
              ✓ 예약 가능 (Ready to Book)
            </span>
          ) : (
            <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
              음료 & 음식 선택 필요 (Selection Required)
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

      {/* Main Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left Side: Brand Statement */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 text-left">
          <h2 className="font-serif text-4xl sm:text-5xl text-white tracking-wide leading-tight">
            THE CAFE <br />
            EXPERIENCE
          </h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-medium">
            함께 'AVEC'와 연결 'link'을 의미하는 아벨린은 단순한 식음료<br></br>이용을 넘어 현대의 비대면 기술을 결합함으로써,
            카페 본연의 가치 '머무름과 교감'의 라이스타일을 제안하고자
            고안되었습니다.
          </p>
        </motion.div>

        {/* Right Side: Features List */}
        <div className="flex flex-col gap-3 w-full">
          {[
            {
              icon: Coffee,
              title: "Coffee & Drinks",
              desc: "음료",
            },
            {
              icon: Cake,
              title: "Dessert & Food",
              desc: "음식",
            },
            {
              icon: Armchair,
              title: "Seats & Space",
              desc: "예약",
            },
          ].map((item, index) => {
            const isBook = item.desc === "예약";
            const isReadyToBook = !!selectedDrink && !!selectedFood;
            const isLocked = isBook && !isReadyToBook;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={isLocked ? { y: 0 } : { y: -5, borderColor: "rgba(255,255,255,0.3)" }}
                onClick={() => {
                  if (item.desc === "음료") {
                    setVideoSrc("/main_page_1_3.mp4");
                    if (setCategory) setCategory("drink");
                    setView("experience");
                  } else if (item.desc === "음식") {
                    setVideoSrc("/main_page_1_3.mp4");
                    if (setCategory) setCategory("food");
                    setView("experience");
                  } else if (item.desc === "예약") {
                    if (!isReadyToBook) {
                      alert("음료와 음식을 선택해주세요");
                      setShowWarning(true);
                      setTimeout(() => setShowWarning(false), 4000);
                      return;
                    }
                    router.push("/place");
                  }
                }}
                className={cn(
                  "flex flex-row items-center p-5 gap-4 rounded-2xl border transition-all text-left group cursor-pointer",
                  isLocked
                    ? "border-white/5 bg-white/5 opacity-50 cursor-not-allowed"
                    : "border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10"
                )}
              >
                <item.icon className={cn(
                  "w-6 h-6 transition-transform",
                  isLocked ? "text-white/40" : "text-white/80 group-hover:scale-110"
                )} />
                <div className="flex-1">
                  <h3 className={cn("text-sm font-semibold", isLocked ? "text-white/40" : "text-white")}>{item.title}</h3>
                  <p className={cn("text-xs mt-1", isLocked ? "text-white/20" : "text-white/50")}>{item.desc}</p>
                </div>
                {isLocked && (
                  <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-lg font-bold">
                    선택 후 활성화
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-white/10 to-transparent border border-white/5 flex justify-between items-center group cursor-pointer hover:border-white/20 transition-all">
          <div className="text-left">
            <h4 className="text-sm font-semibold text-white">PAST PROJECT</h4>
            <p className="text-xs text-white/50">지난 프로젝트</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-transparent to-white/10 border border-white/5 flex justify-between items-center group cursor-pointer hover:border-white/20 transition-all">
          <div className="text-left">
            <h4 className="text-sm font-semibold text-white">NEXT PROJECT</h4>
            <p className="text-xs text-white/50">다음 프로젝트</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
      </motion.div>
    </motion.div>
  );
};
