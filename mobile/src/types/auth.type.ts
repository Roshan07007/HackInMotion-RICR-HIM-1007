export interface User {
  id: string; // Updated from _id for Prisma consistency
  _id?: string; // Fallback for mongo legacy if any
  name: string;
  email: string;
  phone?: string;
  role: string;
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
  createdAt?: string;
  updatedAt?: string;
}
