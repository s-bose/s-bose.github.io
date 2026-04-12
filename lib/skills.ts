import skillsData from "@/data/skills.json";

export interface Skills {
    programming_languages: string[];
    frameworks_libraries: string[];
    databases: string[];
    devops_tools: string[];
}

export const skills: Skills = skillsData;

export const skillCategoryLabels: Record<keyof Skills, string> = {
    programming_languages: "LANGUAGES",
    frameworks_libraries: "FRAMEWORKS & LIBRARIES",
    databases: "DATABASES",
    devops_tools: "DEVOPS & TOOLING",
};
