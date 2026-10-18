import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MediaItem from "./MediaItem";

const PhoneCardStack = ({ mediaItems, title, description }) => {
  const [topIndex, setTopIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState(null);

  // Deterministic per-card transforms
  const getCardTransforms = (stackPos, cardIdx) => {
    const seed = cardIdx * 123.456;
    const random1 = (Math.sin(seed) + 1) / 2;
    const random2 = (Math.sin(seed * 1.618) + 1) / 2;
    const random3 = (Math.sin(seed * 2.718) + 1) / 2;

    if (stackPos === 0) {
      return { x: 0, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 };
    }

    const baseRotateZ = (random1 - 0.5) * 14;
    const baseRotateY = (random2 - 0.5) * 12;
    const baseRotateX = -8 - stackPos * 3 - random3 * 4;

    const offsetX = (random1 - 0.5) * 8;
    const offsetY = stackPos * 12 + random2 * 6;

    return {
      x: offsetX,
      y: offsetY,
      rotateX: baseRotateX,
      rotateY: baseRotateY,
      rotateZ: baseRotateZ,
      scale: 1 - stackPos * 0.05,
    };
  };

  const getCardIndex = (i) => (topIndex + i) % mediaItems.length;

  const handleSwipe = (direction) => {
    if (isExiting) return;
    setIsExiting(true);
    setExitDirection(direction);
    setTimeout(() => {
      setTopIndex((prev) => (prev + 1) % mediaItems.length);
      setIsExiting(false);
      setExitDirection(null);
    }, 260);
  };

  const visibleStack = [0, 1, 2, 3];

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-sm flex flex-col items-center mb-24 px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-block mb-3 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full border border-primary/40 bg-primary/10 text-primary">
            Gallery
          </span>
          <h1 className="text-2xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {description}
          </p>
        </div>

        {/* Stage */}
        <div className="relative w-full h-[26rem] flex items-center justify-center">
          {/* ambient glow behind stack */}
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
            <div className="h-72 w-72 rounded-full bg-primary/20 blur-[90px]" />
          </div>

          {/* Swipe direction hints */}
          <AnimatePresence>
            {!isExiting && (
              <>
                <motion.div
                  key="hint-left"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 0.5, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.4 }}
                  className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 z-40 text-xs font-bold uppercase tracking-widest text-primary/70"
                >
                  ← Swipe
                </motion.div>
                <motion.div
                  key="hint-right"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.5, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4 }}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 z-40 text-xs font-bold uppercase tracking-widest text-primary/70"
                >
                  Swipe →
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {visibleStack.map((stackPos) => {
            const cardIdx = getCardIndex(stackPos);
            const item = mediaItems[cardIdx];
            const isTop = stackPos === 0;
            const z = visibleStack.length - stackPos;
            const transforms = getCardTransforms(stackPos, cardIdx);

            return (
              <motion.div
                key={item.id + "-" + stackPos + "-" + topIndex}
                className="absolute w-full h-full"
                style={{
                  zIndex: z,
                  pointerEvents: isTop ? "auto" : "none",
                  transformOrigin: "center center",
                  perspective: 1200,
                }}
                initial={false}
                animate={
                  isExiting && isTop
                    ? exitDirection === "left"
                      ? "exitLeft"
                      : "exitRight"
                    : {
                        x: transforms.x,
                        y: transforms.y,
                        rotateX: transforms.rotateX,
                        rotateY: transforms.rotateY,
                        rotateZ: transforms.rotateZ,
                        scale: transforms.scale,
                        opacity: 1,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  mass: 0.8,
                }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.35}
                dragMomentum={false}
                whileDrag={
                  isTop
                    ? {
                        rotateZ: 0,
                        rotateY: 0,
                        scale: 1.06,
                        transition: { duration: 0.1 },
                      }
                    : {}
                }
                onDragEnd={(_, info) => {
                  if (!isTop) return;
                  const swipeThreshold = 80;
                  const velocityThreshold = 300;
                  const shouldSwipe =
                    Math.abs(info.offset.x) > swipeThreshold ||
                    Math.abs(info.velocity.x) > velocityThreshold;
                  if (shouldSwipe) {
                    handleSwipe(info.offset.x > 0 ? "right" : "left");
                  }
                }}
                variants={{
                  exitLeft: {
                    x: -400,
                    y: 100,
                    rotateZ: -45,
                    rotateY: -20,
                    rotateX: -15,
                    scale: 0.8,
                    opacity: 0,
                    transition: {
                      duration: 0.4,
                      ease: [0.4, 0.0, 0.2, 1],
                      type: "tween",
                    },
                  },
                  exitRight: {
                    x: 400,
                    y: 100,
                    rotateZ: 45,
                    rotateY: 20,
                    rotateX: -15,
                    scale: 0.8,
                    opacity: 0,
                    transition: {
                      duration: 0.4,
                      ease: [0.4, 0.0, 0.2, 1],
                      type: "tween",
                    },
                  },
                }}
              >
                {/* Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-muted w-full h-full flex flex-col">
                  {/* image */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <MediaItem
                      item={item}
                      className="w-full h-full object-cover"
                    />
                    {/* soft vignette */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* caption */}
                  <div className="flex-1 flex flex-col justify-end p-4 bg-gradient-to-t from-black via-black/80 to-black/40">
                    <h3 className="text-white text-base font-semibold line-clamp-1 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-white/75 text-xs mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  {/* top sheen */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination dots */}
        <div className="mt-6 flex items-center gap-2">
          {mediaItems.map((_, i) => {
            const active = i === topIndex;
            return (
              <motion.button
                key={i}
                onClick={() => !isExiting && setTopIndex(i)}
                animate={{
                  width: active ? 24 : 6,
                  backgroundColor: active
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted-foreground) / 0.4)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="h-1.5 rounded-full"
                aria-label={`Go to card ${i + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhoneCardStack;