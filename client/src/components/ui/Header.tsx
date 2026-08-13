import { Link } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

export default function Header() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-base-content/5 bg-base-100/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-base-content hover:opacity-80 transition-opacity">
          <BrainCircuit className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">RoleFit</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-base-content/70">
          <a href="#how-it-works" className="hover:text-base-content transition-colors">How it works</a>
          <a href="#features" className="hover:text-base-content transition-colors">Features</a>
          <a href="#about" className="hover:text-base-content transition-colors">About</a>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/login" className="text-base-content/70 hover:text-base-content transition-colors hidden md:block">
            Sign In
          </Link>
          <Link
            to="/login"
            className="btn btn-primary rounded-full px-5 py-2 min-h-0 h-auto shadow-[0_0_15px_rgba(var(--p),0.3)] hover:shadow-[0_0_20px_rgba(var(--p),0.5)] border-none"
          >
            Analyze My Resume
          </Link>
        </div>
      </div>
    </nav>
  );
}
