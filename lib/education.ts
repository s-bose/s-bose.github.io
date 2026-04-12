import educationData from "@/data/education.json";
import certificationsData from "@/data/certifications.json";

export interface Education {
    degree: string;
    institution: string;
    location: string;
    year: string;
    details?: string;
}

export interface Certification {
    name: string;
    provider: string;
    certificate_id?: string;
}

export const education: Education[] = educationData;
export const certifications: Certification[] = certificationsData;
