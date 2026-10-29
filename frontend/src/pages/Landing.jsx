import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import AboutSection from "../components/landing/AboutSection";
import TeamSection from "../components/landing/TeamSection";
import ContactSection from "../components/landing/ContactSection";
import GallerySection from "@/components/landing/GallerySection";
import EventsSection from "@/components/landing/EventsSection";

const Landing = () => {
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
    <div
      data-gallery-open={isGalleryModalOpen}
      className="relative min-h-screen overflow-x-clip bg-background font-sans dark"
    >
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <TeamSection />
        <EventsSection />
        <GallerySection onGalleryModalToggle={setIsGalleryModalOpen} />
        <ContactSection />
      </main>
      <footer className="border-t border-border/60 px-5 py-7 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold tracking-wide text-foreground">
            Code<span className="text-primary">Storm</span> · CRCE
          </span>
          <span>Built by curious minds, for curious minds.</span>
          <a className="transition hover:text-primary" href="mailto:codestorm.crce@gmail.com">
            codestorm.crce@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
