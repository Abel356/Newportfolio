import { useEffect, useState } from "react";
import { PROFILE } from "@/data/content";

const LINKS = [
  { href: "#notes", label: "Notes" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      data-testid="main-nav"
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-[#efe7da]/90 backdrop-blur-md border-b border-[#2b2119]/15" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <a href="#top" data-testid="nav-logo" className="flex items-center gap-3">
          <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
            <circle cx="16" cy="16" r="14" fill="#a8471f" />
            <path
              className="draw"
              d="M8 22 L16 9 L24 22 M11.5 17h9"
              fill="none"
              stroke="#efe7da"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-dsp text-xl">Abel Sabu</span>
        </a>
        <div className="hidden md:flex gap-8 text-sm text-[#2b2119]">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="relative transition-colors hover:text-[#a8471f]"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href={PROFILE.calendly}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="nav-book-call"
          className="rounded-full bg-[#a8471f] text-[#efe7da] px-5 py-2 text-sm transition-transform hover:scale-105"
        >
          Book a call
        </a>
      </div>
    </nav>
  );
};

export default Nav;
