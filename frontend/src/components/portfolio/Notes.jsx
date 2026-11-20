import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NOTES } from "@/data/content";
import { Reveal } from "./shared";

const Para = ({ children }) => (
  <p className="mt-5 text-lg leading-[1.75] text-[#4a3a2d]">{children}</p>
);

const MemeColumn = ({ memes, testId, className = "" }) => (
  <div className={`grid grid-cols-3 gap-3 md:grid-cols-1 md:gap-4 ${className}`} data-testid={testId}>
    {memes.map((m) => (
      <figure
        key={m.src}
        className="group overflow-hidden rounded-[18px] border-[5px] border-[#e3d6c3] bg-[#e3d6c3] transition-[border-color] duration-500 hover:border-[#a8471f]"
      >
        <div className="overflow-hidden rounded-[12px]">
          <img
            src={m.src}
            alt={m.alt}
            loading="lazy"
            className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
      </figure>
    ))}
  </div>
);

const Note = ({ note, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <article
      className="grid md:grid-cols-12 gap-8 md:gap-10 py-12 border-t border-[#2b2119]/20"
      data-testid={`note-${note.id}`}
    >
      <div className="md:col-span-3">
        <p className="lab tab text-[#6b5848] pt-2">Note {String(index + 1).padStart(2, "0")}</p>
        <MemeColumn memes={note.memes.before} testId={`note-${note.id}-memes-before`} className="mt-6" />
      </div>
      <div className="md:col-span-6 min-w-0">
        <h3 className="font-dsp text-3xl md:text-4xl leading-[1.1] bal">{note.title}</h3>
        {note.lead.map((p) => (
          <Para key={p}>{p}</Para>
        ))}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.2, 0.7, 0, 1] }}
              className="overflow-hidden"
              data-testid={`note-${note.id}-more`}
            >
              {note.more.map((p) => (
                <Para key={p}>{p}</Para>
              ))}
              <p className="mt-6 font-mono text-xs leading-[1.8] text-[#6b5848]">{note.tech}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          data-testid={`note-${note.id}-toggle`}
          className="mt-7 text-sm text-[#a8471f] underline underline-offset-4 transition-colors hover:text-[#2b2119]"
        >
          {open ? "Show less" : "Keep reading"}
        </button>
      </div>
      <MemeColumn
        memes={note.memes.after}
        testId={`note-${note.id}-memes-after`}
        className="md:col-span-3 md:mt-[46px] content-start"
      />
    </article>
  );
};

export const Notes = () => (
  <section id="notes" className="bg-[#efe7da] text-[#2b2119] py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6">
      <Reveal>
        <p className="lab text-[#a8471f]">Notes</p>
        <h2
          className="font-dsp mt-4"
          style={{ fontSize: "clamp(36px,5vw,72px)", lineHeight: 1, letterSpacing: "-.02em" }}
        >
          In my own words
        </h2>
      </Reveal>
      <div className="mt-12 border-b border-[#2b2119]/20" data-testid="notes-list">
        {NOTES.map((note, i) => (
          <Reveal key={note.id}>
            <Note note={note} index={i} />
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Notes;
