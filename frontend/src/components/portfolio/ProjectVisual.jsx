import { PRECOGNI_SIGNALS } from "@/data/content";

const FRAME = "relative aspect-[16/10] overflow-hidden rounded-[16px] bg-[#2b2119]";
const ZOOM = "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110";

const STATUS_COLORS = { ok: "#b9d08a", warn: "#e2c08a", stop: "#f0a98a" };

// Dark terminal-style panel: a title, a sub-line and status rows, all read from the project's `panel` data.
// Height follows the rows on small screens (long statuses wrap); it matches the image cards from lg up.
const StatusPanel = ({ panel }) => (
  <div className="flex flex-col overflow-hidden rounded-[16px] bg-[#2b2119] p-5 text-[#efe7da] lg:aspect-[16/10]">
    <p className="lab font-mono text-[#e2a07a]">{panel.title}</p>
    <p className="mt-1 text-xs text-[#d9c7ad]">{panel.sub}</p>
    <ul className="mt-8 space-y-2 text-sm lg:mt-auto">
      {panel.rows.map((r) => (
        <li key={r.label} className="flex justify-between gap-3 border-t border-[#efe7da]/15 pt-2">
          <span className="shrink-0 font-mono text-xs">{r.label}</span>
          <span className="lab min-w-0 whitespace-normal text-right" style={{ color: STATUS_COLORS[r.tone] }}>
            {r.status}
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
  "status-panel": StatusPanel,
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
      <Visual src={project.image} name={project.name} panel={project.panel} />
    </div>
  ) : null;
};

export default ProjectVisual;
