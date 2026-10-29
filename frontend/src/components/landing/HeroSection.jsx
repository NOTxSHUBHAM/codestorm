import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Braces, Code2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Terminal from "./Terminal";

const snapshots = [
  {
    src: "/hackathon/hackathon-1.jpeg",
    alt: "Students taking part in a CodeStorm hackathon",
    className: "left-0 top-8 h-64 w-[68%] sm:h-80",
  },
  {
    src: "/monster/monster-2.jpeg",
    alt: "CodeStorm campus challenge",
    className: "right-0 top-0 h-40 w-[44%] sm:h-52",
  },
  {
    src: "/escape/escape-2.jpeg",
    alt: "Students solving an escape room challenge",
    className: "bottom-0 right-[5%] h-44 w-[53%] sm:h-56",
  },
];

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pb-24 lg:min-h-[90vh] lg:px-12 lg:pt-36"
    >
      <div className="pointer-events-none absolute -right-36 top-24 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-[110px]" />
      <div className="pointer-events-none absolute left-[-10rem] top-[30rem] h-80 w-80 rounded-full bg-primary/[0.07] blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.95fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Student-led tech community · CRCE
          </div>

          <h1 className="max-w-3xl text-[3.55rem] font-black leading-[0.92] tracking-[-0.075em] text-foreground sm:text-7xl lg:text-[6.8rem]">
            Make ideas
            <span className="block text-primary">happen<span className="text-foreground">.</span></span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            We turn curiosity into capability—with code, challenges, and a
            community that makes learning feel like the best part.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/quiz")}
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
            >
              Start quiz
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="mt-12 flex items-center gap-3 border-t border-border/70 pt-6">
            <div className="flex -space-x-3" aria-hidden="true">
              {["/subham.jpeg", "/iris.jpeg", "/wayne.jpeg", "/farhan.jpeg"].map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Made by students, for students</p>
              <p className="text-xs text-muted-foreground">Find your people. Build your thing.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="relative mx-auto h-[27rem] w-full max-w-[36rem] sm:h-[34rem]"
        >
          <div className="absolute inset-x-8 bottom-4 top-12 rotate-[-5deg] rounded-[2rem] bg-primary" />
          <div className="absolute inset-x-8 bottom-4 top-12 overflow-hidden rounded-[2rem] border border-white/10 bg-[#181512] shadow-2xl">
            <img
              src="/gallery/gallery-1.jpeg"
              alt="CodeStorm members at a campus event"
              className="h-full w-full object-cover opacity-75"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 z-30 w-[82%] max-w-sm rounded-2xl border border-white/10 bg-[#11100f] p-5 shadow-2xl sm:bottom-7 sm:left-7 sm:p-6">
              <p className="page-eyebrow">Together, we figure it out</p>
              <p className="mt-2 text-xl font-bold leading-tight text-white sm:text-2xl">
                Good questions make great beginnings.
              </p>
            </div>
          </div>

          {snapshots.map((snapshot, index) => (
            <motion.div
              key={snapshot.src}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 + index * 0.12 }}
              className={`absolute z-10 overflow-hidden rounded-2xl border-[5px] border-background shadow-2xl ${snapshot.className}`}
            >
              <img src={snapshot.src} alt={snapshot.alt} className="h-full w-full object-cover" loading="lazy" />
            </motion.div>
          ))}

          <div className="absolute -left-2 top-1/2 z-20 hidden -translate-y-1/2 items-center gap-3 rounded-2xl border border-border/70 bg-card/95 p-4 shadow-xl backdrop-blur md:flex">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Braces className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-foreground">Curiosity → code</span>
              <span className="text-xs text-muted-foreground">The CodeStorm way</span>
            </span>
          </div>
          <div className="absolute -bottom-3 right-2 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg">
            <Code2 className="h-6 w-6" />
          </div>
        </motion.div>
      </div>

      <button
        onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })}
        className="mx-auto mt-12 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-primary"
      >
        Discover CodeStorm <ArrowDown className="h-4 w-4" />
      </button>

      <section
        aria-label="Interactive terminal playground"
        className="mx-auto mt-12 grid max-w-7xl gap-6 rounded-[2rem] border border-border/60 bg-card/40 p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"
      >
        <div className="px-2 py-4">
          <p className="page-eyebrow">A small taste of the playground</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Say hello to your terminal.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Try a command, explore the interface, and get comfortable making
            things happen one line at a time.
          </p>
        </div>
        <Terminal autoFocus={false} />
      </section>
    </section>
  );
}
