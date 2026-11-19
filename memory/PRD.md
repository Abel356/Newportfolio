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
- Backend: FastAPI template unchanged (static content site, no DB usage needed). No integrations (Calendly is external link).

## Implemented (2026-11-19)
- Fixed nav, hero (typewriter CLI + 3D floating Triage panel), hackathon marquee
- About (3/9), Experience timeline, Projects (4 cards), Metrics band, Hackathons (3/9), Skills terminal, Education/Certs, Leadership, Interests (mountain image), Contact (Calendly CTA + email/LinkedIn/GitHub), Footer
- Responsive 1920/768/390; all CTAs point to Calendly

## Backlog / Next
- P1: Project detail pages / live demo links & GitHub repo links per project
- P1: Resume PDF download button
- P2: Light SEO (sitemap, JSON-LD Person schema), OG image
- P2: Blog / writing section for personal brand
