"use client";

import { useCallback, useEffect, useState } from "react";
import { Background } from "@/components/background";
import { Newsletter } from "@/components/newsletter";
import { Footer } from "@/components/footer";

export type ViewState = "home" | "next" | "experience" | "transition";

export default function Home() {
  const [videoSrc, setVideoSrc] = useState("/main_page_1_1.mp4");
  const [view, setView] = useState<ViewState>("home");
  const [category, setCategory] = useState<"drink" | "food" | null>(null);

  // Parse URL search parameters on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryView = searchParams.get("view") as ViewState | null;
    const queryCategory = searchParams.get("category") as "drink" | "food" | null;

    if (queryView) {
      setView(queryView);
      if (queryView === "experience") {
        setVideoSrc("/main_page_1_3.mp4");
        if (queryCategory) setCategory(queryCategory);
      } else if (queryView === "next") {
        setVideoSrc("/main_page_1_2_2.mp4");
      }
    }
  }, []);

  const handleVideoEnded = useCallback(() => {
    if (view === "transition" && (videoSrc === "/main_page_1_2_1.mp4" || videoSrc === "/main_page_1_FB.mp4" || videoSrc === "/main_page_1_2.mp4")) {
      setView("next");
    } else if (videoSrc === "/main_page_1_3.mp4") {
      // 재생 완료 후 마지막 프레임에 멈춰있도록 유지
    }
  }, [videoSrc, view]);

  // 해당 영상들은 끝났을 때 이벤트를 감지하여 반복 재생을 막거나 뷰를 변경합니다.
  const shouldListenForEnd =
    videoSrc === "/main_page_1_2_1.mp4" ||
    videoSrc === "/main_page_1_FB.mp4" ||
    (videoSrc === "/main_page_1_2.mp4" && view === "transition") ||
    videoSrc === "/main_page_1_2_2.mp4" ||
    videoSrc === "/main_page_1_3.mp4";

  return (
    <main className="p-inset h-[100dvh] w-full">
      <div className="relative h-full w-full">
        <Background
          src={videoSrc}
          placeholder="/main_page_1_1.jpg"
          onVideoEnded={shouldListenForEnd ? handleVideoEnded : undefined}
        />
        <Newsletter
          videoSrc={videoSrc}
          setVideoSrc={setVideoSrc}
          view={view}
          setView={setView}
          category={category}
          setCategory={setCategory}
        />
        {view === "home" && <Footer />}
      </div>
    </main>
  );
}
