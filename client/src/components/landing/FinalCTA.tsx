import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function FinalCTA() {
  return (
    <section className="py-32 relative z-10 bg-base-100 overflow-hidden">
      {/* Radial glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-bold text-base-content tracking-tight mb-8"
        >
          Your next interview starts here.
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-base-content/60 mb-12 max-w-2xl mx-auto"
        >
          Upload your resume. Pick your dream role. Find out how ready you really are.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <Link 
            to="/login"
            className="flex items-center gap-2 btn btn-primary rounded-xl px-8 py-4 h-auto text-lg transition-all shadow-[0_0_30px_rgba(var(--p),0.4)] hover:shadow-[0_0_40px_rgba(var(--p),0.6)] hover:scale-105 active:scale-95 border-none"
          >
            Analyze My Resume <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <p className="text-base-content/40 text-sm mt-2">
            Free to start · No career coach required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
