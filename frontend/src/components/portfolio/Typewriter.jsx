import { useEffect, useState } from "react";

// Smooth dynamic typewriter that cycles through phrases (dir3's "dynamic writing").
export const Typewriter = ({ phrases, className = "", typing = 55, pause = 1800 }) => {
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
      <span className="caret text-[#a8471f]">▍</span>
    </span>
  );
};

export default Typewriter;
