import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

const events = [
  {
    title: "Monster QR Hunt",
    category: "Campus challenge",
    image: "/monster/monster-1.jpeg",
    description: "Follow the clues. Crack the code. Beat the clock.",
    size: "md:col-span-7",
  },
  {
    title: "Escape Room",
    category: "Team experience",
    image: "/escape/escape-1.jpg",
    description: "A room full of riddles, one way out.",
    size: "md:col-span-5",
  },
  {
    title: "Hackathon",
    category: "Build together",
    image: "/hackathon/hackathon-2.jpeg",
    description: "Big ideas, small teams, and a deadline.",
    size: "md:col-span-5",
  },
  {
    title: "Rapid Prototyping",
    category: "Workshop",
    image: "/prototyping/prototyping-1.jpeg",
    description: "Go from first sketch to a working idea.",
    size: "md:col-span-7",
  },
];

const EventsSection = () => (
  <section id="events-section" className="relative px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
    <div className="mx-auto max-w-7xl">
      <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="page-eyebrow mb-3">Not just another meeting</p>
          <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground sm:text-6xl">
            Learn it. Try it.{" "}
            <span className="text-primary">Live it.</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground md:pb-2">
          Every event is an excuse to get curious, work together, and leave with
          a story worth telling.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-12">
        {events.map((event, index) => (
          <motion.article
            key={event.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className={`group relative min-h-[19rem] overflow-hidden rounded-[1.65rem] border border-white/10 bg-card ${event.size}`}
          >
            <img
              src={event.image}
              alt={event.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5 transition-colors group-hover:from-black/95" />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-primary" />
              {event.category}
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 sm:p-8">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{event.title}</h3>
                <p className="mt-2 max-w-md text-sm text-white/75">{event.description}</p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default EventsSection;
