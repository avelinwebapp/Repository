"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button, buttonVariants } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useIsV0 } from "@/lib/context";
import { SwipeToEnter } from "./swipe-to-enter";
import { NextPage } from "./next-page";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Check } from "lucide-react";
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
  "/main_page_1_3.mp4",
];

const MENU_ITEMS: Record<string, any[]> = {
  drink: [
    {
      id: "beverage_1",
      number: "01",
      name: "Sunrise Layer",
      price: "₩7,000",
      notes: "Dark orange zest, burnt caramel, and bold, earthy coffee.",
      depth: "Dynamic & Layered Texture",
      volume: "160ml",
      description: "Visually stunning and flavor-forward, this drink features a sharp contrast of bright, citrus-infused juice layered carefully beneath a robust, hot espresso shot. The pretty 'Sunrise' effect isn't just for show; as the temperatures and densities mingle, the drink evolves from a tart, fruity start into a rich, caramel-heavy finish that mimics the changing light of dawn.",
      image: "/beverage_1.jpg"
    },
    {
      id: "beverage_2",
      number: "02",
      name: "Signature 2",
      price: "₩7,500",
      notes: "Bright citrus, delicate floral notes, clean finish.",
      depth: "Light & Refreshing",
      volume: "200ml",
      description: "아벨린의 두 번째 시그니처 음료입니다. 산뜻한 과일향과 깔끔한 마무리가 특징입니다.",
      image: "/beverage_2.jpg"
    },
    {
      id: "beverage_3",
      number: "03",
      name: "Signature 3",
      price: "₩8,000",
      notes: "Rich chocolate, nutty undertones, creamy mouthfeel.",
      depth: "Deep & Creamy",
      volume: "180ml",
      description: "아벨린의 세 번째 시그니처 음료입니다. 진한 초콜릿과 견과류의 고소함이 부드럽게 어우러집니다.",
      image: "/beverage_3.jpg"
    }
  ],
  food: [
    {
      id: "food_1",
      number: "01",
      name: "Signature Food 1",
      price: "₩15,000",
      notes: "Fresh ingredients, savory.",
      depth: "Rich & Savory",
      volume: "1 portion",
      description: "아벨린의 첫 번째 시그니처 푸드입니다. 신선한 재료로 정성껏 준비했습니다.",
      image: "/food_1.jpg"
    },
    {
      id: "food_2",
      number: "02",
      name: "Signature Food 2",
      price: "₩18,000",
      notes: "Aromatic herbs, balanced flavor.",
      depth: "Balanced & Satisfying",
      volume: "1 portion",
      description: "아벨린의 두 번째 시그니처 푸드입니다. 특별한 레시피로 깊은 풍미를 자랑합니다.",
      image: "/food_2.jpg"
    },
    {
      id: "dissert_1",
      number: "03",
      name: "Signature Dessert 1",
      price: "₩8,500",
      notes: "Sweet, creamy, delightful.",
      depth: "Soft & Sweet",
      volume: "1 piece",
      description: "입안에서 사르르 녹는 아벨린의 시그니처 디저트입니다. 달콤한 휴식을 선사합니다.",
      image: "/dissert_1.jpg"
    },
    {
      id: "dissert_2",
      number: "04",
      name: "Signature Dessert 2",
      price: "₩9,000",
      notes: "Rich chocolate, decadent.",
      depth: "Intense & Rich",
      volume: "1 piece",
      description: "깊고 진한 초콜릿의 풍미를 느낄 수 있는 프리미엄 디저트입니다.",
      image: "/dissert_2.jpg"
    },
    {
      id: "dissert_3",
      number: "05",
      name: "Signature Dessert 3",
      price: "₩8,000",
      notes: "Fruity, light, refreshing.",
      depth: "Fresh & Light",
      volume: "1 piece",
      description: "상큼한 과일과 부드러운 크림이 조화로운 디저트입니다.",
      image: "/dissert_3.jpg"
    },
    {
      id: "dissert_4",
      number: "06",
      name: "Signature Dessert 4",
      price: "₩9,500",
      notes: "Classic, elegant, perfect pairing.",
      depth: "Classic & Elegant",
      volume: "1 piece",
      description: "커피와 가장 잘 어울리는 아벨린의 클래식 디저트입니다. 우아한 티타임을 즐겨보세요.",
      image: "/dissert_4.jpg"
    }
  ]
};

