import { skills, skillCategoryLabels, getTagColorClass } from "@/lib/skills";
import { cn } from "@/lib/utils";

export function SkillsSection() {
  return (
    <section className="py-12">
      <p className="text-xs tracking-[0.25em] text-muted-foreground mb-8 uppercase font-semibold">
        Technical Stack
      </p>
      <div className="space-y-6">
        {(Object.keys(skills) as Array<keyof typeof skills>).map((category) => (
          <div key={category}>
            <p className="text-[9px] tracking-[0.2em] text-muted-foreground mb-3 uppercase font-mono">
              {skillCategoryLabels[category]}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skills[category].map((skill) => (
                <span
                  key={skill}
                  className={cn(
                    "font-mono text-[9px] tracking-wide border px-1.5 py-0.5 transition-colors duration-200",
                    getTagColorClass(skill),
                  )}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
