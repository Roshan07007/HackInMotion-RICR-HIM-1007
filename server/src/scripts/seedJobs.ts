import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Job from "../models/job.model.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const mockJobs = [
  {
    title: "Full Stack Developer",
    companyName: "TechNova Solutions",
    location: "Bhopal, India",
    employmentType: "Full time",
    experienceLevel: "Mid level",
    salaryRange: "₹6L – ₹10L",
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    description: "We are looking for an experienced Full Stack Developer to join our dynamic team in building scalable web applications.",
    responsibilities: [
      "Develop and maintain web applications using React and Node.js.",
      "Design robust APIs and manage databases.",
      "Collaborate with cross-functional teams."
    ],
    requirements: [
      "3+ years of experience in full stack development.",
      "Strong proficiency in JavaScript/TypeScript.",
      "Experience with cloud services (AWS preferred)."
    ],
    aiInsights: {
      criticalSkills: ["React", "Node.js"],
      importantSkills: ["PostgreSQL", "AWS"],
      preferredSkills: ["Docker"],
      experienceRequired: "3+ years",
      keyResponsibilities: ["API development", "Frontend development"]
    },
    applicationUrl: "https://technova.example.com/careers",
    source: "LinkedIn"
  },
  {
    title: "React Developer",
    companyName: "Innovate AI",
    location: "Remote",
    employmentType: "Contract",
    experienceLevel: "Junior",
    salaryRange: "₹4L – ₹7L",
    skills: ["React", "JavaScript", "Tailwind CSS"],
    description: "Seeking a passionate Junior React Developer to help build our next-generation AI interface.",
    responsibilities: [
      "Implement UI components matching Figma designs.",
      "Write clean, maintainable code."
    ],
    requirements: [
      "1+ years of React experience.",
      "Good understanding of CSS frameworks like Tailwind."
    ],
    aiInsights: {
      criticalSkills: ["React", "Tailwind CSS"],
      importantSkills: ["JavaScript"],
      preferredSkills: ["Figma"],
      experienceRequired: "1+ years",
      keyResponsibilities: ["UI implementation"]
    },
    source: "Internal"
  },
  {
    title: "Backend Engineer",
    companyName: "CloudScale Inc",
    location: "Bangalore, India",
    employmentType: "Full time",
    experienceLevel: "Senior",
    salaryRange: "₹15L – ₹25L",
    skills: ["Node.js", "MongoDB", "Redis", "Docker", "Kubernetes"],
    description: "Join us to scale our backend infrastructure that handles millions of requests per day.",
    responsibilities: [
      "Architect microservices.",
      "Optimize database queries.",
      "Deploy scalable systems."
    ],
    requirements: [
      "5+ years of backend development.",
      "Expertise in Node.js and MongoDB.",
      "Experience with containerization (Docker, k8s)."
    ],
    source: "Internal"
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to DB for seeding.");

    await Job.deleteMany({});
    console.log("Cleared existing jobs.");

    // Multiply the mock jobs slightly with variations to create more data
    const expandedJobs: any[] = [];
    for (let i = 0; i < 5; i++) {
      mockJobs.forEach((job) => {
        expandedJobs.push({
          ...job,
          title: i > 0 ? `${job.title} (Level ${i + 1})` : job.title,
          companyName: i % 2 === 0 ? job.companyName : `${job.companyName} Global`,
        });
      });
    }

    await Job.insertMany(expandedJobs);
    console.log(`Seeded ${expandedJobs.length} jobs successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding jobs:", error);
    process.exit(1);
  }
};

seedDB();
