import experienceData from "@/data/experience.json";

export interface ExperienceProject {
    name: string;
    description: string;
    tech_stack: string[];
}

export interface Experience {
    company: string;
    role: string;
    duration: string;
    location: string;
    projects: ExperienceProject[];
}

export const experience: Experience[] = experienceData as Experience[];
