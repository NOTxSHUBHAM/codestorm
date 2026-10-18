import React, { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  const navItems = [
    {
      label: "Home",
      onClick: () =>
        document
          .getElementById("home")
          ?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      label: "About",
      onClick: () =>
        document
          .getElementById("about-section")
          ?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      label: "Team",
      onClick: () =>
        document
          .getElementById("team-section")
          ?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      label: "Events",
      onClick: () =>
        document
          .getElementById("events-section")
          ?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      label: "Gallery",
      onClick: () =>
        document
          .getElementById("gallery-section")
          ?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      label: "Blogs",
      onClick: () => navigate("/blogs"),
    },
  ];

  const handleNavClick = (item) => {
    item.onClick();
    setMobileMenuOpen(false);
  };

  const handleContactUsClick = () => {
    document
      .getElementById("contact-section")
      ?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  // Shared motion style for the wrapper
  const wrapperMotion = {
    animate: {
      y: visible ? 12 : 0,
      backgroundColor: visible ? "rgba(10,10,12,0.72)" : "rgba(10,10,12,0)",
      borderColor: visible
        ? "rgba(255,255,255,0.10)"
        : "rgba(255,255,255,0)",
      boxShadow: visible
        ? "0 12px 40px -12px rgba(0,0,0,0.6)"
        : "0 0px 0px rgba(0,0,0,0)",
      backdropFilter: visible ? "blur(20px)" : "blur(0px)",
    },
    transition: { type: "spring", stiffness: 320, damping: 30 },
  };

  return (
    <motion.div
      ref={ref}
      className="fixed inset-x-0 top-0 md:top-2 z-50 max-w-5xl mx-auto"
    >
      {/* ---------- Desktop ---------- */}
      <motion.div
        {...wrapperMotion}
        className="relative z-[60] mx-auto hidden w-full max-w-7xl items-center justify-between rounded-2xl border px-5 py-3 md:flex"
      >
        {/* top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* Brand */}
        <motion.div
          animate={{ scale: visible ? 0.94 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="group flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-primary/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              src="/logo.png"
              alt="CodeStorm Logo"
              className="relative w-8 h-8"
            />
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-foreground">
            Code
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Storm
            </span>
          </h1>
        </motion.div>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navItems.map((item, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleNavClick(item)}
              className="group relative px-3 py-2 text-sm lg:text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              whileHover={{ y: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {item.label}
              {/* underline */}
              <span className="pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-300 group-hover:scale-x-100" />
            </motion.button>
          ))}
        </nav>

        {/* CTA */}
        <motion.button
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          onClick={handleContactUsClick}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            Contact Us
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          {/* shimmer */}
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </motion.button>
      </motion.div>

      {/* ---------- Mobile bar ---------- */}
      <motion.div
        {...wrapperMotion}
        className="md:hidden flex items-center justify-between px-4 py-3 mt-4 mx-4 rounded-2xl border"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <motion.div
          animate={{ scale: visible ? 0.94 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/logo.png" alt="CodeStorm Logo" className="w-6 h-6" />
          <h1 className="text-lg font-extrabold tracking-tight text-foreground">
            Code
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Storm
            </span>
          </h1>
        </motion.div>

        <motion.button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
          className="relative text-foreground p-2 rounded-lg hover:bg-muted/40 transition-colors"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileMenuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                <Menu className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* ---------- Mobile menu sheet ---------- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4"
          >
            <div className="relative rounded-2xl border border-border/60 bg-black/85 backdrop-blur-2xl p-2 shadow-2xl overflow-hidden">
              {/* top sheen */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              {navItems.map((item, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => handleNavClick(item)}
                  className="group flex w-full items-center justify-between text-left text-muted-foreground hover:text-foreground py-3 px-3 rounded-xl hover:bg-muted/40 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-[15px] font-medium">{item.label}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </motion.button>
              ))}

              <div className="px-1 pt-2 pb-1">
                <motion.button
                  onClick={handleContactUsClick}
                  whileTap={{ scale: 0.97 }}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25"
                >
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    Contact Us
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;