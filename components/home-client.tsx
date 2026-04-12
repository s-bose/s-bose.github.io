"use client";

import { motion, type Variants } from "framer-motion";
import { Download } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ActivityWidgets } from "@/components/sections/activity-widgets";
import { ProjectsList } from "@/components/sections/projects-list";
import { BlogList } from "@/components/sections/blog-list";
import { ExperienceSection } from "@/components/sections/experience-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { EducationSection } from "@/components/sections/education-section";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/projects";
import { personal } from "@/lib/personal";
import type { BlogPostMeta } from "@/lib/blog";

interface HomeClientProps {
  posts: BlogPostMeta[];
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function HomeClient({ posts }: HomeClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4">
        <Nav />

        <motion.main
          variants={container}
          initial="hidden"
          animate="show"
          className="pb-8"
        >
          {/* ── Hero ─────────────────────────────────────── */}
          <motion.section variants={item} className="pt-10 pb-14">
            {/* Status breadcrumb */}
            <div
              className="flex items-center gap-2 mb-6 text-muted-foreground uppercase tracking-[0.2em]"
              style={{ fontSize: "10px" }}
            >
              <span>■</span>
              <span>
                {personal.title.toUpperCase()} /{" "}
                {personal.location.toUpperCase()}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-7xl font-black tracking-tight leading-[0.92] mb-6 text-foreground">
              Shiladitya Bose
            </h1>

            {/* Bio — real data, white text */}
            <p className="text-sm leading-7 text-foreground/80 max-w-lg mb-8">
              {personal.bio.slice(0, 3).join(" ")}
            </p>

            {/* Resume download */}
            <Button variant="outline" size="sm" asChild>
              <a
                href="/data/resume.pdf"
                download="Shiladitya Bose - Resume.pdf"
              >
                <Download className="size-3.5" />
                Download Resume
              </a>
            </Button>
          </motion.section>

          {/* ── Activity widgets ─────────────────────────── */}
          <motion.div variants={item}>
            <ActivityWidgets />
          </motion.div>

          {/* ── Work experience ──────────────────────────── */}
          <motion.div variants={item} id="experience">
            <ExperienceSection />
          </motion.div>

          {/* ── Selected projects ───────────────────────── */}
          <motion.div variants={item} id="projects">
            <ProjectsList projects={projects} />
          </motion.div>

          {/* ── Technical stack ──────────────────────────── */}
          <motion.div variants={item}>
            <SkillsSection />
          </motion.div>

          {/* ── Education ────────────────────────────────── */}
          <motion.div variants={item}>
            <EducationSection />
          </motion.div>

          {/* ── Latest intelligence (blog) ───────────────── */}
          <motion.div variants={item}>
            <BlogList posts={posts} />
          </motion.div>
        </motion.main>

        <Footer />
      </div>
    </div>
  );
}