const MenuItemCard = ({
  item,
  category,
  onSelect,
  setSelectedDrink,
  setSelectedFood,
}: {
  item: any;
  category: "drink" | "food";
  onSelect: (orderName: string) => void;
  setSelectedDrink: (val: string | null) => void;
  setSelectedFood: (val: string | null) => void;
}) => {
  const [qty, setQty] = useState(1);

  return (
    <div className="w-[88vw] sm:w-[380px] md:w-[420px] shrink-0 snap-center flex flex-col bg-[#f5f1e8] rounded-3xl overflow-hidden shadow-2xl border border-black/10 text-[#3f2a1d] select-none max-h-[85vh]">
      {/* Dark Image Header Box */}
      <div className="relative w-full h-56 sm:h-64 bg-[#0a0a0a] shrink-0 overflow-hidden flex items-center justify-center">
        <span className="absolute top-4 left-5 font-serif text-3xl text-white/90 tracking-widest z-10 font-bold">
          {item.number}
        </span>
        <div className="relative w-4/5 h-4/5">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain object-center"
            draggable="false"
          />
        </div>
      </div>

      {/* Cream Details Content */}
      <div className="flex flex-col flex-1 p-6 justify-between gap-4 overflow-y-auto bg-[#f5f1e8]">
        <div>
          <div className="flex justify-between items-baseline border-b border-[#d1c8b8] pb-4">
            <h3 className="font-serif text-3xl font-bold tracking-tight text-[#3f2a1d]">
              {item.name}
            </h3>
            <span className="font-serif text-3xl font-bold text-[#5d1f27]">
              {item.price}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 my-3.5 text-[10px] sm:text-xs text-[#735e51] font-sans border-b border-[#d1c8b8] pb-3.5">
            <div><span className="font-bold uppercase text-[#3f2a1d]">NOTES:</span> {item.notes}</div>
            <div><span className="font-bold uppercase text-[#3f2a1d]">DEPTH:</span> {item.depth}</div>
            <div><span className="font-bold uppercase text-[#3f2a1d]">VOLUME:</span> {item.volume}</div>
          </div>

          <p className="font-serif text-xs leading-relaxed text-[#3f2a1d]/85">
            {item.description}
          </p>
        </div>
      </div>

      {/* Bottom Order Bar */}
      <div className="flex flex-row items-center justify-between px-6 py-4 bg-[#f5f1e8] border-t border-[#d1c8b8] shrink-0">
        <div className="flex items-center gap-3 text-[#3f2a1d]">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 rounded-full border border-[#d1c8b8] hover:bg-[#d1c8b8]/20 flex items-center justify-center font-bold text-base transition-colors"
          >
            -
          </button>
          <span className="font-serif text-xl font-bold w-6 text-center">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-10 h-10 rounded-full border border-[#d1c8b8] hover:bg-[#d1c8b8]/20 flex items-center justify-center font-bold text-base transition-colors"
          >
            +
          </button>
        </div>

        <button
          onClick={() => {
            const orderName = `${item.name} x${qty}`;
            if (category === "drink") {
              const existing = localStorage.getItem("selected_drink");
              const newValue = existing ? `${existing}, ${orderName}` : orderName;
              setSelectedDrink(newValue);
              localStorage.setItem("selected_drink", newValue);
            } else if (category === "food") {
              const existing = localStorage.getItem("selected_food");
              const newValue = existing ? `${existing}, ${orderName}` : orderName;
              setSelectedFood(newValue);
              localStorage.setItem("selected_food", newValue);
            }
            onSelect(orderName);
          }}
          className="bg-[#5d1f27] text-white font-bold text-sm py-3 px-8 rounded-full hover:bg-[#46171d] transition-colors shadow-md tracking-wider"
        >
          선택
        </button>
      </div>
    </div>
  );
};

export const Newsletter = ({
  videoSrc,
  setVideoSrc,
  view,
  setView,
  category,
  setCategory,
}: {
  videoSrc: string;
  setVideoSrc: (src: string) => void;
  view: ViewState;
  setView: (v: ViewState) => void;
  category: "drink" | "food" | null;
  setCategory: (cat: "drink" | "food" | null) => void;
}) => {
  const isInitialRender = useRef(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [menuIndex, setMenuIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lastSelectedItem, setLastSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    setMenuIndex(0);
    setQuantity(1);
  }, [category]);

  useEffect(() => {
    setQuantity(1);
  }, [menuIndex]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSelectedDrink(localStorage.getItem("selected_drink"));
      setSelectedFood(localStorage.getItem("selected_food"));
    }
  }, []);

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

  useEffect(() => {
    if (view !== "experience") {
      setCategory(null);
    }
  }, [view]);

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
                  setVideoSrc("/main_page_1_2.mp4");
                  setView("transition");

                  // ★ 모달창(메뉴판)이 등장하는 속도(시점)를 조절하는 곳입니다.
                  // 1000 = 1초이며, 숫자가 작을수록 스와이프 직후 모달창이 더 빨리 나타납니다.
                  setTimeout(() => {
                    setView("next");
                  }, 400); // 600ms(0.6초) 후 모달창 등장 (기존 800ms에서 600ms로 조절해 더 빠르게 보이도록 함)
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
              className="absolute inset-0 w-full h-full"
            >
              <NextPage
                onBack={() => {
                  setVideoSrc("/main_page_1_1.mp4");
                  setView("home");
                }}
                setVideoSrc={setVideoSrc}
                setView={setView}
                setCategory={setCategory}
                selectedDrink={selectedDrink}
                selectedFood={selectedFood}
                setSelectedDrink={setSelectedDrink}
                setSelectedFood={setSelectedFood}
              />
            </motion.div>
          )}

          {view === "experience" && !category && (
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

          {view === "experience" && category && (
            <motion.div
              key="menu-experience-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex pointer-events-none z-40 overflow-hidden"
            >
              {/* Header Navigation */}
              <div className="absolute top-4 left-4 right-4 md:top-8 md:left-10 md:right-10 z-50 flex justify-between items-center pointer-events-auto">
                <button
                  onClick={() => {
                    setCategory(null);
                    setView("next");
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-white/80 hover:text-white transition-all shadow-lg active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm font-bold tracking-wider">돌아가기</span>
                </button>

                {/* Header Category Tabs */}
                <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/50 border border-white/15 backdrop-blur-xl shadow-xl">
                  <button
                    onClick={() => setCategory("drink")}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5",
                      category === "drink"
                        ? "bg-amber-400 text-black shadow-md font-extrabold"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <span>☕</span> 음료
                  </button>
                  <button
                    onClick={() => setCategory("food")}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5",
                      category === "food"
                        ? "bg-amber-400 text-black shadow-md font-extrabold"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <span>🍰</span> 음식
                  </button>
                </div>
              </div>

              {/* Pure Menu Card Slider (No Outer Frame) */}
              <div className="absolute inset-0 flex items-center justify-center w-full h-full pointer-events-none pt-16 pb-6 px-4">
                <div className="w-full h-full max-h-[85vh] flex flex-row gap-5 md:gap-8 overflow-x-auto overflow-y-hidden snap-x snap-mandatory items-center justify-start md:justify-center scroll-smooth px-4 md:px-8 pointer-events-auto">
                  {MENU_ITEMS[category].map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      category={category}
                      onSelect={(orderName) => {
                        setLastSelectedItem(orderName);
                        setShowConfirmModal(true);
                      }}
                      setSelectedDrink={setSelectedDrink}
                      setSelectedFood={setSelectedFood}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === "experience" && (
            <motion.div
              key="controls-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-[100dvh] pointer-events-none z-40"
            >
              <button
                onClick={() => {
                  if (category) {
                    setMenuIndex((prev) => (prev - 1 + MENU_ITEMS[category].length) % MENU_ITEMS[category].length);
                  } else {
                    handlePrevVideo();
                  }
                }}
                className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all pointer-events-auto hover:scale-105 active:scale-95 shadow-lg z-50"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                onClick={() => {
                  if (category) {
                    setMenuIndex((prev) => (prev + 1) % MENU_ITEMS[category].length);
                  } else {
                    handleNextVideo();
                  }
                }}
                className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all pointer-events-auto hover:scale-105 active:scale-95 shadow-lg z-50"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {videoSrc === "/main_page_1_4.mp4" && !category && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex justify-center pointer-events-auto">
                  <button
                    onClick={() => setView("next")}
                    className="font-serif text-4xl text-white hover:text-white/80 transition-colors uppercase tracking-widest hover:scale-105 transition-transform font-bold"
                    style={{ fontFamily: "Moniqa, serif" }}
                  >
                    MENU
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresenceGuard>
      </div>

      {/* Menu Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <div className="bg-[#1a0f0f] border border-[#5d1f27] rounded-3xl p-6 md:p-10 max-w-sm w-full shadow-2xl text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-950/50 text-green-500 flex items-center justify-center mb-4 border border-green-900/50">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-[#e8e4d9] font-serif text-xl mb-2">선택 완료</h3>
            <p className="text-amber-400 font-bold mb-6">{lastSelectedItem}</p>
            <p className="text-[#e8e4d9]/70 text-xs mb-8">
              메뉴가 성공적으로 선택되었습니다.<br />추가 메뉴를 선택하거나 예약을 진행해주세요.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-transparent border border-[#5d1f27] text-[#e8e4d9] font-bold text-sm py-4 rounded-full hover:bg-[#5d1f27]/30 transition-colors shadow-md tracking-widest"
              >
                계속 주문하기
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setVideoSrc("/main_page_1_2.mp4");
                  setView("next");
                }}
                className="flex-1 bg-[#5d1f27] text-[#e8e4d9] font-bold text-sm py-4 rounded-full hover:bg-[#46171d] transition-colors shadow-md tracking-widest"
              >
                메뉴로 가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AnimatePresenceGuard = ({ children }: { children: React.ReactNode }) => {
  const isV0 = useIsV0();

  return isV0 ? <>{children}</> : <AnimatePresence mode="popLayout" propagate>{children}</AnimatePresence>;
};
