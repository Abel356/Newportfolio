import { PROFILE, HERO_LINES, HERO_PHRASES } from "@/data/content";
import { Typewriter } from "./Typewriter";
import { DotField } from "./DotField";

export const Hero = () => (
  <header
    id="top"
    className="relative min-h-[100svh] bg-[#efe7da] text-[#2b2119] overflow-hidden flex items-center"
  >
    <DotField />
    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-20">
      <p className="lab text-[#a8471f] fu" style={{ animationDelay: ".55s" }}>
        AI + cloud engineer · {PROFILE.location}
      </p>
      <h1
        className="font-dsp mt-6"
        style={{ fontSize: "clamp(46px,8.5vw,136px)", letterSpacing: "-0.035em", lineHeight: 0.98 }}
        data-testid="hero-headline"
      >
        {HERO_LINES.map((line, i) => (
          <span className="ln" key={line}>
            <span style={{ animationDelay: `${0.15 + i * 0.12}s` }}>{line}</span>
          </span>
        ))}
        <span className="block whitespace-nowrap italic text-[#a8471f] fu" style={{ animationDelay: ".5s" }}>
          <Typewriter phrases={HERO_PHRASES} typing={70} pause={2000} />
        </span>
      </h1>
      <p className="mt-8 max-w-[34rem] text-lg leading-[1.6] text-[#4a3a2d] fu" style={{ animationDelay: ".7s" }}>
        {PROFILE.differentiator}
      </p>
      <div className="mt-9 flex flex-wrap gap-4 fu" style={{ animationDelay: ".85s" }}>
        <a
          href={PROFILE.calendly}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="hero-book-call"
          className="group rounded-full bg-[#2b2119] text-[#efe7da] px-7 py-4 transition-transform hover:scale-105"
        >
          Book a 30-min call{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </a>
        <a
          href="#projects"
          data-testid="hero-see-work"
          className="rounded-full border border-[#2b2119] bg-[#efe7da]/70 px-7 py-4 transition-colors hover:bg-[#2b2119] hover:text-[#efe7da]"
        >
          See the work
        </a>
      </div>
    </div>
  </header>
);

export default Hero;
