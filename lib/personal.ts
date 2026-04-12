import personalData from "@/data/personal.json";

export interface PersonalLinks {
    github: string;
    linkedin: string;
}

export interface Personal {
    name: string;
    title: string;
    location: string;
    email: string;
    phone: string;
    bio: string[];
    links: PersonalLinks;
}

export const personal: Personal = personalData;
