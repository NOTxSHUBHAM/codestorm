import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <div
      id="about-section"
      className="relative flex w-full flex-col items-center overflow-hidden px-5 py-24 pb-28 text-foreground sm:px-8 lg:px-10"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[300px] w-[300px] rounded-full bg-accent/20 blur-[100px]" />
      </div>

      {/* Header */}
      <motion.div
        className="mb-10 w-full max-w-6xl text-left"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="page-eyebrow inline-block mb-4 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">
          Who we are
        </span>
        <h2 className="mb-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Think in code.{" "}
          <span className="bg-gradient-to-r from-primary to-orange-300 bg-clip-text text-transparent">
            Grow together.
          </span>
        </h2>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          DSA isn't a hurdle. It's a playground for problem solvers.
        </p>
      </motion.div>

      <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <div className="divide-y divide-border/70 border-y border-border/70">
          {[
            {
              label: "A place to explore",
              text: "A crew of builders, thinkers, and doers—here to make room for big questions and first attempts.",
            },
            {
              label: "Learning without the pressure",
              text: "Problem solving should be exciting, not intimidating. We turn concepts into things you can actually try.",
            },
            {
              label: "Made for doing",
              text: "Logic-driven events, workshops, and community sessions put DSA and technology into practice.",
            },
          ].map((item, index) => (
            <motion.article
              key={item.label}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="grid gap-3 py-6 sm:grid-cols-[4rem_1fr] sm:gap-5 sm:py-7"
            >
              <span className="font-mono text-sm text-primary">0{index + 1}</span>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">{item.label}</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.aside
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative flex min-h-72 flex-col justify-between overflow-hidden rounded-[1.75rem] bg-primary p-7 text-primary-foreground sm:p-9"
        >
          <span className="text-xs font-bold uppercase tracking-[0.18em]">Our point of view</span>
          <div className="relative z-10">
            <p className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Not a checklist. A playground.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/80">
              Build a way of thinking that sticks with you long after the problem is solved.
            </p>
          </div>
          <span aria-hidden="true" className="absolute -bottom-16 -right-3 text-[15rem] font-black leading-none text-white/10">
            {"{"}
          </span>
        </motion.aside>
      </div>

      {/* Dropdown */}
      <motion.div
        className="mt-8 flex w-full max-w-6xl justify-start"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="group relative rounded-full border-primary/40 bg-primary/10 px-6 py-5 text-sm font-semibold transition-all duration-300 hover:bg-primary/15 sm:text-base"
            >
              More info for nerds
              <span className="ml-2 inline-block transition-transform duration-300 group-data-[state=open]:rotate-180">
                ▾
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            sideOffset={12}
            className="max-w-md w-[90vw] md:w-auto p-5 space-y-5 text-left text-sm leading-relaxed rounded-2xl border-border/60 bg-popover/95 backdrop-blur-xl shadow-2xl"
          >
            {[
              {
                title: "What?",
                body: (
                  <>
                    We're CodeStorm — a fresh, student-led council built to make
                    DSA fun, fearless, and logical.
                    <br />
                    Beyond just solving problems, we spark curiosity,
                    creativity, and real understanding of algorithms and logic.
                  </>
                ),
              },
              {
                title: "Why?",
                body: (
                  <>
                    Most students see DSA as a scary checklist for interviews.
                    <br />
                    We believe it should be a playground — a skill to enjoy,
                    explore, and use to think differently, not just grind.
                  </>
                ),
              },
              {
                title: "How?",
                body: (
                  <>
                    By hosting logic-driven events, hands-on workshops, and
                    community sessions that turn abstract concepts into
                    engaging challenges.
                    <br />
                    Plus, we'll gradually explore development, soft skills, and
                    other tech domains — always keeping DSA at the core.
                  </>
                ),
              },
            ].map((item, i, arr) => (
              <div key={item.title}>
                <div className="font-bold mb-1 text-primary">
                  {item.title}
                </div>
                <div className="text-muted-foreground">{item.body}</div>
                {i < arr.length - 1 && (
                  <hr className="mt-4 opacity-20" />
                )}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </div>
  );
};

export default AboutSection;