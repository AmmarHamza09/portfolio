"use client";

import { Flex, RevealFx, Scroller } from "@/once-ui/components";
import { useEffect, useState, useRef } from "react";

interface Video {
  src: string;
  title?: string;
}

const videoLinks: Video[] = [
  { src: "https://drive.google.com/file/d/1hQUrCUO-efxRi1qr1xi1TZjQNUxIn_sR/view", title: "Video 1" },
  { src: "https://drive.google.com/file/d/1DeAGfM7jzoU3m9knPYxGG8Q6tnqLBVTF/view?usp=drive_link", title: "Video 2" },
  { src: "https://drive.google.com/file/d/18VK3TRzTVolo8pWMK44HivRbAaaKp2ie/view?usp=drive_link ", title: "Video 3" },
  { src: "https://drive.google.com/uc?export=download&id=VIDEO_ID_4", title: "Video 4" }
];

interface VideoCarouselProps extends React.ComponentProps<typeof Flex> {
  videos?: Video[];
  indicator?: "line" | "thumbnail";
  aspectRatio?: string;
  revealedByDefault?: boolean;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({
  videos = videoLinks,
  indicator = "line",
  aspectRatio = "16 / 9",
  revealedByDefault = false,
  ...rest
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(revealedByDefault);
  const [initialTransition, setInitialTransition] = useState(revealedByDefault);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleVideoClick = () => {
    if (videos.length > 1) {
      const nextIndex = (activeIndex + 1) % videos.length;
      handleControlClick(nextIndex);
    }
  };

  const handleControlClick = (nextIndex: number) => {
    if (nextIndex !== activeIndex && !transitionTimeoutRef.current) {
      setIsTransitioning(false);

      transitionTimeoutRef.current = setTimeout(() => {
        setActiveIndex(nextIndex);

        setTimeout(() => {
          setIsTransitioning(true);
          transitionTimeoutRef.current = undefined;
        }, 300);
      }, 800);
    }
  };

  useEffect(() => {
    if (!revealedByDefault && !initialTransition) {
      setIsTransitioning(true);
      setInitialTransition(true);
    }
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [revealedByDefault, initialTransition]);

  if (videos.length === 0) {
    return null;
  }

  return (
    <Flex fillWidth gap="12" direction="column" {...rest}>
      <RevealFx
        onClick={handleVideoClick}
        fillWidth
        trigger={isTransitioning}
        translateY="16"
        aspectRatio={aspectRatio}
        speed="fast"
      >
        <video
          controls
          style={{ width: "100%", borderRadius: "var(--radius-l)" }}
          src={videos[activeIndex]?.src}
        />
      </RevealFx>
      {videos.length > 1 && (
        <>
          {indicator === "line" ? (
            <Flex gap="4" paddingX="s" fillWidth horizontal="center">
              {videos.map((_, index) => (
                <Flex
                  key={index}
                  onClick={() => handleControlClick(index)}
                  style={{
                    background:
                      activeIndex === index
                        ? "var(--neutral-on-background-strong)"
                        : "var(--neutral-alpha-medium)",
                    transition: "background 0.3s ease",
                  }}
                  cursor="interactive"
                  fillWidth
                  height="2"
                ></Flex>
              ))}
            </Flex>
          ) : (
            <Scroller fillWidth gap="4" onItemClick={handleControlClick}>
              {videos.map((video, index) => (
                <Flex
                  key={index}
                  style={{
                    border: activeIndex === index ? "2px solid var(--brand-solid-strong)" : "none",
                    borderRadius: "var(--radius-m-nest-4)",
                    transition: "border 0.3s ease",
                  }}
                  cursor="interactive"
                  padding="4"
                  width="80"
                  height="80"
                >
                  <video
                    src={video.src}
                    style={{ width: "100%", height: "100%", borderRadius: "var(--radius-m)" }}
                  />
                </Flex>
              ))}
            </Scroller>
          )}
        </>
      )}
    </Flex>
  );
};

VideoCarousel.displayName = "VideoCarousel";
export { VideoCarousel };
