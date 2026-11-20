import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { PROFILE } from "@/data/content";

// Scroll-triggered fade/slide-up reveal used across sections.
export const Reveal = ({ children, delay = 0, y = 24, className = "", ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0, 1] }}
    {...rest}
  >
    {children}
  </motion.div>
);

// Counts from 0 up to `value` the first time it scrolls into view.
export const CountUp = ({ value, decimals = 0, suffix = "", duration = 1.8 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return undefined;
    }
    const controls = animate(0, value, { duration, ease: [0.2, 0.7, 0, 1], onUpdate: setShown });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="tab">
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const LINKS = [
  { id: "linkedin", label: "LinkedIn", href: PROFILE.linkedin, Icon: Linkedin },
  { id: "github", label: "GitHub", href: PROFILE.github, Icon: Github },
];

// Icon-only buttons; colour follows the surrounding text so they work on light and dark sections.
export const SocialLinks = ({ place, className = "" }) => (
  <div className={`flex gap-3 ${className}`}>
    {LINKS.map(({ id, label, href, Icon }) => (
      <a
        key={id}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
        data-testid={`${place}-${id}`}
        className="rounded-full border border-current p-3 transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#a8471f] hover:bg-[#a8471f] hover:text-[#efe7da]"
      >
        <Icon size={20} strokeWidth={1.75} />
      </a>
    ))}
  </div>
);
