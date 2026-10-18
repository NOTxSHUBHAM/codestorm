import React, { useEffect, useRef, useState } from "react";

const MediaItem = ({ item, className, onClick }) => {
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  const hasObjectFitClass = /\bobject-(cover|contain|fill|none|scale-down)\b/.test(
    className || ""
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "50px",
      threshold: 0.1,
    };

    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsInView(entry.isIntersecting);
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const handleVideoPlay = async () => {
      if (!videoRef.current || !isInView || !mounted) return;

      try {
        if (videoRef.current.readyState >= 3) {
          setIsBuffering(false);
          await videoRef.current.play();
        } else {
          setIsBuffering(true);
          await new Promise((resolve) => {
            if (videoRef.current) {
              videoRef.current.oncanplay = resolve;
            }
          });
          if (mounted) {
            setIsBuffering(false);
            await videoRef.current.play();
          }
        }
      } catch (error) {
        // autoplay rejected or interrupted — ignore
      }
    };

    if (isInView) {
      handleVideoPlay();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }

    return () => {
      mounted = false;
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      }
    };
  }, [isInView]);

  /* ---------- VIDEO ---------- */
  if (item.type === "video") {
    return (
      <div className={`${className} relative overflow-hidden bg-black`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onClick={onClick}
          playsInline
          muted
          loop
          preload="auto"
          style={{
            opacity: isBuffering ? 0.6 : 1,
            transition: "opacity 0.35s ease",
            transform: "translateZ(0)",
            willChange: "transform, opacity",
          }}
        >
          <source src={item.url} type="video/mp4" />
        </video>

        {isBuffering && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
              <span className="absolute h-10 w-10 rounded-full bg-primary/20 blur-md" />
              <span className="relative h-7 w-7 rounded-full border-2 border-white/25 border-t-white animate-spin" />
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ---------- IMAGE ---------- */
  return <ImageItem item={item} className={className} onClick={onClick} hasObjectFitClass={hasObjectFitClass} />;
};

/* Small subcomponent so hooks are only used for images */
const ImageItem = ({ item, className, onClick, hasObjectFitClass }) => {
  const [status, setStatus] = useState("loading"); // loading | loaded | error

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={onClick}>
      {/* shimmer placeholder */}
      {status === "loading" && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40 animate-pulse" />
      )}

      {status === "error" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 text-muted-foreground text-xs">
          Failed to load
        </div>
      ) : (
        <img
          src={item.url || "/placeholder.svg"}
          alt={item.title}
          className={`w-full h-full ${
            hasObjectFitClass ? "" : "object-cover"
          } cursor-pointer transition-transform duration-500 ease-out will-change-transform hover:scale-[1.03]`}
          style={{
            objectFit: item.fit || undefined,
            objectPosition: item.position || undefined,
            opacity: status === "loaded" ? 1 : 0,
            transition: "opacity 0.4s ease, transform 0.5s ease-out",
          }}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      )}
    </div>
  );
};

export default MediaItem;