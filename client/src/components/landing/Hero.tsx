import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Hero3DScene from "./Hero3DScene";
import ProductPreview from "./ProductPreview";

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center bg-base-100">
      <Hero3DScene />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-powered career intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-base-content tracking-tight leading-[1.1] mb-6"
          >
            Your Resume Gets <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">One Chance.</span><br />
            Make It Count.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-base-content/70 mb-10 max-w-xl leading-relaxed"
          >
            Analyze your resume against any job, discover exactly what recruiters are looking for, and practice personalized interviews with an AI career coach.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button className="btn btn-primary rounded-xl px-8 py-4 h-auto shadow-[0_0_20px_rgba(var(--p),0.3)] hover:shadow-[0_0_30px_rgba(var(--p),0.5)] border-none">
              Analyze My Resume <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="btn btn-outline border-base-content/20 text-base-content hover:bg-base-content/5 rounded-xl px-8 py-4 h-auto backdrop-blur-md">
              Try Mock Interview
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          {/* Subtle glow behind preview */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          <ProductPreview />
        </motion.div>
      </div>
    </section>
  );
}
