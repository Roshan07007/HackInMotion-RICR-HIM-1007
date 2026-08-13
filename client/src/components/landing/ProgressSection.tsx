import { motion } from "framer-motion";
import { LineChart, TrendingUp } from "lucide-react";

export default function ProgressSection() {
  return (
    <section className="py-24 relative z-10 bg-base-100 border-y border-base-content/5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-base-content/5 border border-base-content/10 text-base-content/70 text-sm font-medium mb-8"
        >
          <LineChart className="w-4 h-4" />
          <span>Track Improvement</span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-base-content tracking-tight mb-6"
        >
          See yourself getting better.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-base-content/50 max-w-xl mx-auto mb-16"
        >
          Every analysis and every interview becomes part of your progress.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Resume Match Progress */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-base-200 border border-base-content/5 rounded-3xl p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-base-content font-medium">Resume Match Trend</h3>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="flex items-end justify-between h-32 gap-2">
              {[72, 81, 87, 92].map((score, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                  <span className="text-xs text-base-content/40 group-hover:text-base-content transition-colors">{score}%</span>
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    className="w-full bg-primary/20 rounded-t-md relative group-hover:bg-primary/40 transition-colors"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-t-md" />
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Interview Performance Progress */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-base-200 border border-base-content/5 rounded-3xl p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-base-content font-medium">Interview Performance</h3>
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex items-end justify-between h-32 gap-2">
              {[61, 68, 76, 84].map((score, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                  <span className="text-xs text-base-content/40 group-hover:text-base-content transition-colors">{score}</span>
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6 + (i * 0.1) }}
                    className="w-full bg-secondary/20 rounded-t-md relative group-hover:bg-secondary/40 transition-colors"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-secondary rounded-t-md" />
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
