import { motion } from "framer-motion";

export default function PhilosophySection() {
  return (
    <section className="py-32 relative z-10 bg-base-100 flex items-center justify-center overflow-hidden">
      {/* Background glowing line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent -translate-y-1/2 opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold text-base-content tracking-tight leading-tight mb-6"
        >
          Every candidate deserves a fair shot.
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl md:text-2xl text-base-content/50 font-medium"
        >
          Honest feedback shouldn’t require an expensive career coach.
        </motion.p>
      </div>
    </section>
  );
}
