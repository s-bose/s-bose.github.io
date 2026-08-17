import skillsData from "@/data/skills.json";

export interface Skills {
  programming_languages: string[];
  frameworks_apis: string[];
  ai_llm: string[];
  data_messaging: string[];
  infrastructure: string[];
}

export const skills: Skills = skillsData;

export const skillCategoryLabels: Record<keyof Skills, string> = {
  programming_languages: "LANGUAGES",
  frameworks_apis: "FRAMEWORKS & APIS",
  ai_llm: "AI / LLM",
  data_messaging: "DATA & MESSAGING",
  infrastructure: "INFRASTRUCTURE",
};

const _skillCategoryMap: Record<string, keyof Skills> = {};
(Object.keys(skills) as Array<keyof Skills>).forEach((cat) => {
  skills[cat].forEach((s) => {
    _skillCategoryMap[s] = cat;
  });
});

const _tagColors: Record<keyof Skills, string> = {
  programming_languages: "border-violet-500/40 text-violet-400",
  frameworks_apis: "border-emerald-500/40 text-emerald-400",
  ai_llm: "border-rose-500/40 text-rose-400",
  data_messaging: "border-amber-500/40 text-amber-400",
  infrastructure: "border-sky-500/40 text-sky-400",
};

export function getTagColorClass(skill: string): string {
  const cat = _skillCategoryMap[skill];
  return cat ? _tagColors[cat] : "border-border text-muted-foreground";
}
