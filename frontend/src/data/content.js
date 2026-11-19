// All real content facts for Abel Sabu's portfolio (from resume + discovery answers).
export const PROFILE = {
  name: "Abel Sabu",
  location: "Toronto or remote",
  differentiator: "I build AI agents that actually run in production, backed by real cloud plumbing.",
  calendly: "https://calendly.com/sabuabel2003/30min",
  email: "sabuabel2003@gmail.com",
  github: "https://github.com/Abel356",
  githubLabel: "github.com/Abel356",
  linkedin: "https://www.linkedin.com/in/abel-sabu-30651121a/",
  linkedinLabel: "linkedin.com/in/abel-sabu-30651121a",
};

export const HERO_LINES = ["AI agents", "that run"];
export const HERO_PHRASES = ["in production.", "past the demo.", "on real cloud.", "while I sleep."];

export const EXPERIENCE = [
  {
    date: "Sep 2026 – Present",
    role: "Cloud Engineering Intern",
    org: "Vosyn",
    detail:
      "Eliminated 6 hrs/week of manual ops with Python automation; cut cloud spend 18% and deployment time 40%; 99.9% uptime; 25+ GCP resources via Terraform / Kubernetes.",
  },
  {
    date: "Jun – Aug 2026",
    role: "AI Engineering Fellow",
    org: "Metis Foundation · OpenClaw Summer Fellowship",
    detail:
      "Shipped Triage, a live Telegram agent that cut wallet investigation time 80% (from ~45+ min per wallet).",
  },
  {
    date: "May – Sep 2026 · SF",
    role: "AI Trainer",
    org: "Outlier AI",
    detail:
      "Cut manual processing 60% for 10+ client processes with n8n agentic workflows; 98% data accuracy over 5,000+ records via SQL checks.",
  },
  {
    date: "Sep 2023 – Apr 2026",
    role: "Client Service Rep, Team Lead",
    org: "York University",
    detail: "Led 40+ staff; 15% satisfaction lift via the RATER service model.",
  },
  {
    date: "May – Sep 2024",
    role: "IT Assistant",
    org: "York University",
    detail: "500+ devices deployed 30% faster via SCCM imaging and secure cloud migration.",
  },
];

// repo / demo are optional: a button only renders when its URL is filled in.
export const PROJECTS = [
  {
    name: "Triage",
    tag: "Live agent",
    detail:
      "Read-only crypto-tax agent labeling every finding RECONCILED / ASSUMPTION / UNRECONCILED, monetized with an x402 pay-per-report flow at $9.99.",
    stack: "OpenClaw · Telegram · GOAT Network · ERC-8004 · x402",
    repo: "https://github.com/Abel356/Triage-Openclaw-Internship",
    demo: "https://triage-amber-iota.vercel.app",
    clip: "/media/triage-demo.mp4",
    poster: "/media/triage-demo-poster.jpg",
  },
  {
    name: "Bastion",
    tag: "2026",
    detail:
      "Permission-aware AI agent with ACL-filtered retrieval and native citations, a deterministic policy engine + audit log, and a 40-case eval harness in CI.",
    stack: "FastAPI · React · TypeScript · Cohere · PostgreSQL · pgvector · Docker",
    repo: "https://github.com/Abel356/Bastion",
    demo: "",
  },
  {
    name: "Precogni",
    tag: "Hack the 6ix",
    detail:
      "Real-time driver-fatigue detector shipped in 3 days with a 4-person team — flags eye closure, yawning and head tilt with Gemini-driven alerts.",
    stack: "Python · Gemini API · OpenCV · Whisper",
    repo: "https://github.com/Abel356/HackThe6ix",
    demo: "",
  },
  {
    name: "SaveBetter",
    tag: "AWS Hackathon",
    detail:
      "Adaptive savings engine with GPT-4 behavioral analysis, delivering personalized recommendations on live data from 6+ Canadian banks.",
    stack: "Next.js · TypeScript · GPT-4",
    repo: "https://github.com/Abel356/SaveBetter_KiroHackathon",
    demo: "https://save-better-kiro-hackathon-6njl.vercel.app/",
  },
];

