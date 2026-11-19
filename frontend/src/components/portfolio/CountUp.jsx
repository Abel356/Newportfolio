import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

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

export default CountUp;
