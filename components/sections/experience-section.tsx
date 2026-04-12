"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { experience } from "@/lib/experience";
import type { ExperienceProject } from "@/lib/experience";
import { getTagColorClass } from "@/lib/skills";

const PROJECTS_VISIBLE = 2;

function TechTag({ label }: { label: string }) {
  return (
    <span
      className={`font-mono text-[9px] tracking-wide border px-1.5 py-0.5 ${getTagColorClass(label)}`}
    >
      {label}
    </span>
  );
}

function ProjectEntry({ project }: { project: ExperienceProject }) {
  return (
    <div className="pl-3 border-l border-border/50">
      <p className="text-xs font-semibold text-foreground">{project.name}</p>
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
  );
}

function ExperienceEntry({ exp }: { exp: (typeof experience)[number] }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = exp.projects.length > PROJECTS_VISIBLE;
  const visible = expanded
    ? exp.projects
    : exp.projects.slice(0, PROJECTS_VISIBLE);

  return (
    <div className="border-b border-border py-8 first:border-t">
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
        {visible.map((project) => (
          <ProjectEntry key={project.name} project={project} />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1 mt-5 text-[10px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          {expanded ? (
            <>
              <ChevronUp className="size-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="size-3" />
              {exp.projects.length - PROJECTS_VISIBLE} more project
              {exp.projects.length - PROJECTS_VISIBLE > 1 ? "s" : ""}
            </>
          )}
        </button>
      )}
    </div>
  );
}

export function ExperienceSection() {
  return (
    <section className="py-12">
      <p className="text-xs tracking-[0.25em] text-muted-foreground mb-8 uppercase font-semibold">
        Work Experience
      </p>

      <div className="space-y-0">
        {experience.slice(0, 2).map((exp) => (
          <ExperienceEntry key={exp.company} exp={exp} />
        ))}
      </div>

      {experience.length > 2 && (
        <Link
          href="/experience"
          className="inline-flex items-center gap-1 mt-8 text-[10px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <ArrowUpRight className="size-3" />
          See full experience
        </Link>
      )}
    </section>
  );
}
