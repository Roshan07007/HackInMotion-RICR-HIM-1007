import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ResumeAnalysis() {
  return (
    <section className="py-32 relative z-10 bg-base-200 border-y border-base-content/5 overflow-hidden">
      <div className=" mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left side */}
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-base-content tracking-tight mb-6"
          >
            Know exactly where your resume stands.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-base-content/60 max-w-lg leading-relaxed"
          >
            Go beyond keyword matching. Understand how closely your experience aligns with the role you’re targeting.
          </motion.p>
        </div>

        {/* Right side interactive dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-base-100/50 backdrop-blur-md border border-base-content/10 rounded-3xl p-8 shadow-2xl relative"
        >
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="flex items-end justify-between mb-10">
            <div>
              <h3 className="text-base-content/60 text-sm font-medium mb-1">Overall Match</h3>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                92%
              </div>
            </div>
            <div className="text-primary text-sm font-medium px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              Top 10% of applicants
            </div>
          </div>

          {/* Metric bars */}
          <div className="space-y-5 mb-10">
            {[
              { label: 'Skills', score: 96 },
              { label: 'Experience', score: 89 },
              { label: 'Projects', score: 94 },
              { label: 'Keywords', score: 87 }
            ].map((metric, i) => (
              <div key={metric.label}>
                <div className="flex justify-between text-xs font-medium text-base-content/70 mb-2">
                  <span>{metric.label}</span>
                  <span>{metric.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-base-content/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + (i * 0.1), ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-base-content/60 text-xs font-semibold uppercase tracking-wider mb-3">Missing Skills</h4>
              <div className="flex flex-col gap-2">
                {['AWS', 'Docker', 'CI/CD'].map(skill => (
                  <div key={skill} className="flex items-center gap-2 text-sm text-base-content/80">
                    <XCircle className="w-4 h-4 text-error shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-base-content/60 text-xs font-semibold uppercase tracking-wider mb-3">AI Recommendations</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-base-content/80">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Quantify the impact of your projects.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-base-content/80">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Move TypeScript higher in your skills section.</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
