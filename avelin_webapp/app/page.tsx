"use client";

import { useCallback, useState } from "react";
import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";

export type ViewState = "home" | "next" | "experience" | "transition";

export default function Home() {
  const [videoSrc, setVideoSrc] = useState("/main_page_1_1.mp4");
  const [view, setView] = useState<ViewState>("home");

  const handleVideoEnded = useCallback(() => {
    if ((videoSrc === "/main_page_1_2_1.mp4" || videoSrc === "/main_page_1_FB.mp4") && view === "transition") {
      setView("next");
    } else if (videoSrc === "/main_page_1_2.mp4") {
      setVideoSrc("/main_page_1_4.mp4");
    }
  }, [videoSrc, view]);

  // 해당 영상들은 끝났을 때 이벤트를 감지하여 반복 재생을 막거나 뷰를 변경합니다.
  const shouldListenForEnd =
    videoSrc === "/main_page_1_2_1.mp4" ||
    videoSrc === "/main_page_1_FB.mp4" ||
    videoSrc === "/main_page_1_2.mp4" ||
    videoSrc === "/main_page_1_2_2.mp4";

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
        />
        <Footer view={view} setView={setView} setVideoSrc={setVideoSrc} />
      </div>
    </main>
  );
}
