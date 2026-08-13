import { motion } from "framer-motion";
import { FileSearch, Settings, Wand2, Users, Activity, TrendingUp } from "lucide-react";
import { cn } from "../../utils/cn";

const features = [
  {
    title: "Resume Analysis",
    description: "Understand how your resume matches a specific role.",
    icon: FileSearch,
    className: "md:col-span-2",
  },
  {
    title: "ATS Compatibility",
    description: "Identify formatting and content issues that could hurt ATS parsing.",
    icon: Settings,
    className: "md:col-span-1",
  },
  {
    title: "AI Resume Suggestions",
    description: "Get role-specific recommendations for improving your resume.",
    icon: Wand2,
    className: "md:col-span-1",
  },
  {
    title: "Personalized Questions",
    description: "Technical and behavioral questions generated from your resume and target role.",
    icon: Users,
    className: "md:col-span-2",
  },
  {
    title: "Interview Feedback",
    description: "Understand your clarity, relevance, and completeness.",
    icon: Activity,
    className: "md:col-span-2",
  },
  {
    title: "Progress Tracking",
    description: "Track improvement across multiple attempts.",
    icon: TrendingUp,
    className: "md:col-span-1",
  }
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24 relative z-10 bg-base-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "group p-8 rounded-3xl bg-base-200 border border-base-content/5 hover:bg-base-300 hover:border-base-content/10 transition-all overflow-hidden relative",
                feature.className
              )}
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-base-content/5 flex items-center justify-center mb-6 border border-base-content/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-base-content/70 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-base-content mb-2">{feature.title}</h3>
                <p className="text-base-content/50 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
