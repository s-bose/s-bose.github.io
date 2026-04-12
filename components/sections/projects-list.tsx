"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

interface ProjectsListProps {
  projects: Project[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <section className="py-12">
      <p className="text-[9px] tracking-[0.2em] text-muted-foreground mb-8 uppercase">
        Selected Projects
      </p>
      <div className="space-y-0">
        {projects.map((project, i) => (
          <motion.a
            key={project.title}
            href={project.href ?? "#"}
            variants={item}
            className="group flex items-end justify-between py-8 border-b border-border first:border-t hover:opacity-75 transition-opacity duration-200"
          >
            <div>
              <p className="text-[10px] text-muted-foreground mb-1 font-mono">
                [{String(i + 1).padStart(2, "0")}]
              </p>
              <h3 className="text-xl font-black tracking-tight text-foreground uppercase">
                {project.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 max-w-xs leading-5">
                {project.description}
              </p>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200 shrink-0 mb-1" />
          </motion.a>
        ))}
      </div>
    </section>
  );
}
