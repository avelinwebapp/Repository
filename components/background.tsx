"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const getFileExtension = (url: string): string => {
  return url.split(".").pop()?.toLowerCase() || "";
};

const isVideo = (extension: string): boolean => {
  const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "m4v"];
  return videoExtensions.includes(extension);
};

const VideoWithPlaceholder = ({
  src,
  className,
  placeholder,
  onVideoEnded,
}: {
  src: string;
  className?: string;
  placeholder?: string;
  onVideoEnded?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && !placeholder) {
      console.warn("No placeholder provided for video");
    }
  }, [placeholder]);

  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      const handleLoadedData = () => {
        setVideoLoaded(true);
      };
      
      const handleCanPlay = () => {
        setVideoLoaded(true);
      };

      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("canplay", handleCanPlay);
      video.load();
      
      if (video.readyState >= 2) {
        setVideoLoaded(true);
      }
      
      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [src]);

  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.play().catch((e) => console.log("Play failed", e));
    }
  }, [videoLoaded]);

  return (
    <>
      {placeholder ? (
        <Image
          src={placeholder}
          loading="eager"
          priority
          sizes="100vw"
          alt="Background"
          className={cn(className, { invisible: videoLoaded })}
          quality={100}
          fill
        />
      ) : null}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        loop={!onVideoEnded}
        controls={false}
        preload="auto"
        className={cn(className, { invisible: !videoLoaded })}
        onEnded={onVideoEnded}
      />
    </>
  );
};

export const Background = ({
  src,
  placeholder,
  onVideoEnded,
}: {
  src: string;
  placeholder?: string;
  onVideoEnded?: () => void;
}) => {
  const extension = getFileExtension(src);
  const isVideoFile = isVideo(extension);

  const classNames =
    "absolute bg-background left-0 top-0 w-full h-full object-cover rounded-[42px] md:rounded-[72px]";

  return (
    <AnimatePresence>
      <motion.div
        key={src}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full"
      >
        {isVideoFile ? (
          <VideoWithPlaceholder
            src={src}
            className={classNames}
            placeholder={placeholder}
            onVideoEnded={onVideoEnded}
          />
        ) : (
          <Image
            priority
            loading="eager"
            src={src}
            alt="Background"
            className={classNames}
            sizes="100vw"
            fill
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
