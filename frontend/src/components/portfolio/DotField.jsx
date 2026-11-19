import { useEffect, useRef } from "react";

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
export const DotField = () => {
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

export default DotField;
