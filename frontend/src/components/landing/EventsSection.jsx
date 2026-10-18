import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import Floating, { FloatingElement } from "@/components/landing/ParallaxFloating";

const events = [
  {
    id: 1,
    title: "SIH",
    image: "/hackathon/hackathon-1.jpeg",
    depth: 0.7,
    className: "left-[2%] top-[10%] z-20 md:left-[4%] md:top-[12%]",
    imageClassName:
      "h-32 w-24 sm:h-52 sm:w-36 lg:h-64 lg:w-44 xl:h-72 xl:w-48",
    tilt: "-rotate-6",
  },
  {
    id: 2,
    title: "Monster QR Hunt",
    image: "/monster/monster-1.jpeg",
    depth: 1.2,
    className: "left-[30%] top-[5%] z-30 md:left-[28%] md:top-[4%]",
    imageClassName:
      "h-30 w-36 sm:h-40 sm:w-56 lg:h-48 lg:w-72 xl:h-52 xl:w-80",
    tilt: "rotate-3",
  },
  {
    id: 3,
    title: "Escape Room",
    image: "/escape/escape-1.jpg",
    depth: 1.8,
    className: "right-[2%] top-[14%] z-20 md:right-[6%] md:top-[12%]",
    imageClassName:
      "h-36 w-24 sm:h-56 sm:w-40 lg:h-72 lg:w-52 xl:h-80 xl:w-56",
    tilt: "rotate-6",
  },
  {
    id: 4,
    title: "Hackathon Seminar",
    image: "/hackathon/hackathon-2.jpeg",
    depth: 1.1,
    className: "left-[6%] bottom-[8%] z-10 md:left-[14%] md:bottom-[8%]",
    imageClassName:
      "h-30 w-40 sm:h-40 sm:w-60 lg:h-48 lg:w-80 xl:h-52 xl:w-88",
    tilt: "rotate-2",
  },
  {
    id: 5,
    title: "Rapid Prototyping Seminar",
    image: "/prototyping/prototyping-1.jpeg",
    depth: 2.2,
    className: "right-[4%] bottom-[6%] z-30 md:right-[14%] md:bottom-[7%]",
    imageClassName:
      "h-32 w-36 sm:h-44 sm:w-56 lg:h-56 lg:w-72 xl:h-60 xl:w-[22rem]",
    tilt: "-rotate-3",
  },
];

const EventCard = ({ event, imagePriority = false }) => {
  return (
    <motion.div
      className={`group ${event.tilt}`}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -10, rotate: 0, scale: 1.04 }}
    >
      <div className={`relative flex flex-col ${event.imageClassName}`}>
        {/* glow behind card on hover */}
        <div className="pointer-events-none absolute -inset-4 rounded-2xl bg-primary/0 blur-2xl transition-all duration-500 group-hover:bg-primary/25" />

        <div className="relative h-full w-full overflow-hidden rounded-xl">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-contain drop-shadow-[0_22px_28px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-105"
            loading={imagePriority ? "eager" : "lazy"}
            decoding="async"
          />
          {/* soft vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-white [text-shadow:0_3px_14px_rgba(0,0,0,0.95)] sm:text-base">
          <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text">
            {event.title}
          </span>
        </p>
      </div>
    </motion.div>
  );
};

const EventsSection = () => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      "[data-event-card]",
      { opacity: [0, 1], y: [24, 0] },
      { duration: 0.55, delay: stagger(0.12) }
    );
  }, [animate]);

  return (
    <section
      id="events-section"
      className="relative overflow-x-clip px-4 py-20"
    >
      {/* ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute right-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="absolute left-[5%] bottom-[10%] h-[280px] w-[280px] rounded-full bg-primary/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div
          ref={scope}
          className="relative h-[36rem] sm:h-[42rem] md:h-[44rem]"
        >
          {/* Center title with layered glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
          >
            <h3 className="font-serif text-4xl font-black uppercase tracking-[0.18em] text-white italic [text-shadow:0_10px_30px_rgba(0,0,0,0.55)] sm:text-5xl lg:text-7xl xl:text-8xl">
              Our Events
            </h3>
            {/* underline glow */}
            <span className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </motion.div>

          <Floating sensitivity={0.95} easingFactor={0.06}>
            {events.map((event, index) => (
              <FloatingElement
                key={event.id}
                depth={event.depth}
                className={event.className}
              >
                <div data-event-card>
                  <EventCard event={event} imagePriority={index < 2} />
                </div>
              </FloatingElement>
            ))}
          </Floating>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;