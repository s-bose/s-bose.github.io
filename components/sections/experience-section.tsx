import { experience } from "@/lib/experience";

function TechTag({ label }: { label: string }) {
  return (
    <span className="font-mono text-[9px] tracking-wide border border-border px-1.5 py-0.5 text-muted-foreground">
      {label}
    </span>
  );
}

export function ExperienceSection() {
  return (
    <section className="py-12">
      <p className="text-[9px] tracking-[0.2em] text-muted-foreground mb-8 uppercase">
        Work Experience
      </p>

      <div className="space-y-0">
        {experience.map((exp) => (
          <div
            key={exp.company}
            className="border-b border-border py-8 first:border-t"
          >
            {/* Company header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-sm font-black tracking-[0.12em] text-foreground uppercase">
                  {exp.company}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1 tracking-wide">
                  {exp.role}&nbsp;&middot;&nbsp;{exp.location}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono tracking-wider shrink-0 ml-6 pt-0.5">
                {exp.duration}
              </span>
            </div>

            {/* Sub-projects */}
            <div className="space-y-5">
              {exp.projects.map((project) => (
                <div
                  key={project.name}
                  className="pl-3 border-l border-border/50"
                >
                  <p className="text-xs font-semibold text-foreground">
                    {project.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-lg">
                    {project.description}
                  </p>
                  {project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {project.tech_stack.map((t) => (
                        <TechTag key={t} label={t} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
