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
              className="w-full flex justify-center"
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
              key={`${category}-overlay`}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="absolute inset-0 flex pointer-events-none z-40 overflow-hidden"
            >
              <div className="absolute top-8 left-8 md:top-12 md:left-12 z-50 pointer-events-auto">
                <button
                  onClick={() => {
                    setCategory(null);
                    setView("next");
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white/70 hover:text-white transition-all shadow-lg active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm font-bold tracking-wider">메뉴로 돌아가기</span>
                </button>
              </div>

              <div className="absolute inset-0 flex flex-col xl:flex-row items-center justify-center w-full h-full pointer-events-none mt-12 md:mt-0">
                <AnimatePresence mode="wait">
                  {category && MENU_ITEMS[category].length > 0 && (
                    <motion.div
                      key={MENU_ITEMS[category][menuIndex].id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(event, info) => {
                        const swipeThreshold = 50;
                        if (info.offset.x < -swipeThreshold) {
                          setMenuIndex((prev) => (prev + 1) % MENU_ITEMS[category].length);
                        } else if (info.offset.x > swipeThreshold) {
                          setMenuIndex((prev) => (prev - 1 + MENU_ITEMS[category].length) % MENU_ITEMS[category].length);
                        }
                      }}
                      className="relative w-[90vw] md:w-[850px] lg:w-[950px] h-auto flex flex-col bg-[#f5f1e8] shadow-2xl overflow-hidden rounded-sm select-none pointer-events-auto"
                    >
                      <div className="flex flex-col md:flex-row w-full flex-1">
                        {/* Left Image Section */}
                        <div className="relative w-full md:w-2/5 lg:w-1/2 h-[250px] md:h-auto md:min-h-[400px] bg-[#5d1f27] flex items-center justify-center pointer-events-none overflow-hidden">
                          <span className="absolute top-4 left-6 font-serif text-3xl md:text-4xl text-[#e8e4d9] tracking-widest z-10 drop-shadow-md">
                            {MENU_ITEMS[category][menuIndex].number}
                          </span>
                          <div className="absolute inset-0 w-full h-full">
                            <Image
                              src={MENU_ITEMS[category][menuIndex].image}
                              alt={MENU_ITEMS[category][menuIndex].name}
                              fill
                              className="object-cover"
                              priority
                              draggable="false"
                            />
                          </div>
                        </div>

                        {/* Right Text Section */}
                        <div className="flex flex-col flex-1 p-6 md:p-8 justify-between text-[#3f2a1d]">
                          <div>
                            <h3 className="font-serif text-3xl md:text-4xl mb-4 border-b border-[#d1c8b8] pb-4 tracking-tight">
                              {MENU_ITEMS[category][menuIndex].name}
                            </h3>

                            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 text-[9px] md:text-[10px] font-sans leading-tight">
                              <div>
                                <p className="font-bold mb-1 uppercase tracking-wider text-[#735e51]">Notes:</p>
                                <p>{MENU_ITEMS[category][menuIndex].notes}</p>
                              </div>
                              <div>
                                <p className="font-bold mb-1 uppercase tracking-wider text-[#735e51]">Depth:</p>
                                <p>{MENU_ITEMS[category][menuIndex].depth}</p>
                              </div>
                              <div>
                                <p className="font-bold mb-1 uppercase tracking-wider text-[#735e51]">Volume:</p>
                                <p>{MENU_ITEMS[category][menuIndex].volume}</p>
                              </div>
                            </div>

                            <p className="font-serif text-[12px] md:text-[13px] leading-relaxed mb-2 md:mb-4">
                              {MENU_ITEMS[category][menuIndex].description}
                            </p>
                          </div>

                          <div className="flex justify-between items-end mt-4">
                            <span className="font-serif text-3xl md:text-4xl tracking-tighter">
                              {MENU_ITEMS[category][menuIndex].price}
                            </span>
                          </div>
                        </div>

                        {/* Order Sidebar Section */}
                        <div className="flex flex-row md:flex-col items-center justify-between md:justify-center w-full md:w-32 lg:w-40 bg-[#f5f1e8] md:bg-transparent border-t md:border-t-0 md:border-l border-[#d1c8b8] p-6 md:p-8 shrink-0">
                          <div className="flex flex-row md:flex-col-reverse items-center gap-4 text-[#5d1f27]">
                            <button
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="w-10 h-10 rounded-full border border-[#5d1f27]/30 hover:bg-[#5d1f27]/10 flex items-center justify-center transition-colors"
                            >
                              <ChevronLeft className="w-5 h-5 md:hidden" />
                              <ChevronDown className="w-5 h-5 hidden md:block" />
                            </button>
                            <span className="font-serif text-2xl font-bold">{quantity}</span>
                            <button
                              onClick={() => setQuantity(quantity + 1)}
                              className="w-10 h-10 rounded-full border border-[#5d1f27]/30 hover:bg-[#5d1f27]/10 flex items-center justify-center transition-colors"
                            >
                              <ChevronRight className="w-5 h-5 md:hidden" />
                              <ChevronUp className="w-5 h-5 hidden md:block" />
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              const item = MENU_ITEMS[category][menuIndex];
                              const orderName = `${item.name} x${quantity}`;
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
                              setLastSelectedItem(orderName);
                              setShowConfirmModal(true);
                            }}
                            className="bg-[#5d1f27] text-[#e8e4d9] font-bold text-sm md:text-base py-3 px-8 md:py-4 md:px-0 md:w-full rounded-full hover:bg-[#46171d] transition-colors shadow-md md:mt-8 tracking-widest uppercase"
                          >
                            선택
                          </button>
                        </div>
                      </div>

                      {/* Footer Bar */}
                      <div className="w-full h-8 md:h-10 bg-[#5d1f27] flex justify-between items-center px-4 md:px-6 text-[#e8e4d9] font-sans text-[8px] md:text-[9px]">
                        <div className="flex flex-col">
                          <p>www.avelin.com</p>

                        </div>
                        <p className="font-serif text-xs md:text-sm tracking-widest font-bold">AVELIN CAFE</p>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

                {/* External Order Controls removed in favor of integrated sidebar */}
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
                className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all pointer-events-auto hover:scale-105 active:scale-95 shadow-lg z-50"
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
                className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all pointer-events-auto hover:scale-105 active:scale-95 shadow-lg z-50"
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
              메뉴가 성공적으로 선택되었습니다.<br/>추가 메뉴를 선택하거나 예약을 진행해주세요.
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
