// Anonymous visit tracking for the owner's private analytics page.
// Stores nothing in the visitor's browser: the visit id below lives only while the page is open.
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
export const OWNER_FLAG = "portfolio-owner"; // set in the owner's own browser at sign-in so their visits are skipped

const SECTION_IDS = [
  "top", "notes", "experience", "projects", "github", "hackathons",
  "numbers", "skills", "education", "leadership", "interests", "contact",
];
const BEAT_MS = 15000;
const IDLE_MS = 60000; // stop counting reading time when nothing has moved for a minute

// Buttons worth counting, matched against the element's data-testid.
const CLICKS = [
  [/book-call$/, () => "Book a call"],
  [/^project-(.+)-repo$/, (m) => `Repo: ${title(m[1])}`],
  [/^project-(.+)-demo$/, (m) => `Live demo: ${title(m[1])}`],
  [/^project-(.+)-clip$/, (m) => `Demo clip: ${title(m[1])}`],
  [/^project-(.+)-view-(.+)$/, (m) => `View tab: ${title(m[1])} ${m[2]}`],
  [/-linkedin$/, () => "LinkedIn"],
  [/-github$/, () => "GitHub profile"],
  [/^hero-see-work$/, () => "See the work"],
  [/^note-.+-toggle$/, () => "Keep reading"],
  [/^hero-photo-[a-z0-9-]+$/, () => "Photo opened"],
  [/^github-latest-commit$/, () => "Latest commit"],
  [/^contact-form-submit$/, () => "Send message"],
  [/^nav-link-(.+)$/, (m) => `Menu: ${title(m[1])}`],
];

const send = (body) =>
  fetch(`${API}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true, // lets the last reading go out while the tab is closing
    credentials: "include",
  }).catch(() => {});

const currentSection = () => {
  const middle = window.innerHeight / 2;
  return SECTION_IDS.find((id) => {
    const box = document.getElementById(id)?.getBoundingClientRect();
    return box && box.top <= middle && box.bottom > middle;
  });
};

// One id per page load, kept in memory only. Leaving for /admin and coming back continues the same visit.
const sid = crypto.randomUUID();
let announced = false;
const title = (slug) => slug.charAt(0).toUpperCase() + slug.slice(1);

// Starts tracking this page view and returns a function that stops it.
export const startTracking = () => {
  if (navigator.webdriver || localStorage.getItem(OWNER_FLAG)) return () => {};

  const params = new URLSearchParams(window.location.search);
  const tag = (params.get("ref") || params.get("utm_source") || "").replace(/[^\w.-]/g, "").slice(0, 40);
  let dwell = {};
  let lastActive = Date.now();

  if (!announced) send({ type: "visit", sid, referrer: document.referrer.slice(0, 300), tag });
  announced = true;

  const active = () => {
    lastActive = Date.now();
  };
  const tick = () => {
    if (document.visibilityState !== "visible" || Date.now() - lastActive > IDLE_MS) return;
    const section = currentSection();
    if (section) dwell[section] = (dwell[section] || 0) + 1;
  };
  const beat = () => {
    if (document.visibilityState !== "visible" && !Object.keys(dwell).length) return;
    send({ type: "beat", sid, dwell });
    dwell = {};
  };
  const onClick = (e) => {
    const id = e.target.closest?.("[data-testid]")?.dataset.testid;
    if (!id) return;
    for (const [pattern, name] of CLICKS) {
      const match = id.match(pattern);
      if (match) return void send({ type: "click", sid, name: name(match) });
    }
  };
  const onHide = () => {
    if (document.visibilityState === "hidden") beat();
  };

  const activity = ["scroll", "pointermove", "keydown", "touchstart"];
  activity.forEach((name) => window.addEventListener(name, active, { passive: true }));
  document.addEventListener("click", onClick, true);
  document.addEventListener("visibilitychange", onHide);
  window.addEventListener("pagehide", beat);
  const ticker = setInterval(tick, 1000);
  const beater = setInterval(beat, BEAT_MS);

  return () => {
    beat();
    clearInterval(ticker);
    clearInterval(beater);
    activity.forEach((name) => window.removeEventListener(name, active));
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("pagehide", beat);
  };
};
