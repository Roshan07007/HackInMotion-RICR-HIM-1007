export interface User {
  id: string; // Updated from _id for Prisma consistency
  _id?: string; // Fallback for mongo legacy if any
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "other";
  avatar?: {
    url?: string;
    publicId?: string;
  };
  resume?: {
    publicId?: string;
    url?: string;
  };
  bio?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  otherLink?: string;
  expoPushTokens?: string[];
  preferences?: {
    skills?: string[];
    desiredJobs?: string[];
    desiredCompanies?: string[];
    experienceLevel?: "beginner" | "intermediate" | "expert";
    aiCommunicationStyle?: "formal" | "casual" | "technical";
    cameraEnabled?: boolean;
    microphoneEnabled?: boolean;
    theme?: "dark" | "light" | "system";
  };
  createdAt?: string;
  updatedAt?: string;
}
