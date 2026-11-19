import { PROFILE, HERO_LINES } from "@/data/content";
import { Typewriter } from "./Typewriter";

const TRIAGE_ROWS = [
  { label: "Swap · block 1", status: "Reconciled", color: "#b9d08a" },
  { label: "Bridge transfer", status: "Assumption", color: "#e2c08a" },
  { label: "Airdrop claim", status: "Unreconciled", color: "#f0a98a" },
];

export const Hero = () => (
  <header
    id="top"
    className="relative min-h-[100svh] bg-[#efe7da] text-[#2b2119] overflow-hidden"
  >
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-16 grid lg:grid-cols-12 gap-12 items-center min-h-[100svh]">
      {/* Left — headline */}
      <div className="lg:col-span-7 min-w-0 relative z-10">
        <p className="lab text-[#a8471f] fu" style={{ animationDelay: ".55s" }}>
          AI + cloud engineer · {PROFILE.location}
        </p>
        <h1
          className="font-dsp mt-6 bal"
          style={{ fontSize: "clamp(52px,8vw,140px)", letterSpacing: "-0.035em", lineHeight: 0.92 }}
        >
          {HERO_LINES.map((line, i) => (
            <span className="ln" key={line}>
              <span style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                {i === 2 ? <em>{line}</em> : line}
              </span>
            </span>
          ))}
        </h1>
        <p
          className="mt-8 max-w-[34rem] text-lg leading-[1.6] fu"
          style={{ animationDelay: ".7s" }}
        >
          {PROFILE.differentiator}
        </p>
        <p
          className="mt-4 font-mono text-sm text-[#6b5848] fu min-h-[1.5em]"
          style={{ animationDelay: ".78s" }}
        >
          <span className="text-[#a8471f]">$</span>{" "}
          <Typewriter
            phrases={[
              "deploy --env=prod",
              "agents --status=RUNNING",
              "uptime --last=99.9%",
            ]}
          />
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
            className="rounded-full border border-[#2b2119] px-7 py-4 transition-colors hover:bg-[#2b2119] hover:text-[#efe7da]"
          >
            See the work
          </a>
        </div>
      </div>

      {/* Right — interactive Triage panel (curved edges, 3D float) */}
      <div className="lg:col-span-5 panel-wrap">
        <div
          className="panel-3d bg-[#2b2119] text-[#efe7da] rounded-[28px] p-6 md:p-8 shadow-[0_40px_80px_-30px_rgba(43,33,25,0.6)]"
          data-testid="hero-triage-panel"
        >
          <div className="flex items-center justify-between">
            <span className="lab font-mono text-[#e2a07a]">triage · run report</span>
            <span className="lab bg-[#8f9a6a] text-[#2b2119] px-3 py-1 rounded-full">live</span>
          </div>
          <p className="font-dsp mt-6 text-2xl">Wallet review</p>
          <ul className="mt-6 space-y-3 text-sm">
            {TRIAGE_ROWS.map((r) => (
              <li
                key={r.label}
                className="flex justify-between border-b border-[#efe7da]/15 pb-3"
              >
                <span>{r.label}</span>
                <span className="lab" style={{ color: r.color }}>
                  {r.status}
                </span>
              </li>
            ))}
            <li className="flex justify-between pb-1">
              <span>Report via x402</span>
              <span className="tab font-mono">$9.99</span>
            </li>
          </ul>
          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="lab text-[#e2a07a]">time saved</p>
              <p className="font-dsp text-5xl tab">80%</p>
            </div>
            <p className="text-xs text-[#d9c7ad] max-w-[12rem] text-right">
              from ~45+ min per wallet
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Hero;
