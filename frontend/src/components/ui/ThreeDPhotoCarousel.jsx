import {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/icons";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const useMediaQuery = (
  query,
  { defaultValue = false, initializeWithValue = true } = {}
) => {
  const IS_SERVER = typeof window === "undefined";

  const getMatches = (query) => {
    if (IS_SERVER) return defaultValue;
    return window.matchMedia(query);
  };

  const [matches, setMatches] = useState(() =>
    initializeWithValue ? getMatches(query) : defaultValue
  );

  const handleChange = () => setMatches(getMatches(query));

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);
    handleChange();
    matchMedia.addEventListener("change", handleChange);
    return () => matchMedia.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};

/* ------------------------------------------------------------------ */
/* Member card                                                        */
/* ------------------------------------------------------------------ */

const MemberCard = memo(function MemberCard({ member }) {
  return (
    <div className="group relative w-full max-w-[560px]">
      {/* glow behind card on hover */}
      <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-primary/0 blur-3xl transition-all duration-500 group-hover:bg-primary/30" />

      <Card
        className="relative w-full h-[400px] overflow-hidden rounded-3xl
                   border border-border/60 bg-card/80 backdrop-blur-xl
                   shadow-2xl shadow-black/30
                   transition-all duration-500 will-change-transform
                   group-hover:-translate-y-1 group-hover:border-primary/40"
      >
        {/* top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="relative w-full h-[220px] overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{
              pointerEvents: "none",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />
          {/* vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

          {/* small sparkle badge */}
          <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-background/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="h-3 w-3" />
            CodeStorm
          </div>
        </div>

        <CardContent className="relative -mt-10 pb-5 px-6 flex flex-col flex-1 justify-between">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-card-foreground leading-tight tracking-tight">
              {member.name}
            </h3>
            <p className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {member.role}
            </p>
            {member.subdivision && (
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                {member.subdivision}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-center mt-5">
            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-2.5 rounded-full
                           bg-secondary/80 text-secondary-foreground border border-border/60
                           hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent
                           transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30"
                onClick={(e) => e.stopPropagation()}
                aria-label={`${member.name}'s Instagram`}
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-2.5 rounded-full
                           bg-secondary/80 text-secondary-foreground border border-border/60
                           hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-600 hover:text-white hover:border-transparent
                           transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30"
                onClick={(e) => e.stopPropagation()}
                aria-label={`${member.name}'s LinkedIn`}
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Cylinder                                                           */
/* ------------------------------------------------------------------ */

const Carousel = memo(function Carousel({
  controls,
  cards,
  isCarouselActive,
  rotation,
}) {
  const isScreenSizeSm = useMediaQuery("(max-width: 640px)");
  const isScreenSizeMd = useMediaQuery("(max-width: 1024px)");

  const carouselConfig = useMemo(() => {
    const cylinderWidth = isScreenSizeSm ? 2400 : isScreenSizeMd ? 3400 : 4200;
    const faceCount = cards.length;
    const fixedFaceCount = 8;
    const faceWidth = cylinderWidth / fixedFaceCount;
    const radius = (cylinderWidth / (2 * Math.PI)) * 1.2;
    const angleStep = 360 / faceCount;

    return {
      cylinderWidth,
      faceCount,
      faceWidth,
      radius,
      angleStep,
      dragSensitivity: isScreenSizeSm ? 0.02 : 0.015,
      velocityMultiplier: isScreenSizeSm ? 0.03 : 0.015,
    };
  }, [isScreenSizeSm, isScreenSizeMd, cards.length]);

  const transform = useTransform(
    rotation,
    (value) => `rotate3d(0, 1, 0, ${value}deg)`
  );

  return (
    <div
      className="flex h-full items-center justify-center"
      style={{
        perspective: "2400px",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <motion.div
        className={`relative flex h-full origin-center justify-center ${
          !isScreenSizeSm ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        style={{
          transform,
          rotateY: rotation,
          width: carouselConfig.cylinderWidth,
          transformStyle: "preserve-3d",
          pointerEvents: "auto",
          touchAction: isScreenSizeSm ? "" : "pan-x",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
        animate={controls}
      >
        {cards.map((member, i) => (
          <motion.div
            key={`member-${member.id}`}
            className="absolute flex h-full origin-center items-center justify-center p-3"
            style={{
              width: `${carouselConfig.faceWidth}px`,
              transform: `rotateY(${
                i * carouselConfig.angleStep
              }deg) translateZ(${carouselConfig.radius}px)`,
              pointerEvents: "auto",
            }}
          >
            <MemberCard member={member} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Root                                                               */
/* ------------------------------------------------------------------ */

function ThreeDPhotoCarousel({ teamMembers }) {
  const [isCarouselActive, setIsCarouselActive] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const controls = useAnimation();
  const rotation = useMotionValue(0);
  const isScreenSizeSm = useMediaQuery("(max-width: 640px)");

  const targetRotation = useRef(0);
  const isInitialized = useRef(false);

  const angleStep = 360 / teamMembers.length;

  useLayoutEffect(() => {
    if (!isInitialized.current && teamMembers.length > 0) {
      rotation.set(0);
      targetRotation.current = 0;
      isInitialized.current = true;
    }
  }, [rotation, teamMembers.length]);

  const navigate = useCallback(
    async (direction) => {
      if (isAnimating || !isInitialized.current) return;
      setIsAnimating(true);
      targetRotation.current += direction * angleStep;
      await animate(rotation, targetRotation.current, {
        type: "tween",
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      });
      setIsAnimating(false);
    },
    [rotation, angleStep, isAnimating]
  );

  const navigateLeft = useCallback(() => navigate(1), [navigate]);
  const navigateRight = useCallback(() => navigate(-1), [navigate]);

  return (
    <motion.div layout className="relative max-w-4xl w-full mx-auto">
      {/* Ambient glow behind carousel */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-80 w-[75%] rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute h-56 w-[45%] translate-y-6 rounded-full bg-accent/15 blur-[120px]" />
      </div>

      {/* Navigation */}
      {isScreenSizeSm && (
        <>
          <button
            onClick={navigateLeft}
            disabled={isAnimating}
            aria-label="Previous member"
            className={`group absolute left-3 top-1/2 -translate-y-1/2 z-10
                        p-2.5 rounded-full border border-border/60
                        bg-background/70 backdrop-blur-xl shadow-lg shadow-black/10
                        transition-all duration-200
                        ${
                          isAnimating
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:scale-110 hover:bg-background hover:border-primary/50 hover:shadow-primary/20"
                        }`}
          >
            <ChevronLeft className="w-5 h-5 text-foreground transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            onClick={navigateRight}
            disabled={isAnimating}
            aria-label="Next member"
            className={`group absolute right-3 top-1/2 -translate-y-1/2 z-10
                        p-2.5 rounded-full border border-border/60
                        bg-background/70 backdrop-blur-xl shadow-lg shadow-black/10
                        transition-all duration-200
                        ${
                          isAnimating
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:scale-110 hover:bg-background hover:border-primary/50 hover:shadow-primary/20"
                        }`}
          >
            <ChevronRight className="w-5 h-5 text-foreground transition-transform group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      <div
        data-carousel="true"
        className="relative h-[560px] sm:h-[600px] md:h-[640px] w-full overflow-hidden"
        style={{
          transform: "translateZ(0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {!isScreenSizeSm && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
              ← drag to rotate →
            </span>
          </div>
        )}

        <Carousel
          controls={controls}
          cards={teamMembers}
          isCarouselActive={isCarouselActive}
          rotation={rotation}
        />
      </div>
    </motion.div>
  );
}

export { ThreeDPhotoCarousel };