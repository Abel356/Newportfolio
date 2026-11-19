import { useRef, useState } from "react";
import { Play } from "lucide-react";

// The source footage has a purple border baked in; the scale crops it out and zooms the content.
// Shows the poster still; plays the muted clip on hover (desktop) or tap (touch).
export const HoverClip = ({ src, poster, label, testId }) => {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  const play = () => ref.current.play().catch(() => {});
  const stop = () => ref.current.pause();
  const toggle = () => (ref.current.paused ? play() : stop());

  return (
    <button
      type="button"
      onMouseEnter={play}
      onMouseLeave={stop}
      onClick={toggle}
      aria-label={label}
      data-testid={testId}
      className="group relative block w-full overflow-hidden rounded-[24px] border-[6px] border-[#e3d6c3] bg-[#2b2119] aspect-[16/9] transition-[border-color] duration-500 hover:border-[#a8471f]"
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full scale-[1.16] object-cover"
      />
      <span
        className={`lab absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-[#2b2119]/85 px-3 py-1.5 text-[#efe7da] transition-opacity duration-300 ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      >
        <Play size={12} /> Hover to play
      </span>
    </button>
  );
};

export default HoverClip;
