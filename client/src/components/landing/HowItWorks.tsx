import { motion } from "framer-motion";
import { Upload, FileSearch, Sparkles, Mic } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "01 — Upload",
    description: "Upload your PDF or DOCX resume securely to our platform.",
  },
  {
    icon: FileSearch,
    title: "02 — Match",
    description: "Add the job description and let AI analyze the compatibility.",
  },
  {
    icon: Sparkles,
    title: "03 — Improve",
    description: "Get specific missing skills, keywords, and actionable recommendations.",
  },
  {
    icon: Mic,
    title: "04 — Practice",
    description: "Enter a personalized AI mock interview and receive detailed feedback.",
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative z-10 bg-base-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-base-content tracking-tight"
          >
            From application anxiety to interview confidence.
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-base-content/10 z-0" />
          
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-base-100 border-2 border-primary/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(var(--p),0.2)]">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-base-content mb-2">{step.title}</h3>
              <p className="text-base-content/60 text-sm max-w-[200px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
