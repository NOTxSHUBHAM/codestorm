import { motion } from "framer-motion";
import { useState } from "react";
import Terminal from "./Terminal";
import SignInModal from "./SignInModal";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const navigate = useNavigate();

  const headingText = {
    mobile: "Skip Leetcode?",
    desktop: "Who Needs Leetcode?",
  };

  return (
    <div id="home" className="dark relative min-h-screen text-foreground overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* radial fade */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
        {/* glow blobs */}
        <div className="absolute left-1/2 top-[10%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute left-[10%] bottom-[10%] h-[320px] w-[320px] rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute right-[5%] top-[30%] h-[280px] w-[280px] rounded-full bg-primary/15 blur-[110px]" />
        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.06] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-32 pt-40">
        <div className="text-center mb-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            CodeStorm
          </motion.div>

          <h1
            id="hero-heading"
            className="relative z-10 mx-auto max-w-4xl text-center text-4xl sm:text-5xl font-extrabold md:text-5xl lg:text-7xl"
          >
            {/* Mobile heading */}
            <span className="block md:hidden">
              {headingText.mobile.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(6px)", y: 12 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="inline-block bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent"
                  style={{ marginRight: word === "Leetcode?" ? "0" : "1rem" }}
                >
                  {word}
                </motion.span>
              ))}
            </span>

            {/* Desktop heading */}
            <span className="hidden md:block">
              {headingText.desktop.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(6px)", y: 12 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mr-4 inline-block bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="relative z-10 mx-auto max-w-xl py-8 text-center text-lg font-normal text-muted-foreground"
          >
            80% of the interviews for the technical roles are based on Leetcode
            and problem-solving. Join us to wake others up from their slumber.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/round-1/branch-selection")}
              className="group relative w-60 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                View Quiz
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </motion.button>

            <motion.button
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group w-60 rounded-xl border border-border/60 bg-secondary/60 px-6 py-3 font-semibold text-secondary-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-secondary/80"
              onClick={() => navigate("/blogs")}
            >
              <span className="flex items-center justify-center gap-2">
                Read Blogs
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="relative z-10 w-full"
        >
          <Terminal />
        </motion.div>
      </div>

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </div>
  );
}