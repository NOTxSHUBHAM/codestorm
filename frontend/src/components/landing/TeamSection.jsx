import React from "react";
import { motion } from "framer-motion";
import { ThreeDPhotoCarousel } from "@/components/ui/ThreeDPhotoCarousel";

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
    name: "Alciya Dodti ",
    role: "Senior PR head",
    subdivision: "TE COMPS C",
    image: "/alciya.jpeg",
    instagram: "https://www.instagram.com/dodti_alciya/",
    linkedin: "https://www.linkedin.com/in/alciya-dodti-46aa82339/",
  },
  {
    id: 8,
    name: "Wayne Falcao",
    role: " Senior Design Head",
    subdivision: "TE COMPS C",
    image: "/wayne.jpeg",
    instagram: "https://www.instagram.com/wayne_1260?obrf=dGppZWp1aWhoMm83",
    linkedin: "https://www.linkedin.com/in/wayne-falcao-945291330/",
  },
   {
    id: 8,
    name: "",
    role: " Event Coordinator",
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
    role: "Jr. Media Head ",
    subdivision: "SE ",
    image: "/zehra.jpeg",
    instagram: "https://www.instagram.com/_zehra.sayed_/",
    linkedin: "https://www.linkedin.com/in/zehra-sayed-8b5a85441/",
  },
  {
    id: 13,
    name: " Farhan Shaikh ",
    role: "SE Representative ",
    subdivision: "SE COMPS A",
    image: "/farhan.jpeg",
    instagram: "https://www.instagram.com/_.shaikh_.03?exln=YTd2Z3l4eGVuZmFu/",
    linkedin: "  https://www.linkedin.com/in/farhan-shaikh-82810637a?utm_source=share_via&utm_content=profile&utm_medium=member_android/",
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
    role: "Jr.Design Head",
    subdivision: "SE",
    image: "/iris.jpeg",
    instagram: "https://www.instagram.com/iris_renoy/",
    linkedin: "https://www.linkedin.com/in/iris-renoy-7b2340423/",
  },
  {
    id: 16,
    name: " Pushkar Jaiswal",
    role: "Jr. PR Head",
    subdivision: "SE CSE A",
    image: "/pushkar.jpeg",
    instagram: "https://www.instagram.com/pushkar_strange4127/",
    linkedin: "https://www.linkedin.com/in/pushkar-jaiswal-b276bb373/",
  },
  {
    id: 17,
    name: " Trinav Sircar",
    role: "Jr. Event Head",
    subdivision: "SE CSE C",
    image: "/trinav.jpeg",
    instagram: "https://www.instagram.com/3navvv/",
    linkedin: "https://www.linkedin.com/in/trinav-sircar/",
  },
];

/* Small reusable header block */
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

const TeamSection = () => {
  return (
    <section
      id="team-section"
      className="relative py-20 px-4 overflow-hidden"
    >
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[10%] h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute right-[5%] top-[45%] h-[320px] w-[320px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="absolute left-[5%] bottom-[10%] h-[280px] w-[280px] rounded-full bg-primary/10 blur-[110px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Senior Team Header */}
        <SectionHeader
          badge="Senior Council"
          title="Our Team"
          subtitle="The passionate minds driving CodeStorm forward"
        />

        {/* Senior Team Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ThreeDPhotoCarousel teamMembers={teamMembers} />
        </motion.div>

        {/* Divider */}
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

        {/* Junior Council Header */}
        <SectionHeader
          badge="Junior Council"
          title="Rising Talent"
          delay={0.4}
        />

        {/* Junior Council Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <ThreeDPhotoCarousel teamMembers={juniorCouncilMembers} />
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;