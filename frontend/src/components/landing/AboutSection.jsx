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
      className="relative text-foreground py-20 px-4 flex flex-col items-center pb-32 w-full overflow-hidden"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[300px] w-[300px] rounded-full bg-accent/20 blur-[100px]" />
      </div>

      {/* Header */}
      <motion.div
        className="w-full max-w-4xl text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block mb-4 px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full border border-primary/40 bg-primary/10 text-primary">
          Who we are
        </span>
        <h2 className="text-5xl md:text-6xl font-extrabold mb-5 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
          CodeStorm.
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          DSA isn't a hurdle. It's a playground for problem solvers.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {[
          {
            label: "Who?",
            text: "A crew of builders, thinkers, and doers—here to change the vibe.",
          },
          {
            label: "Why?",
            text: "Because problem solving should be exciting, not intimidating.",
          },
          {
            label: "What?",
            text: "We make DSA and tech fun—through events, challenges, and community.",
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative bg-card/70 backdrop-blur-sm border border-border/60 rounded-2xl flex flex-col h-full p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 overflow-hidden"
          >
            {/* glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            </div>

            <span className="relative text-xl font-bold mb-3 text-primary">
              {card.label}
            </span>
            <p className="relative text-lg text-card-foreground/90">
              {card.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Dropdown */}
      <motion.div
        className="mt-12 w-full flex justify-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="group relative text-base font-semibold px-7 py-5 rounded-full border-primary/40 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
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