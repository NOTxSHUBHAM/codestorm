import React from "react";
// import { LightningBackground } from "../components/backgrounds/Background";
import { GridBackground } from "@/components/backgrounds/GridBackground";
// import { Dock } from "../components/landing/Dock";
import Navbar from "@/components/landing/Navbar";
import { Home, Info, Users, Image, Mail } from "lucide-react";
import HeroSection from "../components/landing/HeroSection";
import AboutSection from "../components/landing/AboutSection";
import TeamSection from "../components/landing/TeamSection";
import ContactSection from "../components/landing/ContactSection";
import GallerySection from "@/components/landing/GallerySection";
import EventsSection from "@/components/landing/EventsSection";
import GradualBlur from "@/components/ui/GradualBlur";

// const dockItems = [
//   {
//     icon: Home,
//     label: "Home",
//     onClick: () => {
//       const section = document.getElementById("home");
//       if (section) section.scrollIntoView({ behavior: "smooth" });
//     },
//   },
//   {
//     icon: Info,
//     label: "About",
//     onClick: () => {
//       const section = document.getElementById("about-section");
//       if (section) section.scrollIntoView({ behavior: "smooth" });
//     },
//   },
//   {
//     icon: Users,
//     label: "Team",
//     onClick: () => {
//       const section = document.getElementById("team-section");
//       if (section) section.scrollIntoView({ behavior: "smooth" });
//     },
//   },
//   // {
//   //   icon: Image,
//   //   label: "Gallery",
//   //   onClick: () => {
//   //     const section = document.getElementById("gallery-section");
//   //     if (section) section.scrollIntoView({ behavior: "smooth" });
//   //   },
//   // },
//   {
//     icon: Mail,
//     label: "Contact Us",
//     onClick: () => {
//       const section = document.getElementById("contact-section");
//       if (section) section.scrollIntoView({ behavior: "smooth" });
//     },
//   },
// ];

const Landing = ({ backgroundVariant }) => {
  const [isGalleryModalOpen, setIsGalleryModalOpen] = React.useState(false);

  React.useEffect(() => {
    const handleGalleryModal = (e) => {
      setIsGalleryModalOpen(e.detail === true);
    };
    window.addEventListener("gallery-modal-toggle", handleGalleryModal);
    return () =>
      window.removeEventListener("gallery-modal-toggle", handleGalleryModal);
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background font-sans dark">
      <Navbar />
      <GridBackground
        className="min-h-screen"
        maskIntensity="0.1%"
        variant={backgroundVariant}
      >
        <GradualBlur
          target="page"
          position="top"
          preset="subtle"
          curve="bezier"
          strength={4}
          divCount={8}
          opacity={0.95}
          responsive
          mobileHeight="3.5rem"
          tabletHeight="4.5rem"
          desktopHeight="6rem"
          zIndex={30}
        />
        <GradualBlur
          target="page"
          position="bottom"
          preset="smooth"
          curve="bezier"
          strength={4}
          divCount={8}
          opacity={0.95}
          responsive
          mobileHeight="4rem"
          tabletHeight="5rem"
          desktopHeight="6.5rem"
          zIndex={30}
        />
        <div className="relative z-10">
          <HeroSection />
          <AboutSection />
          <TeamSection />
          <EventsSection />
          <GallerySection onGalleryModalToggle={setIsGalleryModalOpen} />
          <ContactSection />
        </div>
      </GridBackground>

      {/* Only show Dock if gallery modal is not open
      {!isGalleryModalOpen && (
        <div className="fixed bottom-2 left-0 w-full z-20 pb-safe">
          <Dock items={dockItems} className="w-full max-w-md mx-auto" />
        </div>
      )} */}
    </div>
  );
};

export default Landing;
