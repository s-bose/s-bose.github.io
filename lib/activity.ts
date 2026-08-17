import activityData from "@/data/activity.json";

export type ActivityType = "spotify" | "reading" | "steam";

export interface ActivityItem {
    type: ActivityType;
    label: string;
    href: string;
    image: string;
    alt: string;
    title: string;
    subtitle: string;
}

export const activity: ActivityItem[] = activityData as ActivityItem[];
