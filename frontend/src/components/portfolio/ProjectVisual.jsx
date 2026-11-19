import { BASTION_RUN, PRECOGNI_SIGNALS } from "@/data/content";

const FRAME = "relative aspect-[16/10] overflow-hidden rounded-[16px] bg-[#2b2119]";
const ZOOM = "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110";

const STATUS_COLORS = { ok: "#b9d08a", warn: "#e2c08a", stop: "#f0a98a" };

// Run timeline modelled on Bastion's audit events: tool calls and policy decisions for one chat run.
const BastionRun = () => (
  <div className={`${FRAME} flex flex-col p-5 text-[#efe7da]`}>
    <p className="lab font-mono text-[#e2a07a]">bastion · run timeline</p>
    <p className="mt-1 text-xs text-[#d9c7ad]">{BASTION_RUN.persona}</p>
    <ul className="mt-auto space-y-2 text-sm">
      {BASTION_RUN.events.map((e) => (
        <li key={e.label} className="flex justify-between gap-3 border-t border-[#efe7da]/15 pt-2">
          <span className="truncate font-mono text-xs">{e.label}</span>
          <span className="lab shrink-0" style={{ color: STATUS_COLORS[e.tone] }}>
            {e.status}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

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
  "bastion-run": BastionRun,
  "precogni-cam": PrecogniCam,
  screenshot: Screenshot,
};

export const ProjectVisual = ({ project }) => {
  const Visual = VISUALS[project.visual];
  return Visual ? (
    <div
      className="mb-6 rounded-[20px] border-[5px] border-[#e3d6c3] transition-[border-color] duration-500 group-hover:border-[#a8471f]"
      data-testid={`project-${project.name.toLowerCase()}-visual`}
    >
      <Visual src={project.image} name={project.name} />
    </div>
  ) : null;
};

export default ProjectVisual;
