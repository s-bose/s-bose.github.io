export interface Project {
  title: string;
  description: string;
  href?: string;
}

export const projects: Project[] = [
  {
    title: "KREUZ_KERNEL",
    description:
      "A custom Rust-based microkernel designed for deterministic hardware performance.",
    href: "#",
  },
  {
    title: "NULL_VIRTUAL",
    description:
      "Headless CMS built for high-density documentation using Markdown-as-source.",
    href: "#",
  },
  {
    title: "SPECTRE_OS",
    description:
      "Visual experiment in minimalist UI for distributed terminal sessions.",
    href: "#",
  },
];
