// Infinite marquee strip of highlights (dir1/dir3 earthy banner).
export const Marquee = ({ items, bg = "#2b2119", fg = "#efe7da", sep = "#d98a5f" }) => {
  const doubled = [...items, ...items];
  return (
    <section
      aria-label="Highlights"
      className="overflow-hidden py-6"
      style={{ background: bg, color: fg }}
      data-testid="marquee"
    >
      <div className="mq-track font-dsp text-3xl md:text-5xl whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8">{item}</span>
            <span className="px-2" style={{ color: sep }}>
              ✳
            </span>
          </span>
        ))}
      </div>
    </section>
  );
};

export default Marquee;
