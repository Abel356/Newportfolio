# Abel Sabu — Personal Portfolio

## Problem Statement
Revamp Abel Sabu's personal website with an earthy, minimalist aesthetic. Resume + LinkedIn provided. Goal: land internships/new-grad roles, show off projects & hackathon wins.

## Discovery Answers
- Goal: internships/new-grad roles + showcase projects/hackathons
- Audience: cloud/DevOps recruiters, AI/ML teams, startup founders
- Location: Toronto or remote
- Differentiator: "I build AI agents that actually run in production"
- Reach-out: Book a call — Calendly https://calendly.com/sabuabel2003/30min

## Design
User chose "something different" — a hybrid of 3 generated directions:
- dir1: earthy background (#efe7da) + "Where I've shipped" experience section
- dir2: terminal/code-styled Skills section (`cat skills.yml`) + animations
- dir3: hero typewriter + curved-edge interactive Triage panel
Palette: ground #efe7da, muted #e3d6c3, ink #2b2119, accent #a8471f, terminal green #8f9a6a.
Fonts: Playfair Display (display), Manrope (body), JetBrains Mono (mono).

## Architecture
- Frontend: React (CRA), framer-motion, Tailwind. Single page (Portfolio.jsx) + section components in src/components/portfolio/. Content in src/data/content.js.
- Backend: FastAPI + MongoDB, used only for the contact form (backend/contact.py). Integrations: Emergent managed email; Calendly is an external link.

## Implemented (2026-11-19)
- Fixed nav, hero (typewriter CLI + 3D floating Triage panel), hackathon marquee
- About (3/9), Experience timeline, Projects (4 cards), Metrics band, Hackathons (3/9), Skills terminal, Education/Certs, Leadership, Interests (mountain image), Contact (Calendly CTA + email/LinkedIn/GitHub), Footer
- Responsive 1920/768/390; all CTAs point to Calendly

## Implemented (2026-11-19, revision 2 — user feedback)
- Hero: canvas moving-dot field (DotField.jsx) + typed rotating endings after "AI agents that run" (HERO_PHRASES). Triage panel removed from hero.
- Notes section (Notes.jsx, NOTES in content.js): user's own essay, verbatim, with "Keep reading" expand. Replaces the old About block.
- Projects: Triage featured card now holds the triage run-report panel; repo/demo buttons render only when `repo`/`demo` is set in content.js. Linked: Triage (repo + live demo), Bastion (repo), Precogni (repo = HackThe6ix fork, named ALEx! in its README). SaveBetter has no links.
- Hackathons: 3/9 graphics and marquee removed; compact "Hackathons attended" chip row with the user's list (Hack the Valley listed twice by user -> shown as x2).
- On the record: resume tagline removed; numbers count up on scroll (CountUp.jsx).
- Palette tightened to ground #efe7da / muted #e3d6c3 / ink #2b2119 / accent #a8471f (+ #e2a07a accent on dark, terminal green only inside terminals). Skills terminal untouched.
- Verified with screenshots + link assertions at 1920 and 390 (testing agent not used).

## Implemented (2026-11-19, revision 3)
- Triage card: real demo clip from the user's repo (public/media/triage-demo.mp4 + poster) via HoverClip.jsx — plays muted on hover/tap, kept alongside the run-report panel.
- SaveBetter: repo + live demo links added. Bastion, Precogni, SaveBetter remain text-only (no visuals supplied yet).

## Implemented (2026-11-19, revision 4)
- Hero: four user photos (public/media/abel-*.jpg, HERO_PHOTOS in content.js) in a staggered two-column stack beside the headline (PhotoStack.jsx); warm sand frame that turns terracotta and image zooms on hover. One row of four on mobile.
- Triage clip: now full width of the Triage card, zoomed (scale 1.16) so the purple recording border is cropped out, warm frame.

## Implemented (2026-11-19, revision 5)
- Hero photo captions on hover: AWS Summit, Vosyn AI (Internship), Hack the 6ix, Niagara.
- Project visuals (ProjectVisual.jsx): Bastion = coded run-timeline panel based on the repo (AI image garbled UI text, discarded); Precogni = AI-generated driver-camera image with signal labels; SaveBetter = real screenshot of the live demo.
- Notes: AI-drawn math-monster meme beside Note 01 with HTML captions (meme field in NOTES).

## Implemented (2026-11-19, revision 6)
- Hero photo lightbox (shadcn Dialog in PhotoStack.jsx): click opens photo large with caption.
- Get in touch block inside Contact: ContactForm.jsx -> POST /api/contact (backend/contact.py). Stores in `contact_messages`, emails OWNER_EMAIL via Emergent managed email (fixed subject + escaped server template, honeypot, 3/hour per IP and 40/day limits). Env: EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME, OWNER_EMAIL.
- Notes: meme captions removed; six AI-drawn math-monster pictures (3 "enemy" left, 3 matching "friend" right; `memes.before/after` in NOTES).
- Tested: curl (validation 422, honeypot, real send 200), UI form with mocked response, lightbox open/close, 1920 + 390 screenshots. Testing agent not used.

## Revision 7 (2026-11-19)
- Owner email removed from every public spot (get-in-touch block, call card, footer, content.js). It now lives only in backend OWNER_EMAIL; the form is the only route to it.

## Implemented (2026-11-20, revision 8)
- CareTrace project card added (repo https://github.com/Abel356/CareTrace). Repo is docs-only (PRD/TODO), so the card is tagged "In discovery", copy says "I'm designing", stack is prefixed "Planned:", and the panel is labelled "planned workflow". Do not describe it as built until code exists.
- ProjectVisual: Bastion-only panel generalised to a data-driven `status-panel` (project.panel in content.js); status text wraps on narrow screens.
- Small project cards now a 2x2 grid (was 3 across) to fit four cards.
- SaveBetter screenshot recaptured (previous capture was caught mid fade-in and looked washed out).

## Implemented (2026-11-20, revision 9)
- Bastion and CareTrace visuals: light switchable panel (tabs). Bastion = Flow / Chat; CareTrace = Flow / Compare / Checklist (`views` in content.js). User is still choosing which to keep; remove the tabs once they pick one each.
- LinkedIn and GitHub are icon buttons (contact card + footer); typed-out URLs removed.
- Source tidy-up: frontend/src went from 70 files to 13, same rendered page (DOM, test ids and text compared before/after; production build passes).
  - src layout now: index.js, index.css, App.js, data/content.js, lib/utils.js, components/ui/dialog.jsx, pages/Portfolio.jsx (also holds Experience, Skills, Metrics, Hackathons, Contact, Footer), components/portfolio/{Hero,Projects,Notes,ContactForm,Nav,shared}.jsx
  - Hero.jsx contains Typewriter, DotField, PhotoStack. Projects.jsx contains HoverClip, the view components and ProjectVisual. shared.jsx = Reveal, CountUp, SocialLinks.
  - Removed 45 unused shadcn ui components, hooks/use-toast.js, constants/testIds. Re-add a shadcn component if one is needed later.

## Revision 10 (2026-11-20)
- Flow view: step circles fill as the marker passes. Marker and fills share one framer-motion clock in FlowView (Projects.jsx) with measured circle positions; the old CSS flow-dot keyframes were removed.

## Implemented (2026-11-20, revision 11) — GitHub block
- New section "What I've pushed lately" between Projects and Hackathons (components/portfolio/GitHubActivity.jsx): contribution calendar in the site palette (total counts up; phones show last 6 months) + dark "latest commit" card with 3 earlier commits. Frontend polls every 60s (react-query); a new commit slides in without reload.
- Backend: backend/github_activity.py -> GET /api/github/activity. No token. Env: GITHUB_USERNAME.
  - Calendar: parsed from public page github.com/users/<name>/contributions (not an official API; sanity check of >=300 days, otherwise stored copy is kept). Refreshed every 30 min.
  - Commits: public events API (PushEvent head SHA) + commit endpoint for the message; events checked every 3 min with ETag, each commit SHA cached forever. Only first line, repo, short sha, url, date are returned (no author email).
  - All cached in Mongo `github_cache`; failures serve the stored copy.
- Tests: backend/tests/test_github_activity.py (3 passing, uses saved fixture of the real page). UI: simulated new commit verified in browser at 1920 and 390.
- If exact/guaranteed calendar data is wanted later: switch to GitHub GraphQL with a user token (collect via secrets tool).

## Backlog / Next
- P1: Update CareTrace card (tag, copy, stack, real screenshot) once a prototype exists
- P1: Replace Bastion/Precogni visuals with real captures when available
- P1: Resume PDF download button
- P2: Light SEO (sitemap, JSON-LD Person schema), OG image
- P2: More notes (append to NOTES in content.js)
