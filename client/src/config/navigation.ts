import {
  FaHome,
  FaUser,
  FaCog,
  FaComments,
  FaFileAlt,
  FaBriefcase,
} from "react-icons/fa";
import { SiGooglemeet } from "react-icons/si";

export const navigation = [
  {
    title: "Home",
    path: "/home",
    icon: FaHome,
  },
  {
    title: "Resume Analyzer",
    path: "/resume-analyzer",
    icon: FaFileAlt,
  },
  {
    title: "Jobs",
    path: "/jobs",
    icon: FaBriefcase,
  },
  {
    title: "Mock Interview",
    path: "/interview",
    icon: SiGooglemeet, // Or another suitable icon
  },
  {
    title: "AI Mentor",
    path: "/mentor",
    icon: FaComments,
  },

  {
    title: "Personalize",
    path: "/personalize",
    icon: FaCog,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: FaUser,
  },
];
