import React from "react";
import { motion } from "framer-motion";
import InteractiveBentoGallery from "./InteractiveBentoGallery";

const mediaItems = [
  {
    id: 1,
    type: "image",
    title: "Campus Moments",
    desc: "General gallery snapshots from CodeStorm activities.",
    url: "/gallery/gallery-1.jpeg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
  },
  {
    id: 2,
    type: "image",
    title: "On Ground Energy",
    desc: "Student participation during events and sessions.",
    url: "/gallery/gallery-2.jpeg",
    fit: "contain",
    position: "center center",
    span: "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
  },
  {
    id: 3,
    type: "image",
    title: "Event Floor",
    desc: "Real moments from active rounds and interactions.",
    url: "/gallery/gallery-3.jpeg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-2 ",
  },
  {
    id: 4,
    type: "image",
    title: "CodeStorm Crowd",
    desc: "Community snapshots across challenges and meetups.",
    url: "/gallery/gallery-4.jpeg",
    span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2 ",
  },
  {
    id: 5,
    type: "image",
    title: "Monster Hunt",
    desc: "QR hunt highlights from across campus.",
    url: "/monster/monster-2.jpeg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 ",
  },
  {
    id: 6,
    type: "image",
    title: "Escape Room",
    desc: "Round progression and escape challenge scenes.",
    url: "/escape/escape-2.jpeg",
    span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2 ",
  },
  {
    id: 7,
    type: "image",
    title: "Rapid Prototyping",
    desc: "Seminar insights from senior council sessions.",
    url: "/prototyping/prototyping-2.jpeg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 ",
  },
];

const GallerySection = ({ onGalleryModalToggle }) => (
  <section
    id="gallery-section"
    className="relative pt-16 sm:pt-24 pb-12 sm:pb-16 overflow-hidden"
  >
    {/* Ambient glow blobs — smaller & tighter on mobile */}
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-1/2 top-0 h-[260px] w-[90vw] sm:h-[420px] sm:w-[700px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px] sm:blur-[140px]" />
      <div className="absolute right-0 bottom-[10%] h-[220px] w-[220px] sm:h-[300px] sm:w-[300px] rounded-full bg-accent/15 blur-[90px] sm:blur-[120px]" />
      <div className="absolute left-0 bottom-[20%] h-[180px] w-[180px] sm:h-[260px] sm:w-[260px] rounded-full bg-primary/10 blur-[80px] sm:blur-[110px]" />

      {/* Subtle grid overlay — hidden on mobile for perf */}
      <div
        className="hidden sm:block absolute inset-0 opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>

    {/* Section header */}
    <motion.div
      className="mx-auto mb-8 sm:mb-12 max-w-2xl px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <span className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 text-[10px] sm:text-xs font-semibold tracking-widest uppercase rounded-full border border-primary/40 bg-primary/10 text-primary backdrop-blur-md">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
        Moments
      </span>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 leading-tight bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
        CodeStorm{" "}
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Gallery
        </span>
      </h2>

      <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto px-2">
        Campus memories, event highlights, and behind-the-scenes moments.
      </p>

      <span className="mt-5 inline-block h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
    </motion.div>

    <InteractiveBentoGallery
      mediaItems={mediaItems}
      onGalleryModalToggle={onGalleryModalToggle}
    />
  </section>
);

export default GallerySection;