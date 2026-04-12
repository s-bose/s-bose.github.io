import { skills, skillCategoryLabels } from "@/lib/skills";

export function SkillsSection() {
    return (
        <section className="py-12">
            <p className="text-[9px] tracking-[0.2em] text-muted-foreground mb-8 uppercase">
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
                                    className="font-mono text-[9px] tracking-wide border border-border px-1.5 py-0.5 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors duration-200"
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
