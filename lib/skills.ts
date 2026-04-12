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

const _skillCategoryMap: Record<string, keyof Skills> = {};
(Object.keys(skills) as Array<keyof Skills>).forEach((cat) => {
  skills[cat].forEach((s) => {
    _skillCategoryMap[s] = cat;
  });
});

const _tagColors: Record<keyof Skills, string> = {
  programming_languages: "border-violet-500/40 text-violet-400",
  frameworks_libraries: "border-emerald-500/40 text-emerald-400",
  databases: "border-amber-500/40 text-amber-400",
  devops_tools: "border-sky-500/40 text-sky-400",
};

export function getTagColorClass(skill: string): string {
  const cat = _skillCategoryMap[skill];
  return cat ? _tagColors[cat] : "border-border text-muted-foreground";
}
