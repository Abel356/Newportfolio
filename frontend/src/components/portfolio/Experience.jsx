import { EXPERIENCE } from "@/data/content";
import { Reveal } from "./Reveal";

// dir1's "Where I've shipped" — tabular dates left, detail right, hairline dividers.
export const Experience = () => (
  <section id="experience" className="bg-[#e3d6c3] text-[#2b2119] py-24 md:py-36">
    <div className="max-w-7xl mx-auto px-6">
      <Reveal>
        <p className="lab text-[#8a3a18]">Experience</p>
        <h2
          className="font-dsp mt-4"
          style={{ fontSize: "clamp(36px,5vw,80px)", lineHeight: 1, letterSpacing: "-.02em" }}
        >
          Where I've shipped
        </h2>
      </Reveal>
      <ol className="mt-12 border-t border-[#2b2119]/25" data-testid="experience-list">
        {EXPERIENCE.map((job, i) => (
          <Reveal key={job.role} delay={i * 0.05}>
            <li className="group grid md:grid-cols-12 gap-4 py-8 border-b border-[#2b2119]/25">
              <span className="md:col-span-3 lab tab text-[#6b5848] pt-1">{job.date}</span>
              <div className="md:col-span-9 min-w-0">
                <h3 className="font-dsp text-2xl md:text-3xl transition-colors group-hover:text-[#a8471f]">
                  {job.role} · {job.org}
                </h3>
                <p className="mt-2 max-w-[62ch] leading-[1.6] text-[#4a3a2d]">{job.detail}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);

export default Experience;
