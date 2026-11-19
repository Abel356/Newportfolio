import { PROJECTS } from "@/data/content";
import { Reveal } from "./Reveal";

const ACCENTS = ["#b8794f", "#8f9a6a", "#d4a46f", "#a8471f"];

// dir3's curved-edge cards, work-forward.
export const Projects = () => (
  <section id="projects" className="bg-[#efe7da] text-[#2b2119] py-24 md:py-36">
    <div className="max-w-7xl mx-auto px-6">
      <Reveal>
        <p className="lab text-[#a8471f]">Selected work</p>
        <h2
          className="font-dsp mt-4 bal"
          style={{ fontSize: "clamp(36px,5vw,80px)", lineHeight: 1, letterSpacing: "-.02em" }}
        >
          Four builds, four lessons
        </h2>
        <p className="mt-6 max-w-[46ch] text-lg leading-[1.6] text-[#6b5848]">
          Two agents in production, two hackathon builds.
        </p>
      </Reveal>
      <div className="mt-14 grid sm:grid-cols-2 gap-6" data-testid="projects-grid">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <article
              className="group h-full bg-[#faf5ec] rounded-[24px] overflow-hidden border border-[#2b2119]/10 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(43,33,25,0.45)]"
              data-testid={`project-card-${p.name.toLowerCase()}`}
            >
              <div
                className="relative h-40 overflow-hidden flex items-end p-5"
                style={{ background: `linear-gradient(150deg, ${ACCENTS[i]}, #3d2416)` }}
              >
                <span className="font-dsp text-[#fbf6ee] text-3xl opacity-90">{p.name}</span>
                <span className="absolute top-4 right-5 lab text-[#fbf6ee]/80">{p.tag}</span>
              </div>
              <div className="p-7">
                <p className="leading-[1.6] text-[#4a3a2d]">{p.detail}</p>
                <p className="mt-5 font-mono text-xs text-[#8a6f58]">{p.stack}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
