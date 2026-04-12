import projectsData from "@/data/projects.json";

export interface Project {
    name: string;
    description: string;
    tech_stack: string[];
    github: string;
    pypi?: string;
    inProgress: boolean;
}

export const projects: Project[] = projectsData as Project[];
