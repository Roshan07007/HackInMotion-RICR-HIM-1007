import { motion } from "framer-motion";
import { FileSearch, EyeOff, Target } from "lucide-react";

const problems = [
  {
    icon: FileSearch,
    title: "Resume Screening",
    description: "Your resume can be rejected by an ATS or recruiter before a human ever actually reads it.",
  },
  {
    icon: EyeOff,
    title: "Interview Uncertainty",
    description: "You don’t know how you’ll actually perform under pressure until the real interview begins.",
  },
  {
    icon: Target,
    title: "Generic Advice",
    description: "Most resume tools give generic spelling suggestions instead of role-specific, actionable feedback.",
  }
];

export default function ProblemSection() {
  return (
    <section className="py-24 relative z-10 bg-base-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-base-content tracking-tight"
          >
            Stop guessing why you're getting rejected.
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group p-8 rounded-2xl bg-base-200 border border-base-content/10 hover:bg-base-300 hover:border-base-content/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <problem.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-3">{problem.title}</h3>
              <p className="text-base-content/70 leading-relaxed text-sm">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
