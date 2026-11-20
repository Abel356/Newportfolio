import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, GitCommitHorizontal } from "lucide-react";
import { Reveal, CountUp } from "./shared";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LEVELS = ["bg-[#2b2119]/10", "bg-[#a8471f]/30", "bg-[#a8471f]/55", "bg-[#a8471f]/80", "bg-[#a8471f]"];
const MONTH = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" });
const DAY = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" });

const timeAgo = (iso) => {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 24) return `${Math.round(mins / 60)} hr ago`;
  const days = Math.round(mins / (60 * 24));
  return days < 31 ? `${days} day${days === 1 ? "" : "s"} ago` : DAY.format(new Date(iso));
};

// One label per week column; text only where a new month begins.
const monthLabels = (days) => {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(MONTH.format(new Date(days[i].date)));
  return weeks.map((m, i) => (i > 0 && m !== weeks[i - 1] ? m : ""));
};

// Phones hide the oldest 27 weeks (27 month labels, 189 day squares) so the squares stay readable.
// The numbers are written out in the class names below because Tailwind only picks up literal classes.
const COLUMNS = "grid grid-flow-col auto-cols-fr gap-[3px]";

const Calendar = ({ calendar }) => (
  <div data-testid="github-calendar">
    <p className="font-dsp tab" style={{ fontSize: "clamp(40px,5vw,64px)", lineHeight: 1 }}>
      <span data-testid="github-total">
        <CountUp value={calendar.total} />
      </span>
    </p>
    <p className="mt-2 text-sm text-[#6b5848]">contributions in the last year</p>
    <div
      className={`${COLUMNS} mt-8 h-4 text-[11px] text-[#6b5848] max-md:[&>*:nth-child(-n+27)]:hidden`}
      aria-hidden="true"
    >
      {monthLabels(calendar.days).map((label, i) => (
        <span key={i} className="overflow-visible whitespace-nowrap">
          {label}
        </span>
      ))}
    </div>
    <div
      className={`${COLUMNS} mt-1 grid-rows-7 max-md:[&>*:nth-child(-n+189)]:hidden`}
      role="img"
      aria-label={`${calendar.total} GitHub contributions in the last year`}
      data-testid="github-calendar-grid"
    >
      {calendar.days.map((d) => (
        <span
          key={d.date}
          title={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${DAY.format(new Date(d.date))}`}
          className={`aspect-square rounded-[3px] transition-transform duration-200 hover:scale-150 ${LEVELS[d.level]}`}
        />
      ))}
    </div>
    <div className="mt-4 flex items-center justify-between text-[11px] text-[#6b5848]">
      <span className="md:hidden">Showing the last 6 months</span>
      <span className="ml-auto flex items-center gap-1.5">
        Less
        {LEVELS.map((l) => (
          <span key={l} className={`h-2.5 w-2.5 rounded-[3px] ${l}`} />
        ))}
        More
      </span>
    </div>
  </div>
);

const Commits = ({ commits }) => {
  const [latest, ...earlier] = commits;
  return (
    <div
      className="rounded-[24px] bg-[#2b2119] p-6 text-[#efe7da] shadow-[0_30px_70px_-35px_rgba(43,33,25,0.7)] md:p-8"
      data-testid="github-commits"
    >
      <p className="lab flex items-center gap-2 font-mono text-[#e2a07a]">
        <GitCommitHorizontal size={15} /> latest commit
      </p>
      <div className="mt-5 min-h-[7rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.a
            key={latest.sha}
            href={latest.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="github-latest-commit"
            className="group block"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0, 1] }}
          >
            <p className="font-dsp bal break-words text-2xl leading-[1.2] transition-colors group-hover:text-[#e2a07a] md:text-3xl">
              {latest.message}
            </p>
            <p className="mt-4 flex flex-wrap items-center gap-x-2 font-mono text-xs text-[#d9c7ad]">
              <span className="text-[#efe7da]">{latest.repo}</span>·<span>{latest.sha}</span>·
              <span>{timeAgo(latest.date)}</span>
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </p>
          </motion.a>
        </AnimatePresence>
      </div>
      <ul className="mt-6 text-sm" data-testid="github-earlier-commits">
        <AnimatePresence initial={false}>
          {earlier.map((c) => (
            <motion.li
              key={c.sha}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-t border-[#efe7da]/15"
            >
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-[#e2a07a]"
              >
                <span className="min-w-0 truncate">{c.message}</span>
                <span className="shrink-0 font-mono text-xs text-[#d9c7ad]">
                  {c.repo} · {timeAgo(c.date)}
                </span>
              </a>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

// Live GitHub block. Checks for new commits every minute; renders nothing if GitHub data is unavailable.
export const GitHubActivity = () => {
  const { data } = useQuery({
    queryKey: ["github-activity"],
    queryFn: () => axios.get(`${API}/github/activity`).then((r) => r.data),
    refetchInterval: 60_000,
    retry: 1,
  });
  if (!data || (!data.calendar && !data.commits.length)) return null;

  return (
    <section id="github" className="bg-[#e3d6c3] py-24 text-[#2b2119] md:py-32" data-testid="github-section">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="lab text-[#a8471f]">GitHub</p>
          <h2
            className="font-dsp mt-4"
            style={{ fontSize: "clamp(36px,5vw,72px)", lineHeight: 1, letterSpacing: "-.02em" }}
          >
            What I've pushed lately
          </h2>
        </Reveal>
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-12">
          {data.calendar && (
            <Reveal className="min-w-0 lg:col-span-7">
              <Calendar calendar={data.calendar} />
            </Reveal>
          )}
          {data.commits.length > 0 && (
            <Reveal delay={0.1} className="min-w-0 lg:col-span-5">
              <Commits commits={data.commits} />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
};

export default GitHubActivity;
