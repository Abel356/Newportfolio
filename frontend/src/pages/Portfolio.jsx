import { useEffect } from "react";
import { Link } from "react-router-dom";
import { startTracking } from "@/lib/track";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { Notes } from "@/components/portfolio/Notes";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { Projects } from "@/components/portfolio/Projects";
import { GitHubActivity } from "@/components/portfolio/GitHubActivity";
import { Reveal, CountUp, SocialLinks } from "@/components/portfolio/shared";
import {
  PROFILE,
  METRICS,
  HACKATHONS,
  CERTS,
  LEADERSHIP,
  INTERESTS,
  IMAGES,
  EXPERIENCE,
  SKILLS,
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

const Metrics = () => (
  <section id="numbers" className="bg-[#2b2119] text-[#efe7da] py-20 md:py-28">
    <div className="max-w-7xl mx-auto px-6">
      <Reveal>
        <p className="lab text-[#e2a07a]">On the record</p>
      </Reveal>
      <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6" data-testid="metrics-grid">
        {METRICS.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.08}>
            <div className="border-t border-[#efe7da]/20 pt-6">
              <p
                className="font-dsp"
                style={{ fontSize: "clamp(48px,6.5vw,96px)", lineHeight: 1 }}
                data-testid={`metric-${i}`}
              >
                <CountUp value={m.value} decimals={m.decimals} suffix={m.suffix} />
              </p>
              <p className="mt-3 text-sm text-[#d9c7ad]">{m.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Hackathons = () => (
  <section id="hackathons" className="bg-[#efe7da] text-[#2b2119] py-16 md:py-20">
    <Reveal className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-6 items-baseline">
      <p className="md:col-span-3 lab text-[#a8471f]">Hackathons attended</p>
      <ul className="md:col-span-9 flex flex-wrap gap-2.5" data-testid="hackathon-list">
        {HACKATHONS.map((h) => (
          <li
            key={h.name}
            className="rounded-full border border-[#2b2119]/25 px-4 py-1.5 text-sm transition-colors hover:border-[#a8471f] hover:text-[#a8471f]"
          >
            {h.name}
            {h.note && <span className="ml-1.5 text-[#6b5848]">{h.note}</span>}
          </li>
        ))}
      </ul>
    </Reveal>
  </section>
);

const Education = () => (
  <section id="education" className="bg-[#e3d6c3] text-[#2b2119] py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12">
      <Reveal className="md:col-span-7 min-w-0">
        <p className="lab text-[#a8471f]">Education</p>
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
        <p className="lab text-[#a8471f]">Certifications</p>
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
  <section id="leadership" className="bg-[#efe7da] text-[#2b2119] py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6">
      <SectionTitle eyebrow="Leadership" title="Clubs I've led" />
      <div className="mt-12 grid md:grid-cols-2 gap-10">
        {LEADERSHIP.map((l, i) => (
          <Reveal key={l.role} delay={i * 0.08}>
            <div className="border-l-2 border-[#a8471f] pl-6">
              <p
                className="font-dsp tab text-[#a8471f]"
                style={{ fontSize: "clamp(40px,5vw,64px)", lineHeight: 1 }}
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
  <section id="interests" className="bg-[#e3d6c3] text-[#2b2119] py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <Reveal className="relative rounded-[24px] overflow-hidden aspect-[3/2] shadow-[0_30px_60px_-35px_rgba(43,33,25,0.5)]">
        <img
          src={IMAGES.mountains}
          alt="Warm mountain ridges at golden hour"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute bottom-4 left-5 lab text-[#efe7da]">Somewhere in country 14</span>
      </Reveal>
      <Reveal delay={0.1} className="min-w-0">
        <p className="lab text-[#a8471f]">Off the clock</p>
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
    className="relative bg-[#2b2119] text-[#efe7da] py-24 md:py-32 overflow-hidden"
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
        stroke="#e2a07a"
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
          <p className="lab text-[#a8471f]">30 minutes · video call</p>
          <p className="font-dsp text-3xl mt-3">Intro call with Abel</p>
          <a
            href={PROFILE.calendly}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="contact-book-call"
            className="group mt-6 block text-center rounded-full bg-[#a8471f] text-[#efe7da] px-6 py-4 transition-transform hover:scale-[1.03]"
          >
            Book a 30-min call{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </a>
          <SocialLinks place="contact" className="mt-6" />
        </div>
      </Reveal>
    </div>
    <div
      id="get-in-touch"
      className="relative z-10 max-w-7xl mx-auto px-6 mt-20 md:mt-28 pt-16 md:pt-20 border-t border-[#efe7da]/15 grid lg:grid-cols-12 gap-12"
    >
      <Reveal className="lg:col-span-5 min-w-0">
        <p className="lab text-[#e2a07a]">Get in touch</p>
        <h2
          className="font-dsp mt-4 bal"
          style={{ fontSize: "clamp(36px,5vw,72px)", lineHeight: 1, letterSpacing: "-.02em" }}
        >
          Or send me a message.
        </h2>
        <p className="mt-6 max-w-[42ch] text-lg leading-[1.6] text-[#d9c7ad]">
          Have a question or want to work together? I'd love to hear from you.
        </p>
      </Reveal>
      <Reveal delay={0.1} className="lg:col-span-7">
        <ContactForm />
      </Reveal>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#efe7da] text-[#2b2119] py-12">
    <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-6 text-sm">
      <span className="font-dsp text-xl">Abel Sabu</span>
      <div className="flex items-center gap-5">
        <Link
          to="/admin"
          data-testid="footer-admin"
          className="text-xs text-[#6b5848] transition-colors hover:text-[#a8471f] md:hidden"
        >
          Admin
        </Link>
        <SocialLinks place="footer" />
      </div>
    </div>
  </footer>
);

// dir1's "Where I've shipped" — tabular dates left, detail right, hairline dividers.
const Experience = () => (
  <section id="experience" className="bg-[#e3d6c3] text-[#2b2119] py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6">
      <Reveal>
        <p className="lab text-[#a8471f]">Experience</p>
        <h2
          className="font-dsp mt-4"
          style={{ fontSize: "clamp(36px,5vw,80px)", lineHeight: 1, letterSpacing: "-.02em" }}
        >
          Where I've shipped
        </h2>
      </Reveal>
      <ol className="mt-12 border-t border-[#2b2119]/25" data-testid="experience-list">
        {EXPERIENCE.map((job, i) => (
          <Reveal key={job.role} delay={i * 0.05}>
            <li className="group grid md:grid-cols-12 gap-4 py-8 border-b border-[#2b2119]/25">
              <span className="md:col-span-3 lab tab text-[#6b5848] pt-1">{job.date}</span>
              <div className="md:col-span-9 min-w-0">
                <h3 className="font-dsp text-2xl md:text-3xl transition-colors group-hover:text-[#a8471f]">
                  {job.role} · {job.org}
                </h3>
                <p className="mt-2 max-w-[62ch] leading-[1.6] text-[#4a3a2d]">{job.detail}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);

// dir2's terminal — `cat skills.yml` on a dark earthy window with curved edges + caret.
const Skills = () => (
  <section id="skills" className="bg-[#efe7da] text-[#2b2119] py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6">
      <Reveal>
        <p className="lab text-[#a8471f]">Toolkit</p>
        <h2
          className="font-dsp mt-4"
          style={{ fontSize: "clamp(36px,5vw,80px)", lineHeight: 1, letterSpacing: "-.02em" }}
        >
          What I reach for
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <div
          className="mt-10 bg-[#2b2119] text-[#efe7da] rounded-[24px] overflow-hidden shadow-[0_30px_70px_-35px_rgba(43,33,25,0.7)]"
          data-testid="skills-terminal"
        >
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[#efe7da]/10">
            <span className="h-3 w-3 rounded-full bg-[#a8471f]" />
            <span className="h-3 w-3 rounded-full bg-[#d4a46f]" />
            <span className="h-3 w-3 rounded-full bg-[#8f9a6a]" />
            <span className="ml-3 font-mono text-xs text-[#d9c7ad]">abel@toronto: ~/skills</span>
          </div>
          <div className="font-mono p-6 md:p-10 text-sm md:text-base leading-[2] overflow-x-auto">
            <p className="text-[#d9c7ad]">
              <span className="text-[#8f9a6a]">$</span> cat skills.yml
            </p>
            {SKILLS.map((s) => (
              <p key={s.key} className="mt-1">
                <span className="text-[#e2a07a]">{s.key}:</span>{" "}
                <span className="text-[#efe7da]">{s.value}</span>
              </p>
            ))}
            <p className="mt-3 text-[#8f9a6a]">
              $ <span className="caret w-[0.6ch]">▍</span>
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default function Portfolio() {
  useEffect(() => startTracking(), []);

  return (
    <main className="bg-[#efe7da]" data-testid="portfolio-page">
      <Nav />
      <Hero />
      <Notes />
      <Experience />
      <Projects />
      <GitHubActivity />
      <Hackathons />
      <Metrics />
      <Skills />
      <Education />
      <Leadership />
      <Interests />
      <Contact />
      <Footer />
    </main>
  );
}
