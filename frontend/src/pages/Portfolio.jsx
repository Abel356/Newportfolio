import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { Marquee } from "@/components/portfolio/Marquee";
import { Experience } from "@/components/portfolio/Experience";
import { Projects } from "@/components/portfolio/Projects";
import { Skills } from "@/components/portfolio/Skills";
import { Reveal } from "@/components/portfolio/Reveal";
import {
  PROFILE,
  METRICS,
  HACKATHONS,
  CERTS,
  LEADERSHIP,
  INTERESTS,
  IMAGES,
} from "@/data/content";

const SectionTitle = ({ eyebrow, title, color = "#a8471f" }) => (
  <Reveal>
    <p className="lab" style={{ color }}>
      {eyebrow}
    </p>
    <h2
      className="font-dsp mt-4 bal"
      style={{ fontSize: "clamp(36px,5vw,80px)", lineHeight: 1, letterSpacing: "-.02em" }}
    >
      {title}
    </h2>
  </Reveal>
);

const About = () => (
  <section id="about" className="bg-[#efe7da] text-[#2b2119] py-24 md:py-36">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
      <Reveal className="md:col-span-5 relative">
        <span
          className="font-dsp block text-[#a8471f]/25 leading-none"
          style={{ fontSize: "clamp(120px,20vw,300px)" }}
          aria-hidden="true"
        >
          3/9
        </span>
        <p className="lab -mt-4 md:-mt-6">Won 3 of 9 hackathons</p>
      </Reveal>
      <Reveal delay={0.1} className="md:col-span-7 min-w-0">
        <p className="lab text-[#a8471f]">About</p>
        <h2
          className="font-dsp mt-4 bal"
          style={{ fontSize: "clamp(32px,5vw,72px)", lineHeight: 1.02, letterSpacing: "-.02em" }}
        >
          Demos are easy. Uptime is the job.
        </h2>
        <p className="mt-6 max-w-[60ch] text-lg leading-[1.6] text-[#4a3a2d]">
          I'm a York University computer science student specialising in security and AI. I care
          about the unglamorous part: permissions, evals, audit logs and the Terraform underneath.
        </p>
        <p className="mt-4 max-w-[60ch] text-lg leading-[1.6] text-[#4a3a2d]">
          Recruiters in cloud and AI, and founders who need someone to ship — I'd love to hear
          what you're building.
        </p>
      </Reveal>
    </div>
  </section>
);

