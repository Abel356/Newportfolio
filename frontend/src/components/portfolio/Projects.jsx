import { ArrowUpRight, Github } from "lucide-react";
import { PROJECTS, TRIAGE_ROWS } from "@/data/content";
import { Reveal } from "./Reveal";
import { HoverClip } from "./HoverClip";
import { ProjectVisual } from "./ProjectVisual";

const slug = (name) => name.toLowerCase();

// Renders nothing when the URL is empty, so cards never show dead buttons.
const LinkButton = ({ href, testId, solid, children }) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
      className={`inline-flex items-center gap-2 rounded-full border border-[#2b2119] px-4 py-2 text-sm transition-colors ${
        solid
          ? "bg-[#2b2119] text-[#efe7da] hover:bg-[#a8471f] hover:border-[#a8471f]"
          : "hover:bg-[#2b2119] hover:text-[#efe7da]"
      }`}
    >
      {children}
    </a>
  ) : null;

const ProjectLinks = ({ project }) =>
  project.repo || project.demo ? (
    <div className="mt-6 flex flex-wrap gap-3">
      <LinkButton href={project.repo} testId={`project-${slug(project.name)}-repo`} solid>
        <Github size={15} /> Repo
      </LinkButton>
      <LinkButton href={project.demo} testId={`project-${slug(project.name)}-demo`}>
        Live demo <ArrowUpRight size={15} />
      </LinkButton>
    </div>
  ) : null;

const ProjectBody = ({ project, big }) => (
  <div className="flex h-full flex-col">
    <p className="lab text-[#a8471f]">{project.tag}</p>
    <h3 className={`font-dsp mt-3 ${big ? "text-4xl md:text-5xl" : "text-3xl"}`}>{project.name}</h3>
    <p className="mt-4 max-w-[52ch] leading-[1.6] text-[#4a3a2d]">{project.detail}</p>
    <p className="mt-5 font-mono text-xs leading-[1.7] text-[#6b5848]">{project.stack}</p>
    <div className={big ? "" : "mt-auto"}>
      <ProjectLinks project={project} />
    </div>
  </div>
);

const TriagePanel = () => (
  <div
    className="bg-[#2b2119] text-[#efe7da] rounded-[24px] p-6 md:p-8 shadow-[0_30px_70px_-35px_rgba(43,33,25,0.7)]"
    data-testid="triage-panel"
  >
    <div className="flex items-center justify-between">
      <span className="lab font-mono text-[#e2a07a]">triage · run report</span>
      <span className="lab bg-[#8f9a6a] text-[#2b2119] px-3 py-1 rounded-full">live</span>
    </div>
    <p className="font-dsp mt-6 text-2xl">Wallet review</p>
    <ul className="mt-6 space-y-3 text-sm">
      {TRIAGE_ROWS.map((r) => (
        <li key={r.label} className="flex justify-between border-b border-[#efe7da]/15 pb-3">
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
      <p className="text-xs text-[#d9c7ad] max-w-[12rem] text-right">from ~45+ min per wallet</p>
    </div>
  </div>
);

const CARD =
  "rounded-[24px] border border-[#2b2119]/15 bg-[#f6f0e6] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-35px_rgba(43,33,25,0.45)]";

export const Projects = () => {
  const [featured, ...rest] = PROJECTS;
  return (
    <section id="projects" className="bg-[#efe7da] text-[#2b2119] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <p className="lab text-[#a8471f]">Projects</p>
          <h2
            className="font-dsp mt-4"
            style={{ fontSize: "clamp(36px,5vw,72px)", lineHeight: 1, letterSpacing: "-.02em" }}
          >
            Things I've built
          </h2>
        </Reveal>
        <div className="mt-12 space-y-6" data-testid="projects-grid">
          <Reveal>
            <article
              className={`${CARD} grid lg:grid-cols-2 gap-8 lg:gap-12 p-7 md:p-10 items-center`}
              data-testid={`project-card-${slug(featured.name)}`}
            >
              <ProjectBody project={featured} big />
              <TriagePanel />
              <div className="lg:col-span-2">
                <HoverClip
                  src={featured.clip}
                  poster={featured.poster}
                  label={`Play the ${featured.name} demo clip`}
                  testId={`project-${slug(featured.name)}-clip`}
                />
              </div>
            </article>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {rest.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08} className="h-full">
                <article
                  className={`${CARD} group flex h-full flex-col p-5`}
                  data-testid={`project-card-${slug(p.name)}`}
                >
                  <ProjectVisual project={p} />
                  <div className="flex-1 px-2 pb-2">
                    <ProjectBody project={p} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
