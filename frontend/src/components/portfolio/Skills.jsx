import { SKILLS } from "@/data/content";
import { Reveal } from "./Reveal";

// dir2's terminal — `cat skills.yml` on a dark earthy window with curved edges + caret.
export const Skills = () => (
  <section id="skills" className="bg-[#efe7da] text-[#2b2119] py-24 md:py-36">
    <div className="max-w-7xl mx-auto px-6">
      <Reveal>
        <p className="lab text-[#a8471f]">Toolkit</p>
        <h2
          className="font-dsp mt-4"
          style={{ fontSize: "clamp(36px,5vw,80px)", lineHeight: 1, letterSpacing: "-.02em" }}
        >
          What I reach for
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <div
          className="mt-10 bg-[#2b2119] text-[#efe7da] rounded-[24px] overflow-hidden shadow-[0_30px_70px_-35px_rgba(43,33,25,0.7)]"
          data-testid="skills-terminal"
        >
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[#efe7da]/10">
            <span className="h-3 w-3 rounded-full bg-[#a8471f]" />
            <span className="h-3 w-3 rounded-full bg-[#d4a46f]" />
            <span className="h-3 w-3 rounded-full bg-[#8f9a6a]" />
            <span className="ml-3 font-mono text-xs text-[#d9c7ad]">abel@toronto: ~/skills</span>
          </div>
          <div className="font-mono p-6 md:p-10 text-sm md:text-base leading-[2] overflow-x-auto">
            <p className="text-[#d9c7ad]">
              <span className="text-[#8f9a6a]">$</span> cat skills.yml
            </p>
            {SKILLS.map((s) => (
              <p key={s.key} className="mt-1">
                <span className="text-[#e2a07a]">{s.key}:</span>{" "}
                <span className="text-[#efe7da]">{s.value}</span>
              </p>
            ))}
            <p className="mt-3 text-[#8f9a6a]">
              $ <span className="caret">▍</span>
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Skills;
