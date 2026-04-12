"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Package } from "lucide-react";
import { IconBrandGithub } from "@/components/icons/brand-github";
import type { Project } from "@/lib/projects";

const item: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
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
                    <motion.div
                        key={project.name}
                        variants={item}
                        className="group border-b border-border first:border-t py-7"
                    >
                        <div className="flex items-start justify-between gap-4">
                            {/* Left: meta */}
                            <div className="flex-1 min-w-0">
                                {/* Number + WIP */}
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[10px] font-mono text-muted-foreground">
                                        [{String(i + 1).padStart(2, "0")}]
                                    </span>
                                    {project.inProgress && (
                                        <span className="flex items-center gap-1">
                                            <span className="relative flex size-1.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full size-1.5 bg-amber-500" />
                                            </span>
                                            <span className="text-[9px] tracking-[0.2em] text-amber-500/70 uppercase font-mono">
                                                wip
                                            </span>
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="text-base font-black tracking-tight text-foreground uppercase mb-2">
                                    {project.name}
                                </h3>

                                {/* Description */}
                                <p className="text-xs text-muted-foreground leading-5 max-w-sm mb-3">
                                    {project.description}
                                </p>

                                {/* Tech stack tags */}
                                {project.tech_stack.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.tech_stack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="font-mono text-[9px] tracking-wide border border-border px-1.5 py-0.5 text-muted-foreground"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right: links */}
                            <div className="flex items-center gap-2 shrink-0 mt-1">
                                {project.pypi && (
                                    <a
                                        href={project.pypi}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="PyPI"
                                        className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                    >
                                        <Package className="size-3.5" />
                                    </a>
                                )}
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                >
                                    <IconBrandGithub className="size-3.5" />
                                </a>
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open project"
                                    className="text-muted-foreground group-hover:text-foreground transition-colors duration-200"
                                >
                                    <ArrowUpRight className="size-4" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
