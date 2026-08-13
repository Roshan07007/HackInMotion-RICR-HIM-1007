import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  avatar?: {
    publicId?: string;
    url?: string;
  };
  password?: string;
  role: "user" | "admin" | "other";
  expoPushTokens: [string];
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
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    avatar: {
      publicId: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "other"],
      default: "user",
    },

    expoPushTokens: [
      {
        type: String,
      },
    ],
    preferences: {
      skills: [{ type: String }],
      desiredJobs: [{ type: String }],
      desiredCompanies: [{ type: String }],
      experienceLevel: {
        type: String,
        enum: ["beginner", "intermediate", "expert"],
        default: "intermediate",
      },
      aiCommunicationStyle: {
        type: String,
        enum: ["formal", "casual", "technical"],
        default: "casual",
      },
      cameraEnabled: { type: Boolean, default: true },
      microphoneEnabled: { type: Boolean, default: true },
      theme: {
        type: String,
        enum: ["dark", "light", "system"],
        default: "system",
      },
    },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
