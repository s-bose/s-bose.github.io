import { education, certifications } from "@/lib/education";
import { GraduationCap, Award } from "lucide-react";

export function EducationSection() {
  return (
    <section className="py-12">
      <p className="text-xs tracking-[0.25em] text-muted-foreground mb-8 uppercase font-semibold">
        Education
      </p>

      <div className="space-y-0">
        {education.map((edu) => (
          <div
            key={edu.degree}
            className="flex items-start gap-3 py-5 border-b border-border first:border-t"
          >
            <GraduationCap className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs font-bold text-foreground leading-snug">
                  {edu.degree}
                </p>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                  {edu.year}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5 tracking-wide">
                {edu.institution} · {edu.location}
              </p>
              {edu.details && (
                <p className="text-[11px] text-muted-foreground/70 mt-2 leading-relaxed max-w-sm">
                  {edu.details}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs tracking-[0.25em] text-muted-foreground mt-10 mb-6 uppercase font-semibold">
        Certifications
      </p>

      <div className="space-y-0">
        {certifications.map((cert) => (
          <div
            key={cert.name}
            className="flex items-start gap-3 py-4 border-b border-border first:border-t"
          >
            <Award className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
              <p className="text-xs text-foreground leading-snug">
                {cert.name}
              </p>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
                  {cert.provider}
                </p>
                {cert.certificate_id && (
                  <p className="text-[9px] font-mono text-muted-foreground/50 mt-0.5">
                    {cert.certificate_id}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
