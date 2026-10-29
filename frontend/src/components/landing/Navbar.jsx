import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "About", target: "about-section" },
    { label: "People", target: "team-section" },
    { label: "Events", target: "events-section" },
    { label: "Gallery", target: "gallery-section" },
    { label: "Stories", route: "/blogs" },
  ];

  const handleNavClick = (item) => {
    if (item.route) {
      navigate(item.route);
    } else {
      document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleContactClick = () => {
    document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#100f0e]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="group flex items-center gap-3"
          aria-label="CodeStorm home"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary p-1.5 transition-transform group-hover:rotate-[-6deg]">
            <img src="/logo.png" alt="" className="h-full w-full object-contain" />
          </span>
          <span className="text-left text-lg font-extrabold tracking-tight text-foreground">
            Code<span className="text-primary">Storm</span>
            <span className="ml-2 hidden text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:inline">
              CRCE
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavClick(item)}
              className="rounded-full px-3 py-2 text-[13px] font-medium text-muted-foreground transition hover:bg-white/[0.06] hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleContactClick}
          className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 md:inline-flex"
        >
          Let&apos;s talk <ArrowUpRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground lg:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-border/70 bg-[#100f0e] px-5 pb-5 pt-3 lg:hidden" aria-label="Mobile navigation">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavClick(item)}
              className="flex w-full items-center justify-between border-b border-white/[0.06] py-3.5 text-left text-sm font-medium text-foreground"
            >
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs text-primary">0{index + 1}</span>
                {item.label}
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
          <button
            type="button"
            onClick={handleContactClick}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Let&apos;s talk <ArrowUpRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
