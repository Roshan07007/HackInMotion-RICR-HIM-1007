import { motion } from "framer-motion";
import { Mic, Activity, CheckCircle2 } from "lucide-react";
import { cn } from "../../utils/cn";

export default function MockInterview() {
  return (
    <section className="py-32 relative z-10 bg-base-100 overflow-hidden">
      <div className=" mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-base-content tracking-tight mb-4"
          >
            Practice before the pressure is real.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-base-content/60 max-w-2xl mx-auto"
          >
            Experience realistic, AI-driven mock interviews tailored
            specifically to your resume and the job description.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start max-w-5xl mx-auto">
          {/* Chat/Interview Interface */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-base-200 border border-base-content/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px]"
          >
            <div className="p-4 border-b border-base-content/5 flex items-center justify-between bg-base-100/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
                <div>
                  <h4 className="text-base-content text-sm font-medium">
                    AI Interviewer
                  </h4>
                  <p className="text-base-content/50 text-xs">
                    Senior Engineering Manager
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
              <div className="flex gap-4 max-w-[90%]">
                <div className="w-8 h-8 rounded-full bg-primary/20 shrink-0 mt-1" />
                <div className="bg-base-300 border border-base-content/10 rounded-2xl rounded-tl-sm p-4 text-sm text-base-content/80 leading-relaxed">
                  "Tell me about a challenging technical problem you solved on
                  the E-commerce migration project, and how you approached it."
                </div>
              </div>
              <div className="flex gap-4 max-w-[90%] self-end flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-base-300 shrink-0 mt-1" />
                <div className="bg-primary rounded-2xl rounded-tr-sm p-4 text-sm text-primary-content leading-relaxed">
                  "We faced significant downtime issues with the legacy database
                  during peak hours. I approached it by first analyzing the
                  query logs..."
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-base-content/5 bg-base-100/50">
              <div className="relative">
                <input
                  type="text"
                  disabled
                  placeholder="Type or speak your answer..."
                  className="w-full bg-base-300 border border-base-content/10 rounded-full py-3 px-4 text-sm text-base-content placeholder:text-base-content/30 outline-none pr-12"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-content">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Feedback Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="bg-base-200 border border-base-content/5 rounded-3xl p-6 shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 blur-[50px] rounded-full pointer-events-none" />

              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-success" />
                <h3 className="text-base-content font-medium">
                  Real-time Analysis
                </h3>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { label: "Clarity", score: 87, color: "bg-success" },
                  { label: "Relevance", score: 94, color: "bg-success" },
                  { label: "Completeness", score: 78, color: "bg-warning" },
                ].map((item, i) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs font-medium text-base-content/70 mb-1.5">
                      <span>{item.label}</span>
                      <span>{item.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-base-content/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className={cn("h-full rounded-full", item.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-base-300 border border-base-content/10 rounded-xl p-4">
                <h4 className="text-base-content/80 text-xs font-semibold uppercase tracking-wider mb-2">
                  AI Feedback
                </h4>
                <p className="text-base-content/60 text-sm leading-relaxed mb-3">
                  Good technical explanation of the database issue.
                </p>
                <div className="flex items-start gap-2 text-sm text-primary bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Strengthen your answer by explaining the measurable outcome
                    of your optimization.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