export const TRIAGE_ROWS = [
  { label: "Swap · block 1", status: "Reconciled", color: "#b9d08a" },
  { label: "Bridge transfer", status: "Assumption", color: "#e2c08a" },
  { label: "Airdrop claim", status: "Unreconciled", color: "#f0a98a" },
];

export const METRICS = [
  { value: 80, decimals: 0, suffix: "%", label: "less wallet investigation time" },
  { value: 99.9, decimals: 1, suffix: "%", label: "uptime at Vosyn" },
  { value: 18, decimals: 0, suffix: "%", label: "cloud spend cut" },
  { value: 60, decimals: 0, suffix: "%", label: "manual processing cut" },
];

export const HACKATHONS = [
  { name: "Hack the Valley", note: "×2" },
  { name: "Hack the 6ix" },
  { name: "Cursor" },
  { name: "OpenClaw" },
  { name: "OpenAI" },
  { name: "AWS (Kiro)" },
  { name: "Google" },
  { name: "Microsoft (Azure)" },
];

// Add more notes by appending to this list. `lead` paragraphs always show; `more` sits behind "Keep reading".
export const NOTES = [
  {
    id: "the-hard-part",
    title: "Turns out the “hard” part was the interesting part.",
    lead: [
      "Growing up, I had no idea what I wanted to be. What I did know: I loved puzzles. Hand me something tangled and I couldn't leave it alone until it made sense. So computer science seemed obvious. It wasn't. It felt hard, and it came with my nemesis: math, in every form. We did not get along. (We're on better terms now. A cold war, mostly.)",
      "What kept me going was the feeling of a problem finally clicking. That turned into building. I've shipped projects across AI, fintech, computer vision, and cloud at hackathons (won 3 of 9), and built Triage, an AI crypto tax agent that cut manual wallet investigation time by about 80%.",
    ],
    more: [
      "Today I'm a Cloud Engineering Intern at Vosyn, working with GCP, Terraform, Kubernetes, and Python. Faster deployments, less manual work, lower cloud costs. The puzzles get better when real systems depend on the answer.",
      "I graduate from York University in April 2027 and I'm looking for new grad Software Engineering roles across backend, cloud, APIs, and AI. The goal is to become a strong end-to-end engineer, ideally alongside people who are kind, curious, and happy to explain things twice.",
      "Outside of work, you'll find me at a pickleball court or a pool, or somewhere new. If you play pickleball, swim, or just want to swap travel stories, message me. I'm always down for new experiences.",
    ],
    tech: "Python, TypeScript, Java, SQL, GCP, AWS, Azure, Terraform, Kubernetes, React, Node.js",
  },
];

export const SKILLS = [
  { key: "languages", value: "Python, Java, TypeScript/JS, SQL, C/C++, R, Shell" },
  {
    key: "cloud_devops",
    value: "GCP, Azure, AWS, Terraform, Docker, Kubernetes, GitHub Actions, MLflow",
  },
  { key: "ai_data", value: "LLM/agentic workflows, RAG, Cohere, n8n, pgvector, pandas" },
  { key: "web", value: "React, Next.js, Node.js, FastAPI" },
];

export const CERTS = [
  "Google Cloud: Introduction to LLMs",
  "Google Cloud: Introduction to Terraform for GCP",
];

export const LEADERSHIP = [
  {
    stat: "+45%",
    role: "President, Entrepreneurs Club",
    detail: "Sep 2025 – Apr 2026 · led a team of 6 across 10 events, +45% attendance.",
  },
  {
    stat: "40 → 110",
    role: "President, Cook Club",
    detail: "Sep 2024 – Apr 2025 · launched a Global Kitchen series, cut event costs 25%.",
  },
];

export const INTERESTS =
  "Travelling (14 countries), video games, anime, hockey, golf, tennis, pickleball, swimming and reading.";

export const IMAGES = {
  mountains:
    "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
};
