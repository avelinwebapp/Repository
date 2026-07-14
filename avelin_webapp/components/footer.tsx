import { buttonVariants } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";
import { Smartphone, QrCode, Home, ArrowLeft } from "lucide-react";
import type { ViewState } from "@/app/page";

interface FooterProps {
  view?: ViewState | "place";
  setView?: (v: ViewState) => void;
  setVideoSrc?: (src: string) => void;
  className?: string;
}

export const Footer = ({ view = "home", setView, setVideoSrc, className }: FooterProps) => {
  const handleHome = () => {
    if (setView && setVideoSrc) {
      setView("home");
      setVideoSrc("/main_page_1_1.mp4");
    }
  };

  const handleBack = () => {
    if (setView && setVideoSrc) {
      if (view === "experience" || view === "transition") {
        setView("next");
        setVideoSrc("/main_page_1_2_2.mp4");
      } else if (view === "next") {
        setView("home");
        setVideoSrc("/main_page_1_1.mp4");
      } else if (view === "place") {
        setView("next");
        setVideoSrc("/main_page_1_2_2.mp4");
      }
    }
  };

  return (
    <div className={className || "flex gap-4 sm:gap-6 items-center absolute top-[calc(var(--inset)+0.8rem)] md:top-[calc(var(--inset)+1.5rem)] left-1/2 -translate-x-1/2 z-50"}>
      {view !== "home" && (
        <button
          onClick={handleBack}
          className={buttonVariants({ size: "icon-xl" })}
          title="이전 단계"
        >
          <ArrowLeft className="size-6" />
        </button>
      )}

      {view !== "home" && (
        <button
          onClick={handleHome}
          className={buttonVariants({ size: "icon-xl" })}
          title="홈으로"
        >
          <Home className="size-6" />
        </button>
      )}

      <Dialog>
        <DialogTrigger className={buttonVariants({ size: "icon-xl" })}>
          <Smartphone className="size-6" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8 border-white/10 bg-black/50 backdrop-blur-xl">
          <DialogTitle className="sr-only">QR Code Access</DialogTitle>
          <QrCode className="size-48 text-white/80 mb-4" />
          <p className="text-center text-sm text-white/60">
            Scan to enter the Avelin System
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};