const Metrics = () => (
  <section id="numbers" className="bg-[#a8471f] text-[#fbf6ee] py-24 md:py-36">
    <div className="max-w-7xl mx-auto px-6">
      <Reveal>
        <p className="lab">On the record</p>
        <h2
          className="font-dsp mt-4 max-w-3xl bal"
          style={{ fontSize: "clamp(36px,5vw,80px)", lineHeight: 1 }}
        >
          Results from the resume, nothing rounded.
        </h2>
      </Reveal>
      <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 tab">
        {METRICS.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.08}>
            <p className="font-dsp" style={{ fontSize: "clamp(52px,7vw,104px)", lineHeight: 1 }}>
              {m.value}
            </p>
            <p className="mt-2 text-[#fbf6ee]/90">{m.label}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Hackathons = () => (
  <section id="hackathons" className="bg-[#efe7da] text-[#2b2119] py-24 md:py-36">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
      <Reveal className="md:col-span-6 min-w-0">
        <p className="lab text-[#a8471f]">Hackathons</p>
        <h2
          className="font-dsp mt-4"
          style={{ fontSize: "clamp(36px,5vw,80px)", lineHeight: 1 }}
        >
          Weekends, well spent
        </h2>
        <p className="mt-6 max-w-[55ch] text-lg leading-[1.6] text-[#4a3a2d]">
          Won 3 of 9 hackathons. Short clocks taught me to scope hard and demo what really works.
        </p>
        <ul className="mt-8 font-dsp text-2xl md:text-3xl space-y-3" data-testid="hackathon-list">
          {HACKATHONS.map((h) => (
            <li key={h} className="border-b border-[#2b2119]/15 pb-3">
              {h}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.1} className="md:col-span-6 flex justify-center">
        <p
          className="font-dsp tab leading-none text-[#8f9a6a]"
          style={{ fontSize: "clamp(160px,24vw,360px)" }}
          aria-label="3 of 9"
        >
          3<span className="text-[#a8471f]">/</span>9
        </p>
      </Reveal>
    </div>
  </section>
);

const Education = () => (
  <section id="education" className="bg-[#e3d6c3] text-[#2b2119] py-24 md:py-36">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12">
      <Reveal className="md:col-span-7 min-w-0">
        <p className="lab text-[#8a3a18]">Education</p>
        <h2
          className="font-dsp mt-4"
          style={{ fontSize: "clamp(36px,5vw,72px)", lineHeight: 1 }}
        >
          York University
        </h2>
        <p className="mt-6 text-lg leading-[1.6] text-[#4a3a2d]">
          BSc Computer Science, Specialization in Computer Security and AI.
        </p>
        <p className="lab mt-4 tab text-[#6b5848]">Sep 2021 – Apr 2027 · Toronto, ON</p>
      </Reveal>
      <Reveal delay={0.1} className="md:col-span-5">
        <p className="lab text-[#8a3a18]">Certifications</p>
        <ul className="mt-6 space-y-4">
          {CERTS.map((c) => (
            <li key={c} className="border-t border-[#2b2119]/30 pt-4 font-dsp text-xl md:text-2xl">
              {c}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
);

const Leadership = () => (
  <section id="leadership" className="bg-[#efe7da] text-[#2b2119] py-24 md:py-36">
    <div className="max-w-7xl mx-auto px-6">
      <SectionTitle eyebrow="Leadership" title="Rooms I've filled" />
      <div className="mt-12 grid md:grid-cols-2 gap-10">
        {LEADERSHIP.map((l, i) => (
          <Reveal key={l.role} delay={i * 0.08}>
            <div className="border-l-2 border-[#a8471f] pl-6">
              <p
                className="font-dsp tab text-[#a8471f]"
                style={{ fontSize: "clamp(48px,7vw,96px)", lineHeight: 1 }}
              >
                {l.stat}
              </p>
              <h3 className="mt-4 text-xl font-semibold">{l.role}</h3>
              <p className="mt-2 leading-[1.6] text-[#4a3a2d]">{l.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Interests = () => (
  <section id="interests" className="bg-[#d9c7ad] text-[#2b2119] py-24 md:py-36">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <Reveal className="relative rounded-[24px] overflow-hidden aspect-[3/2] shadow-[0_30px_60px_-35px_rgba(43,33,25,0.5)]">
        <img
          src={IMAGES.mountains}
          alt="Warm mountain ridges at golden hour"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute bottom-4 left-5 lab text-[#fbf6ee]">Somewhere in country 14</span>
      </Reveal>
      <Reveal delay={0.1} className="min-w-0">
        <p className="lab text-[#7a3315]">Off the clock</p>
        <h2
          className="font-dsp mt-4"
          style={{ fontSize: "clamp(36px,5vw,72px)", lineHeight: 1 }}
        >
          14 countries and counting
        </h2>
        <p className="mt-6 max-w-[55ch] text-lg leading-[1.6] text-[#4a3a2d]">{INTERESTS}</p>
      </Reveal>
    </div>
  </section>
);

const Contact = () => (
  <section
    id="contact"
    className="relative bg-[#2b2119] text-[#efe7da] py-24 md:py-36 overflow-hidden"
  >
    <svg
      viewBox="0 0 800 400"
      className="absolute inset-0 h-full w-full opacity-20"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        className="draw"
        d="M0 300 C200 100 400 380 800 120"
        fill="none"
        stroke="#d98a5f"
        strokeWidth="2"
      />
    </svg>
    <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
      <Reveal className="lg:col-span-7 min-w-0">
        <p className="lab text-[#e2a07a]">{PROFILE.location}</p>
        <h2
          className="font-dsp mt-4 bal"
          style={{ fontSize: "clamp(44px,7vw,112px)", lineHeight: 0.96, letterSpacing: "-.03em" }}
        >
          Let's talk for thirty minutes.
        </h2>
        <p className="mt-6 max-w-[50ch] text-lg leading-[1.6] text-[#d9c7ad]">
          Internship or new-grad role in cloud, DevOps or AI? Founders welcome. Pick a slot that
          suits you.
        </p>
      </Reveal>
      <Reveal delay={0.1} className="lg:col-span-5">
        <div className="bg-[#efe7da] text-[#2b2119] rounded-[28px] p-8">
          <p className="lab text-[#8a3a18]">30 minutes · video call</p>
          <p className="font-dsp text-3xl mt-3">Intro call with Abel</p>
          <a
            href={PROFILE.calendly}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="contact-book-call"
            className="group mt-6 block text-center rounded-full bg-[#a8471f] text-[#fbf6ee] px-6 py-4 transition-transform hover:scale-[1.03]"
          >
            Book a 30-min call{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </a>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a
              href={`mailto:${PROFILE.email}`}
              data-testid="contact-email"
              className="underline underline-offset-4 hover:text-[#a8471f]"
            >
              {PROFILE.email}
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-linkedin"
              className="underline underline-offset-4 hover:text-[#a8471f]"
            >
              LinkedIn
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-github"
              className="underline underline-offset-4 hover:text-[#a8471f]"
            >
              GitHub
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#efe7da] text-[#2b2119] py-12">
    <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-6 text-sm">
      <span className="font-dsp text-xl">Abel Sabu</span>
      <a href={`mailto:${PROFILE.email}`} className="hover:text-[#a8471f]">
        {PROFILE.email}
      </a>
      <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#a8471f]">
        {PROFILE.githubLabel}
      </a>
      <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#a8471f]">
        {PROFILE.linkedinLabel}
      </a>
    </div>
  </footer>
);

export default function Portfolio() {
  return (
    <main className="bg-[#efe7da]" data-testid="portfolio-page">
      <Nav />
      <Hero />
      <Marquee items={HACKATHONS} />
      <About />
      <Experience />
      <Projects />
      <Metrics />
      <Hackathons />
      <Skills />
      <Education />
      <Leadership />
      <Interests />
      <Contact />
      <Footer />
    </main>
  );
}
