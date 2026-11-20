import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { OWNER_FLAG } from "@/lib/track";

const api = axios.create({ baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`, withCredentials: true });

// The sign-in lasts 15 minutes at a time; when it lapses, renew it once quietly and repeat the request.
api.interceptors.response.use(undefined, async (error) => {
  const { config, response } = error;
  if (response?.status !== 401 || config.retried || config.url.startsWith("/auth/")) throw error;
  await api.post("/auth/refresh");
  return api({ ...config, retried: true });
});

const errorText = (err) => {
  const detail = err.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return "Enter a valid email and password.";
  return "Could not sign in. Please try again.";
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CARD = "rounded-[24px] border border-[#2b2119]/15 bg-[#f6f0e6] p-6 md:p-7";
const FIELD =
  "mt-2 w-full rounded-[14px] border border-[#2b2119]/25 bg-[#efe7da] px-4 py-3 outline-none transition-colors focus:border-[#a8471f]";

const duration = (s) => (s >= 60 ? `${Math.floor(s / 60)}m ${Math.round(s % 60)}s` : `${Math.round(s)}s`);
const shortDate = (iso) => new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
// Terracotta at a strength between 6% and 100%, for heatmap cells.
const heat = (value, max) => `rgba(168,71,31,${max ? 0.06 + 0.94 * (value / max) : 0.06})`;

const Login = ({ onSignedIn }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [state, setState] = useState({ busy: false, error: "" });
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: "" });
    try {
      await api.post("/auth/login", form);
      localStorage.setItem(OWNER_FLAG, "1");
      onSignedIn();
    } catch (err) {
      setState({ busy: false, error: errorText(err) });
    }
  };

  return (
    <form onSubmit={submit} className={`${CARD} mx-auto mt-24 w-full max-w-md space-y-5`} data-testid="admin-login-form">
      <div>
        <p className="lab text-[#a8471f]">Private</p>
        <h1 className="font-dsp mt-3 text-4xl">Analytics sign-in</h1>
      </div>
      <label htmlFor="email" className="block text-sm">
        Email
        <input id="email" name="email" type="email" required autoComplete="username" value={form.email} onChange={set} className={FIELD} data-testid="admin-login-email" />
      </label>
      <label htmlFor="password" className="block text-sm">
        Password
        <input id="password" name="password" type="password" required autoComplete="current-password" value={form.password} onChange={set} className={FIELD} data-testid="admin-login-password" />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-[#a8471f]" data-testid="admin-login-error">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={state.busy}
        data-testid="admin-login-submit"
        className="w-full rounded-full bg-[#2b2119] px-7 py-3.5 text-[#efe7da] transition-colors hover:bg-[#a8471f] disabled:opacity-60"
      >
        {state.busy ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};

const Tile = ({ label, value, note, testId, live }) => (
  <div className={`${CARD} min-w-0`} data-testid={testId}>
    <p className="lab flex items-center gap-2 text-[#6b5848]">
      {live && <span className="h-2 w-2 animate-pulse rounded-full bg-[#a8471f]" />}
      {label}
    </p>
    <p className="font-dsp tab mt-3 text-4xl leading-none md:text-5xl">{value}</p>
    {note && <p className="mt-2 text-xs text-[#6b5848]">{note}</p>}
  </div>
);

const Panel = ({ title, hint, children, className = "", testId }) => (
  <section className={`${CARD} min-w-0 ${className}`} data-testid={testId}>
    <h2 className="font-dsp text-2xl">{title}</h2>
    {hint && <p className="mt-1 text-xs text-[#6b5848]">{hint}</p>}
    <div className="mt-5">{children}</div>
  </section>
);

const Empty = () => <p className="text-sm text-[#6b5848]">Nothing yet.</p>;

const BarList = ({ rows }) => {
  const max = Math.max(...rows.map((r) => r.count), 1);
  if (!rows.length) return <Empty />;
  return (
    <ul className="space-y-2.5 text-sm">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex justify-between gap-3">
            <span className="min-w-0 truncate">{r.label}</span>
            <span className="tab font-mono text-xs text-[#6b5848]">{r.count}</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-[#2b2119]/10">
            <div className="h-full rounded-full bg-[#a8471f]" style={{ width: `${(100 * r.count) / max}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
};

const DailyBars = ({ daily }) => {
  const max = Math.max(...daily.map((d) => d.visits), 1);
  return (
    <div>
      <div className="flex h-36 items-end gap-[3px]" data-testid="admin-daily-bars">
        {daily.map((d) => (
          <div
            key={d.date}
            title={`${d.visits} visit${d.visits === 1 ? "" : "s"} on ${d.date}`}
            className="flex-1 rounded-t-[3px] bg-[#a8471f] transition-opacity hover:opacity-70"
            style={{ height: `${Math.max((100 * d.visits) / max, d.visits ? 4 : 1)}%`, opacity: d.visits ? undefined : 0.2 }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-[#6b5848]">
        <span>{daily[0].date}</span>
        <span>today</span>
      </div>
    </div>
  );
};

// The page drawn as a stack of its sections: the darker the block, the longer people stay there.
const PageHeatmap = ({ sections }) => {
  const max = Math.max(...sections.map((s) => s.avg_seconds), 0);
  return (
    <ol className="space-y-1.5" data-testid="admin-page-heatmap">
      {sections.map((s) => {
        const strong = max && s.avg_seconds / max > 0.55;
        return (
          <li
            key={s.id}
            data-testid={`admin-heat-${s.id}`}
            className={`flex items-center justify-between gap-4 rounded-[12px] px-4 py-3 text-sm ${strong ? "text-[#efe7da]" : "text-[#2b2119]"}`}
            style={{ backgroundColor: heat(s.avg_seconds, max) }}
          >
            <span className="font-semibold">{s.label}</span>
            <span className="tab shrink-0 font-mono text-xs">
              {duration(s.avg_seconds)} avg · {s.reached_pct}% reach it
            </span>
          </li>
        );
      })}
    </ol>
  );
};

const WhenHeatmap = ({ when }) => {
  const max = Math.max(...when.flat(), 0);
  return (
    <div className="overflow-x-auto" data-testid="admin-when-heatmap">
      <div className="min-w-[520px] space-y-[3px]">
        {when.map((row, d) => (
          <div key={DAYS[d]} className="flex items-center gap-[3px]">
            <span className="w-9 shrink-0 text-[11px] text-[#6b5848]">{DAYS[d]}</span>
            {row.map((n, h) => (
              <span
                key={h}
                title={`${n} visit${n === 1 ? "" : "s"} · ${DAYS[d]} ${h}:00`}
                className="h-5 flex-1 rounded-[3px]"
                style={{ backgroundColor: heat(n, max) }}
              />
            ))}
          </div>
        ))}
        <div className="flex gap-[3px] pl-[39px] text-[11px] text-[#6b5848]">
          {["12am", "6am", "12pm", "6pm"].map((t) => (
            <span key={t} className="flex-1">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Plain-language pointers. Held back until there are enough visits for a pattern to mean something.
const takeaways = (s) => {
  if (s.month.visits < 20) return [];
  const out = [];
  const drops = s.sections.slice(1).map((sec, i) => ({ from: s.sections[i], to: sec, lost: s.sections[i].reached_pct - sec.reached_pct }));
  const worst = drops.reduce((a, b) => (b.lost > a.lost ? b : a));
  if (worst.lost >= 15) out.push(`${worst.lost}% of visitors leave between ${worst.from.label} and ${worst.to.label}. Consider shortening ${worst.from.label} or moving ${worst.to.label} higher.`);
  const longest = s.sections.reduce((a, b) => (b.avg_seconds > a.avg_seconds ? b : a));
  out.push(`${longest.label} holds attention longest (${duration(longest.avg_seconds)} on average). That is what people come for.`);
  if (s.bounce_pct >= 50) out.push(`${s.bounce_pct}% leave within 10 seconds without scrolling. The first screen may not be making the point fast enough.`);
  if (s.booked_pct === 0) out.push("Nobody has clicked Book a call in the last 30 days.");
  return out;
};

const Recent = ({ rows }) =>
  rows.length ? (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm" data-testid="admin-recent-visits">
        <thead className="lab text-[#6b5848]">
          <tr>
            {["When", "From", "Country", "Device", "Time", "Got as far as"].map((h) => (
              <th key={h} className="pb-3 pr-4 font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.at} className="border-t border-[#2b2119]/15">
              <td className="tab py-2.5 pr-4">{shortDate(r.at)}</td>
              <td className="pr-4">{r.source}</td>
              <td className="pr-4">{r.country}</td>
              <td className="pr-4">{r.device}</td>
              <td className="tab pr-4">{duration(r.seconds)}</td>
              <td>{r.furthest}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <Empty />
  );

const Dashboard = ({ onSignOut }) => {
  const { data: s, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/stats", { params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } }).then((r) => r.data),
    refetchInterval: 10_000,
  });
  if (isError) return <p className="mt-24 text-center text-[#a8471f]">Could not load the numbers. Refresh to try again.</p>;
  if (!s) return <p className="mt-24 text-center text-[#6b5848]">Loading...</p>;
  const notes = takeaways(s);

  return (
    <div data-testid="admin-dashboard">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="lab text-[#a8471f]">Private · only you can see this</p>
          <h1 className="font-dsp mt-3 text-5xl">Analytics</h1>
        </div>
        <div className="flex gap-3 text-sm">
          <Link to="/" className="rounded-full border border-[#2b2119] px-5 py-2 transition-colors hover:bg-[#2b2119] hover:text-[#efe7da]" data-testid="admin-back-to-site">
            Back to site
          </Link>
          <button type="button" onClick={onSignOut} className="rounded-full bg-[#2b2119] px-5 py-2 text-[#efe7da] transition-colors hover:bg-[#a8471f]" data-testid="admin-sign-out">
            Sign out
          </button>
        </div>
      </header>

      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile label="On the site now" value={s.live_now} live testId="admin-live-now" />
        <Tile label="Today" value={s.today.visits} note={`${s.today.visitors} people`} testId="admin-today" />
        <Tile label="Last 7 days" value={s.week.visits} note={`${s.week.visitors} people`} testId="admin-week" />
        <Tile label="Last 30 days" value={s.month.visits} note={`${s.month.visitors} people`} testId="admin-month" />
        <Tile label="Average time" value={duration(s.avg_seconds)} note="actively reading, per visit" testId="admin-avg-time" />
        <Tile label="Left right away" value={`${s.bounce_pct}%`} note="under 10s, no scrolling" testId="admin-bounce" />
        <Tile label="Clicked Book a call" value={`${s.booked_pct}%`} note="of visits" testId="admin-booked" />
      </div>
      <p className="mt-3 text-xs text-[#6b5848]">
        Everything below covers the last 30 days and excludes bots and your own visits. "People" are counted per day, so someone who returns on another day counts again.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Panel title="Visits per day" className="lg:col-span-2" testId="admin-daily">
          <DailyBars daily={s.daily} />
        </Panel>
        {notes.length > 0 && (
          <Panel title="What to change" className="lg:col-span-2" testId="admin-takeaways">
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
              {notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Panel>
        )}
        <Panel title="Where attention goes" hint="Your page from top to bottom. Darker means people spend longer there." testId="admin-attention">
          <PageHeatmap sections={s.sections} />
        </Panel>
        <div className="min-w-0 space-y-4">
          <Panel title="When people visit" hint="In your local time. Darker means more visits.">
            <WhenHeatmap when={s.when} />
          </Panel>
          <Panel title="What they clicked" testId="admin-clicks">
            <BarList rows={s.clicks} />
          </Panel>
        </div>
        <Panel title="Where they came from" testId="admin-sources">
          <BarList rows={s.sources} />
        </Panel>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <Panel title="Countries" testId="admin-countries">
            <BarList rows={s.countries} />
          </Panel>
          <Panel title="Devices" testId="admin-devices">
            <BarList rows={s.devices} />
          </Panel>
        </div>
        <Panel title="Latest visits" className="lg:col-span-2">
          <Recent rows={s.recent} />
        </Panel>
      </div>
    </div>
  );
};

export default function Admin() {
  const queryClient = useQueryClient();
  const me = useQuery({ queryKey: ["admin-me"], queryFn: () => api.get("/auth/me").then((r) => r.data), retry: false });
  const recheck = () => queryClient.invalidateQueries({ queryKey: ["admin-me"] });
  const signOut = async () => {
    await api.post("/auth/logout");
    queryClient.removeQueries({ queryKey: ["admin-stats"] });
    queryClient.resetQueries({ queryKey: ["admin-me"] });
  };

  return (
    <main className="min-h-screen bg-[#efe7da] px-6 py-12 text-[#2b2119]" data-testid="admin-page">
      <div className="mx-auto max-w-6xl">
        {me.isPending ? null : me.isSuccess ? <Dashboard onSignOut={signOut} /> : <Login onSignedIn={recheck} />}
        {me.isError && (
          <p className="mt-6 text-center text-sm">
            <Link to="/" className="text-[#a8471f] underline underline-offset-4" data-testid="admin-login-back">
              Back to site
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
