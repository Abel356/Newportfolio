import { useEffect, useRef, useState } from "react";
import { PROFILE, HERO_LINES, HERO_PHRASES, HERO_PHOTOS } from "@/data/content";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Smooth dynamic typewriter that cycles through phrases (dir3's "dynamic writing").
const Typewriter = ({ phrases, className = "", typing = 55, pause = 1800 }) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setText(phrases[0]);
      return;
    }
    const current = phrases[index % phrases.length];
    let timeout;
    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => i + 1);
    } else {
      timeout = setTimeout(() => {
        setText((t) =>
          deleting ? current.slice(0, t.length - 1) : current.slice(0, t.length + 1)
        );
      }, deleting ? typing / 1.8 : typing);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, phrases, typing, pause]);

  return (
    <span className={className} data-testid="hero-typewriter">
      {text}
      <span
        aria-hidden="true"
        className="caret ml-[0.08em] inline-block h-[0.78em] w-[0.05em] min-w-[2px] bg-current align-baseline"
      />
    </span>
  );
};

const INK = "43,33,25";
const ACCENT = "168,71,31";
const LINK_DIST = 130;

const makeDots = (w, h) =>
  Array.from({ length: Math.min(110, Math.round((w * h) / 14000)) }, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: 1 + Math.random() * 1.6,
    rgb: i % 7 === 0 ? ACCENT : INK,
  }));

const step = (d, w, h, mouse) => {
  d.x += d.vx;
  d.y += d.vy;
  if (d.x < 0 || d.x > w) d.vx *= -1;
  if (d.y < 0 || d.y > h) d.vy *= -1;
  const dx = d.x - mouse.x;
  const dy = d.y - mouse.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 120 && dist > 0) {
    d.x += (dx / dist) * 0.8;
    d.y += (dy / dist) * 0.8;
  }
};

const draw = (ctx, dots, w, h) => {
  ctx.clearRect(0, 0, w, h);
  dots.forEach((a, i) => {
    for (let j = i + 1; j < dots.length; j++) {
      const b = dots[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < LINK_DIST) {
        ctx.strokeStyle = `rgba(${INK},${0.1 * (1 - dist / LINK_DIST)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    ctx.fillStyle = `rgba(${a.rgb},${a.rgb === ACCENT ? 0.55 : 0.28})`;
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
    ctx.fill();
  });
};

// Drifting dot field behind the hero. Dots link when close and ease away from the cursor.
const DotField = () => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -999, y: -999 };
    let dots = [];
    let w = 0;
    let h = 0;
    let frame;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = makeDots(w, h);
      draw(ctx, dots, w, h);
    };
    const tick = () => {
      dots.forEach((d) => step(d, w, h, mouse));
      draw(ctx, dots, w, h);
      frame = requestAnimationFrame(tick);
    };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    resize();
    if (!still) frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      data-testid="hero-dot-field"
      className="absolute inset-0 h-full w-full"
    />
  );
};

const Photo = ({ photo, delay }) => (
  <Dialog>
    <DialogTrigger asChild>
      <button
        type="button"
        aria-label={`Open photo: ${photo.caption}`}
        className={`group fu relative block w-full cursor-zoom-in overflow-hidden rounded-[20px] border-[5px] border-[#e3d6c3] bg-[#e3d6c3] shadow-[0_24px_50px_-28px_rgba(43,33,25,0.55)] transition-[border-color] duration-500 hover:border-[#a8471f] aspect-[3/4] ${photo.shape}`}
        style={{ animationDelay: `${delay}s` }}
        data-testid={`hero-photo-${photo.id}`}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className={`h-full w-full rounded-[14px] object-cover ${photo.focus} sepia-[.18] saturate-[.9] transition-[transform,filter] duration-700 ease-out group-hover:scale-110 group-hover:sepia-0 group-hover:saturate-100`}
        />
        <span className="lab absolute inset-x-2 bottom-2 truncate rounded-full bg-[#2b2119]/85 px-3 py-1.5 text-center text-[#efe7da] opacity-0 translate-y-2 transition-[opacity,transform] duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          {photo.caption}
        </span>
      </button>
    </DialogTrigger>
    <DialogContent
      className="w-auto max-w-[92vw] gap-0 rounded-[24px] border-[6px] border-[#e3d6c3] bg-[#efe7da] p-0 text-[#2b2119] sm:rounded-[24px]"
      data-testid={`hero-photo-${photo.id}-lightbox`}
    >
      <img src={photo.src} alt={photo.alt} className="max-h-[78vh] w-auto max-w-full rounded-t-[18px] object-contain" />
      <DialogTitle className="font-dsp px-5 py-4 text-xl font-normal">{photo.caption}</DialogTitle>
      <DialogDescription className="sr-only">{photo.alt}</DialogDescription>
    </DialogContent>
  </Dialog>
);

// Two staggered columns beside the hero text on desktop, a single row of four on small screens.
const PhotoStack = () => (
  <div className="grid grid-cols-4 gap-3 lg:flex lg:gap-4" data-testid="hero-photos">
    {[HERO_PHOTOS.slice(0, 2), HERO_PHOTOS.slice(2)].map((column, c) => (
      <div
        key={column[0].id}
        className={`contents lg:flex lg:flex-1 lg:flex-col lg:gap-4 ${c === 1 ? "lg:mt-14" : ""}`}
      >
        {column.map((photo, i) => (
          <Photo key={photo.id} photo={photo} delay={0.6 + (c * 2 + i) * 0.12} />
        ))}
      </div>
    ))}
  </div>
);

export const Hero = () => (
  <header
    id="top"
    className="relative min-h-[100svh] bg-[#efe7da] text-[#2b2119] overflow-hidden flex items-center"
  >
    <DotField />
    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
      <div className="lg:col-span-7 min-w-0">
        <p className="lab text-[#a8471f] fu" style={{ animationDelay: ".55s" }}>
          AI + cloud engineer · {PROFILE.location}
        </p>
        <h1
          className="font-dsp mt-6"
          style={{
            fontSize: "clamp(46px,7.4vw,120px)",
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
          }}
          data-testid="hero-headline"
        >
          {HERO_LINES.map((line, i) => (
            <span className="ln" key={line}>
              <span style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                {line}
              </span>
            </span>
          ))}
          <span
            className="block whitespace-nowrap italic text-[#a8471f] fu"
            style={{ animationDelay: ".5s" }}
          >
            <Typewriter phrases={HERO_PHRASES} typing={70} pause={2000} />
          </span>
        </h1>
        <p
          className="mt-8 max-w-[34rem] text-lg leading-[1.6] text-[#4a3a2d] fu"
          style={{ animationDelay: ".7s" }}
        >
          {PROFILE.differentiator}
        </p>
        <div
          className="mt-9 flex flex-wrap gap-4 fu"
          style={{ animationDelay: ".85s" }}
        >
          <a
            href={PROFILE.calendly}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="hero-book-call"
            className="group rounded-full bg-[#2b2119] text-[#efe7da] px-7 py-4 transition-transform hover:scale-105"
          >
            Book a 30-min call{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href="#projects"
            data-testid="hero-see-work"
            className="rounded-full border border-[#2b2119] bg-[#efe7da]/70 px-7 py-4 transition-colors hover:bg-[#2b2119] hover:text-[#efe7da]"
          >
            See the work
          </a>
        </div>
      </div>
      <div className="lg:col-span-5">
        <PhotoStack />
      </div>
    </div>
  </header>
);

export default Hero;
