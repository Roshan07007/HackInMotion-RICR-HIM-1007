import { BrainCircuit, Github, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-base-content/5 bg-base-100 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 text-base-content mb-4">
            <BrainCircuit className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">RoleFit</span>
          </Link>
          <p className="text-sm text-base-content/50 max-w-xs">
            Your personal AI career coach. Know your fit. Ace the interview.
          </p>
        </div>
        <div className="flex flex-wrap gap-12 text-sm">
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-base-content">Product</h4>
            <a href="#how-it-works" className="text-base-content/60 hover:text-base-content transition-colors">How it works</a>
            <a href="#features" className="text-base-content/60 hover:text-base-content transition-colors">Features</a>
            <a href="#pricing" className="text-base-content/60 hover:text-base-content transition-colors">Pricing</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-base-content">Legal</h4>
            <a href="#" className="text-base-content/60 hover:text-base-content transition-colors">Privacy Policy</a>
            <a href="#" className="text-base-content/60 hover:text-base-content transition-colors">Terms of Service</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-base-content">Social</h4>
            <a href="#" className="text-base-content/60 hover:text-base-content transition-colors flex items-center gap-2">
              <Twitter className="w-4 h-4" /> Twitter
            </a>
            <a href="#" className="text-base-content/60 hover:text-base-content transition-colors flex items-center gap-2">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-base-content/5 flex flex-col md:flex-row items-center justify-between text-xs text-base-content/40">
        <p>© {new Date().getFullYear()} RoleFit. All rights reserved.</p>
        <p>Built with precision.</p>
      </div>
    </footer>
  );
}
