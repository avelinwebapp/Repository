"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Coffee, Cake, Armchair } from "lucide-react";
import type { ViewState } from "@/app/page";
import { useRouter } from "next/navigation";

interface NextPageProps {
  onBack: () => void;
  setVideoSrc: (src: string) => void;
  setView: (view: ViewState) => void;
}

export const NextPage = ({ onBack, setVideoSrc, setView }: NextPageProps) => {
  const router = useRouter();
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

      {/* Main Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left Side: Brand Statement */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 text-left">
          <h2 className="font-serif text-4xl sm:text-5xl text-white tracking-wide leading-tight">
            THE CAFE <br />
            EXPERIENCE
          </h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
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
              desc: "좌석",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.3)" }}
              onClick={() => {
                if (item.desc === "음료" || item.desc === "음식") {
                  setVideoSrc("/main_page_1_3.jpg");
                  setView("experience");
                } else if (item.desc === "좌석") {
                  router.push("/place");
                }
              }}
              className="flex flex-row items-center p-5 gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all text-left group cursor-pointer"
            >
              <item.icon className="w-6 h-6 text-white/80 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="text-xs text-white/50 mt-1">{item.desc}</p>
              </div>
            </motion.div>
          ))}
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
