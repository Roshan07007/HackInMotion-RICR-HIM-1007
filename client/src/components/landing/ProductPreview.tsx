import { motion } from "framer-motion";
import { CheckCircle2, XCircle, FileText } from "lucide-react";

export default function ProductPreview() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto relative z-10"
    >
      <div className="bg-base-100/80 backdrop-blur-xl border border-base-content/10 rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        {/* Top reflection highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-base-content/20 to-transparent" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base-content font-medium text-sm">Resume Match</h3>
              <p className="text-base-content/50 text-xs">Senior Frontend Engineer</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-success">
              92%
            </div>
            <p className="text-success/80 text-xs font-medium">Strong Match</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-base-content/70 text-xs font-semibold uppercase tracking-wider mb-3">Skills Matched</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Node.js', 'REST APIs', 'PostgreSQL'].map(skill => (
                <div key={skill} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-base-content/5 border border-base-content/10 text-xs text-base-content/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base-content/70 text-xs font-semibold uppercase tracking-wider mb-3">Missing Requirements</h4>
            <div className="flex flex-wrap gap-2">
              {['AWS', 'Docker'].map(skill => (
                <div key={skill} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-error/10 border border-error/20 text-xs text-error">
                  <XCircle className="w-3.5 h-3.5 text-error" />
                  {skill}
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-base-content/10">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-3">
              <div className="w-1.5 h-auto bg-primary rounded-full shrink-0" />
              <div>
                <h5 className="text-primary text-xs font-semibold mb-1">AI Recommendation</h5>
                <p className="text-base-content/80 text-xs leading-relaxed">
                  Add measurable impact to your project descriptions (e.g., "reduced load time by 40%") to strengthen your match for this senior role.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
