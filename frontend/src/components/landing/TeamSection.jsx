import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
} from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/icons";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Utilities                                                          */
/* ------------------------------------------------------------------ */

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
/* Member Card (Exact original layout)                                */
/* ------------------------------------------------------------------ */

const MemberCard = React.memo(function MemberCard({ member }) {
  return (
    <div className="group relative w-full max-w-[560px]">
      {/* glow behind card on hover */}
      <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-primary/0 blur-3xl transition-all duration-500 group-hover:bg-primary/25" />

      <Card
        className="relative w-full h-[380px] overflow-hidden rounded-2xl
                   border border-border/60 bg-card/70 backdrop-blur-xl
                   shadow-2xl shadow-black/20
                   transition-transform duration-500 will-change-transform
                   group-hover:-translate-y-1"
      >
        {/* top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative w-full h-[210px] overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{
              pointerEvents: "none",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />
          {/* vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        </div>

        <CardContent className="relative -mt-10 pb-5 px-6 flex flex-col flex-1 justify-between">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold text-card-foreground leading-tight tracking-tight">
              {member.name}
            </h3>
            <p className="text-sm text-primary/80 font-medium">
              {member.role}
            </p>
            {member.subdivision && (
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/80">
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
                className="group/btn relative inline-flex items-center justify-center p-2.5 rounded-full
                           bg-secondary/80 text-secondary-foreground
                           hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-500 hover:text-white
                           transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25"
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
                className="group/btn relative inline-flex items-center justify-center p-2.5 rounded-full
                           bg-secondary/80 text-secondary-foreground
                           hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-500 hover:text-white
                           transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
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
/* Cylinder (Exact original math)                                     */
/* ------------------------------------------------------------------ */

const Carousel = React.memo(function Carousel({ cards, rotation }) {
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
        className="relative flex h-full origin-center justify-center"
        style={{
          transform,
          width: carouselConfig.cylinderWidth,
          transformStyle: "preserve-3d",
          // FIX 1: Let clicks pass through the container
          pointerEvents: "none", 
          touchAction: isScreenSizeSm ? "" : "pan-x",
          willChange: "transform",
        }}
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
              // FIX 2: Re-enable clicks for the individual cards
              pointerEvents: "auto",
              // FIX 3: Prevents the 3D bounding box from overlapping other cards
              transformStyle: "flat", 
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
/* ThreeDPhotoCarousel (Original layout + forwardRef for scroll)      */
/* ------------------------------------------------------------------ */

const ThreeDPhotoCarousel = forwardRef(function ThreeDPhotoCarousel(
  { teamMembers },
  ref
) {
  const rotation = useMotionValue(0);
  const isScreenSizeSm = useMediaQuery("(max-width: 640px)");
  const angleStep = 360 / teamMembers.length;

  useImperativeHandle(
    ref,
    () => ({
      navigate: (direction = 1) => {
        const target = rotation.get() + direction * angleStep;
        animate(rotation, target, {
          type: "tween",
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        });
      },
    }),
    [rotation, angleStep]
  );

  const navigateLeft = useCallback(() => {
    animate(rotation, rotation.get() - angleStep, {
      type: "tween",
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    });
  }, [rotation, angleStep]);

  const navigateRight = useCallback(() => {
    animate(rotation, rotation.get() + angleStep, {
      type: "tween",
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    });
  }, [rotation, angleStep]);

  return (
    <motion.div layout className="relative max-w-4xl w-full mx-auto">
      {/* Ambient glow behind carousel */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-72 w-[70%] rounded-full bg-primary/15 blur-[120px]" />
      </div>

      {/* Navigation (mobile) */}
      {isScreenSizeSm && (
        <>
          <button
            onClick={navigateLeft}
            aria-label="Previous member"
            className="group absolute left-3 top-1/2 -translate-y-1/2 z-10
                        p-2.5 rounded-full border border-border/60
                        bg-background/70 backdrop-blur-xl shadow-lg shadow-black/10
                        transition-all duration-200
                        hover:scale-110 hover:bg-background hover:border-primary/50 hover:shadow-primary/20"
          >
            <ChevronLeft className="w-5 h-5 text-foreground transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            onClick={navigateRight}
            aria-label="Next member"
            className="group absolute right-3 top-1/2 -translate-y-1/2 z-10
                        p-2.5 rounded-full border border-border/60
                        bg-background/70 backdrop-blur-xl shadow-lg shadow-black/10
                        transition-all duration-200
                        hover:scale-110 hover:bg-background hover:border-primary/50 hover:shadow-primary/20"
          >
            <ChevronRight className="w-5 h-5 text-foreground transition-transform group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      <div
        data-carousel="true"
        className="relative h-[560px] sm:h-[580px] md:h-[600px] w-full overflow-hidden"
        style={{
          transform: "translateZ(0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {/* drag hint (desktop only) */}
        {!isScreenSizeSm && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
              ← drag or scroll to rotate →
            </span>
          </div>
        )}

        <Carousel cards={teamMembers} rotation={rotation} />
      </div>
    </motion.div>
  );
});

/* ------------------------------------------------------------------ */
/* Wheel wrapper — turns scroll into carousel navigate()              */
/* ------------------------------------------------------------------ */

const WheelableCarousel = ({ children, targetRef, cooldown = 200 }) => {
  const wrapRef = useRef(null);
  const lastStepRef = useRef(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (Math.abs(e.deltaY) < 4) return;

      e.preventDefault();

      const now = performance.now();
      if (now - lastStepRef.current < cooldown) return;
      lastStepRef.current = now;

      const dir = e.deltaY > 0 ? 1 : -1;
      targetRef.current?.navigate?.(dir);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [targetRef, cooldown]);

  return (
    <div
      ref={wrapRef}
      className="relative overscroll-contain"
      style={{ touchAction: "pan-y" }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Team Members Data                                                  */
/* ------------------------------------------------------------------ */

const teamMembers = [
  {
    id: 3,
    name: "Larissa Dabreo",
    role: "Vice Chairperson",
    subdivision: "TE COMPS C",
    image: "/Larissa.jpeg",
    instagram: "https://www.instagram.com/lariiii_2807?cplk=MWh3cm44aWJsaWwxZw%3D%3D&utm_source=qr",
    linkedin: "https://www.linkedin.com/in/larissa-dabreo?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    id: 4,
    name: "Manthan Pagaria",
    role: "SENIOR MANAGEMENT HEAD",
    subdivision: "TE COMPS C",
    image: "/manthan.jpeg",
    instagram: "https://www.instagram.com/manthan_2907/",
    linkedin: "https://www.linkedin.com/in/manthanpagaria/",
  },
  {
    id: 5,
    name: "Bliss Gonsalves",
    role: "SENIOR Event Head",
    subdivision: "TE COMPS C",
    image: "/bliss.jpeg",
    instagram: "https://www.instagram.com/gonsalvesbliss",
    linkedin: "https://www.linkedin.com/in/bliss-gonsalves-923192360",
  },
  {
    id: 6,
    name: "Chris Pereira",
    role: "Senior Tech Lead",
    subdivision: "TE COMPS C",
    image: "/chris.jpeg",
    instagram: "https://www.instagram.com/chrispereira_cp18?mdxt=Y241enZkaWNjM3Jy",
    linkedin: "https://www.linkedin.com/in/chris-pereira-543119330?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    id: 7,
    name: "Alciya Dodti",
    role: "Senior PR head",
    subdivision: "TE COMPS C",
    image: "/alciya.jpeg",
    instagram: "https://www.instagram.com/dodti_alciya/",
    linkedin: "https://www.linkedin.com/in/alciya-dodti-46aa82339/",
  },
  {
    id: 8,
    name: "Wayne Falcao",
    role: "Senior Design Head",
    subdivision: "TE COMPS C",
    image: "/wayne.jpeg",
    instagram: "https://www.instagram.com/wayne_1260?obrf=dGppZWp1aWhoMm83",
    linkedin: "https://www.linkedin.com/in/wayne-falcao-945291330/",
  },
  {
    id: 9,
    name: "CodeStorm Faculty",
    role: "Faculty Incharge",
    subdivision: "",
    image: "/rousni.jpeg",
    instagram: "",
    linkedin: "",
  },
];

const juniorCouncilMembers = [
  {
    id: 11,
    name: "Shubham Yadav",
    role: "Jr. Tech Head",
    subdivision: "SE comps C",
    image: "/subham.jpeg",
    instagram: "https://www.instagram.com/notxshubham_23/",
    linkedin: "https://www.linkedin.com/in/shubham-yadav243/",
  },
  {
    id: 12,
    name: "Zehra Sayed",
    role: "Jr. Media Head",
    subdivision: "SE",
    image: "/zehra.jpeg",
    instagram: "https://www.instagram.com/_zehra.sayed_/",
    linkedin: "https://www.linkedin.com/in/zehra-sayed-8b5a85441/",
  },
  {
    id: 13,
    name: "Farhan Shaikh",
    role: "SE Representative",
    subdivision: "SE COMPS A",
    image: "/farhan.jpeg",
    instagram: "https://www.instagram.com/_.shaikh_.03?exln=YTd2Z3l4eGVuZmFu/",
    linkedin: "https://www.linkedin.com/in/farhan-shaikh-82810637a?utm_source=share_via&utm_content=profile&utm_medium=member_android/",
  },
  {
    id: 14,
    name: "Harishankar Chaudhary",
    role: "Jr Documentation Head",
    subdivision: "SE",
    image: "/harishankar.jpeg",
    instagram: "https://www.instagram.com/_harishankar__2005/",
    linkedin: "https://www.linkedin.com/in/harishankar-chaudhary/",
  },
  {
    id: 15,
    name: "Iris Renoy",
    role: "Jr. Design Head",
    subdivision: "SE",
    image: "/iris.jpeg",
    instagram: "https://www.instagram.com/iris_renoy/",
    linkedin: "https://www.linkedin.com/in/iris-renoy-7b2340423/",
  },
  {
    id: 16,
    name: "Pushkar Jaiswal",
    role: "Jr. PR Head",
    subdivision: "SE CSE A",
    image: "/pushkar.jpeg",
    instagram: "https://www.instagram.com/pushkar_strange4127/",
    linkedin: "https://www.linkedin.com/in/pushkar-jaiswal-b276bb373/",
  },
  {
    id: 17,
    name: "Trinav Sircar",
    role: "Jr. Event Head",
    subdivision: "SE CSE C",
    image: "/trinav.jpeg",
    instagram: "https://www.instagram.com/3navvv/",
    linkedin: "https://www.linkedin.com/in/trinav-sircar/",
  },
];

/* ------------------------------------------------------------------ */
/* Section header                                                    */
/* ------------------------------------------------------------------ */

const SectionHeader = ({ badge, title, subtitle, delay = 0 }) => (
  <motion.div
    className="text-center mb-8"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {badge && (
      <span className="inline-block mb-4 px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full border border-primary/40 bg-primary/10 text-primary">
        {badge}
      </span>
    )}
    <h2 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
      {title}
    </h2>
    {subtitle && (
      <p className="text-lg text-muted-foreground max-w-xl mx-auto">
        {subtitle}
      </p>
    )}
    <span className="mt-5 inline-block h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* Root TeamSection                                                  */
/* ------------------------------------------------------------------ */

const TeamSection = () => {
  const seniorRef = useRef(null);
  const juniorRef = useRef(null);

  return (
    <section
      id="team-section"
      className="relative py-20 px-4 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[10%] h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute right-[5%] top-[45%] h-[320px] w-[320px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="absolute left-[5%] bottom-[10%] h-[280px] w-[280px] rounded-full bg-primary/10 blur-[110px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        <SectionHeader
          badge="Senior Council"
          title="Our Team"
          subtitle="The passionate minds driving CodeStorm forward"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <WheelableCarousel targetRef={seniorRef}>
            <ThreeDPhotoCarousel ref={seniorRef} teamMembers={teamMembers} />
          </WheelableCarousel>
        </motion.div>

        <motion.div
          className="my-16 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
        </motion.div>

        <SectionHeader
          badge="Junior Council"
          title="Rising Talent"
          delay={0.4}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <WheelableCarousel targetRef={juniorRef}>
            <ThreeDPhotoCarousel
              ref={juniorRef}
              teamMembers={juniorCouncilMembers}
            />
          </WheelableCarousel>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;