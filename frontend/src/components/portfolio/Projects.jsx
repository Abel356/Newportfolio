import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, FileText, Github, Play, ShieldX } from "lucide-react";
import { PROJECTS, TRIAGE_ROWS, PRECOGNI_SIGNALS } from "@/data/content";
import { Reveal } from "./shared";

// The source footage has a purple border baked in; the scale crops it out and zooms the content.
// Shows the poster still; plays the muted clip on hover (desktop) or tap (touch).
const HoverClip = ({ src, poster, label, testId }) => {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  const play = () => ref.current.play().catch(() => {});
  const stop = () => ref.current.pause();
  const toggle = () => (ref.current.paused ? play() : stop());

  return (
    <button
      type="button"
      onMouseEnter={play}
      onMouseLeave={stop}
      onClick={toggle}
      aria-label={label}
      data-testid={testId}
      className="group relative block w-full overflow-hidden rounded-[24px] border-[6px] border-[#e3d6c3] bg-[#2b2119] aspect-[16/9] transition-[border-color] duration-500 hover:border-[#a8471f]"
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full scale-[1.16] object-cover"
      />
      <span
        className={`lab absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-[#2b2119]/85 px-3 py-1.5 text-[#efe7da] transition-opacity duration-300 ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      >
        <Play size={12} /> Hover to play
      </span>
    </button>
  );
};

const Bar = ({ w, className = "bg-[#2b2119]/15" }) => (
  <span className={`block h-2 rounded-full ${className}`} style={{ width: w }} />
);

// Vertical pipeline: a dot travels down the line past each step.
const FlowView = ({ view }) => (
  <div className="relative flex h-full flex-col justify-between py-1 pl-7">
    <span className="absolute bottom-3 left-[7px] top-3 w-px bg-[#2b2119]/25" />
    <span className="flow-dot absolute left-[3px] h-[9px] w-[9px] rounded-full bg-[#a8471f]" />
    {view.steps.map((s) => (
      <div key={s.label} className="relative">
        <span className="absolute -left-7 top-1 h-[15px] w-[15px] rounded-full border border-[#2b2119]/40 bg-[#efe7da]" />
        <p className="text-sm font-semibold leading-tight">{s.label}</p>
        <p className="mt-0.5 text-xs leading-snug text-[#6b5848]">{s.note}</p>
      </div>
    ))}
  </div>
);

// Illustrative chat: a question, a cited answer, and one action the policy engine refuses.
const ChatView = ({ view }) => (
  <div className="flex h-full flex-col justify-between gap-3 text-sm">
    <p className="lab font-mono text-[#6b5848]">{view.persona}</p>
    <p className="ml-auto max-w-[85%] rounded-[14px] rounded-br-sm bg-[#2b2119] px-3.5 py-2 text-[#efe7da]">
      {view.question}
    </p>
    <div className="max-w-[90%] space-y-2 rounded-[14px] rounded-bl-sm bg-[#e3d6c3] px-3.5 py-3">
      <Bar w="100%" />
      <Bar w="82%" />
      <div className="flex items-center gap-1.5 pt-1">
        {view.sources.map((n) => (
          <span key={n} className="rounded-md bg-[#efe7da] px-1.5 py-0.5 font-mono text-[11px] text-[#a8471f]">
            [{n}]
          </span>
        ))}
        <span className="text-xs text-[#6b5848]">{view.sources.length} sources cited</span>
      </div>
    </div>
    <p className="flex items-start gap-2 rounded-[12px] border border-[#a8471f]/40 px-3 py-2 text-xs text-[#a8471f]">
      <ShieldX size={15} className="mt-px shrink-0" />
      <span>
        <span className="font-mono">{view.blocked.tool}</span> blocked: {view.blocked.reason}
      </span>
    </p>
  </div>
);

const Doc = ({ title, bars, hit }) => (
  <div className="flex-1 space-y-2 rounded-[12px] bg-[#e3d6c3] p-3">
    <p className="lab flex items-center gap-1.5 text-[#6b5848]">
      <FileText size={12} /> {title}
    </p>
    {bars.map((w, i) => (
      <Bar key={`${title}-${w}`} w={w} className={i === hit ? "h-3 bg-[#a8471f]/55" : "bg-[#2b2119]/15"} />
    ))}
  </div>
);

// Regulation text beside the policy passage it maps to; highlighted bars are the matched spans.
const CompareView = ({ view }) => (
  <div className="flex h-full flex-col justify-between gap-3">
    <div className="flex flex-1 items-stretch gap-2">
      <Doc title="Regulation" bars={["90%", "100%", "76%", "94%", "60%"]} hit={2} />
      <span className="self-center font-mono text-[#a8471f]">&harr;</span>
      <Doc title="Your policy" bars={["100%", "70%", "88%", "96%", "52%"]} hit={3} />
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
      <span className="lab rounded-full border border-[#a8471f]/50 px-2.5 py-1 text-[#a8471f]">{view.label}</span>
      <span className="text-[#6b5848]">{view.note}</span>
    </div>
  </div>
);

// Evidence checklist: rows tick off one after another when the view appears.
const ChecklistView = ({ view }) => (
  <div className="flex h-full flex-col">
    <p className="lab font-mono text-[#6b5848]">{view.title}</p>
    <ul className="mt-3 flex flex-1 flex-col justify-between">
      {view.items.map((item, i) => (
        <li key={item} className="flex items-center gap-3 border-t border-[#2b2119]/15 pt-2.5 text-sm">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border border-[#2b2119]/40">
            {i < view.done && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.45, type: "spring", stiffness: 420, damping: 18 }}
                className="text-[#a8471f]"
              >
                <Check size={14} strokeWidth={3} />
              </motion.span>
            )}
          </span>
          <span className="min-w-0 leading-snug">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const VIEWS = { flow: FlowView, chat: ChatView, compare: CompareView, checklist: ChecklistView };

const FRAME = "relative aspect-[16/10] overflow-hidden rounded-[16px] bg-[#2b2119]";
const ZOOM = "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110";

// Light panel with several switchable views of the same project (see `views` in content.js).
const ViewSwitcher = ({ name, views }) => {
  const [active, setActive] = useState(0);
  const View = VIEWS[views[active].type];
  const slug = name.toLowerCase();
  return (
    <div className="flex h-[340px] flex-col rounded-[16px] bg-[#efe7da] p-4 text-[#2b2119]">
      <div className="flex gap-1.5" role="tablist">
        {views.map((v, i) => (
          <button
            key={v.type}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            data-testid={`project-${slug}-view-${v.type}`}
            className={`lab rounded-full px-3 py-1.5 transition-colors ${
              i === active ? "bg-[#2b2119] text-[#efe7da]" : "text-[#6b5848] hover:text-[#a8471f]"
            }`}
          >
            {v.tab}
          </button>
        ))}
      </div>
      <div className="mt-4 min-h-0 flex-1" key={views[active].type} data-testid={`project-${slug}-view-panel`}>
        <View view={views[active]} />
      </div>
    </div>
  );
};

const PrecogniCam = ({ src }) => (
  <div className={FRAME}>
    <img src={src} alt="Driver camera view with face tracking overlay" loading="lazy" className={ZOOM} />
    <ul className="absolute left-3 top-3 space-y-1.5">
      {PRECOGNI_SIGNALS.map((s) => (
        <li key={s} className="lab w-fit rounded-full bg-[#2b2119]/85 px-2.5 py-1 font-mono text-[#efe7da]">
          {s}
        </li>
      ))}
    </ul>
  </div>
);

const Screenshot = ({ src, name }) => (
  <div className={FRAME}>
    <img src={src} alt={`${name} screenshot`} loading="lazy" className={`${ZOOM} object-top`} />
  </div>
);

const VISUALS = {
  views: ViewSwitcher,
  "precogni-cam": PrecogniCam,
  screenshot: Screenshot,
};

const ProjectVisual = ({ project }) => {
  const Visual = VISUALS[project.visual];
  return Visual ? (
    <div
      className="mb-6 rounded-[20px] border-[5px] border-[#e3d6c3] transition-[border-color] duration-500 group-hover:border-[#a8471f]"
      data-testid={`project-${project.name.toLowerCase()}-visual`}
    >
      <Visual src={project.image} name={project.name} views={project.views} />
    </div>
  ) : null;
};

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
          <div className="grid md:grid-cols-2 gap-6">
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
