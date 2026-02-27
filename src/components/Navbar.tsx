import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ShoppingBag, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-gold-gradient font-display text-2xl md:text-3xl font-bold tracking-tight">
              Ariana
            </span>
            <span className="text-muted-foreground font-body text-xs uppercase tracking-[0.3em] mt-1 hidden sm:block">
              Tech
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#menu" className="text-foreground/70 hover:text-primary transition-colors font-body text-sm tracking-wide">
              Menu
            </a>
            <a href="#about" className="text-foreground/70 hover:text-primary transition-colors font-body text-sm tracking-wide">
              Over Ons
            </a>
            <a href="#catering" className="text-foreground/70 hover:text-primary transition-colors font-body text-sm tracking-wide">
              Catering
            </a>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline font-body">Amsterdam</span>
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center glass-card hover:border-primary/30 transition-all">
              <User className="w-4 h-4 text-foreground/70" />
            </button>
            <button className="relative w-9 h-9 rounded-full flex items-center justify-center btn-gold rounded-full">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-saffron text-[10px] font-bold flex items-center justify-center text-background">
                0
              </span>
            </button>
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden glass-card border-t border-border"
        >
          <div className="px-4 py-4 flex flex-col gap-3">
            <a href="#menu" className="text-foreground/70 hover:text-primary transition-colors font-body py-2">Menu</a>
            <a href="#about" className="text-foreground/70 hover:text-primary transition-colors font-body py-2">Over Ons</a>
            <a href="#catering" className="text-foreground/70 hover:text-primary transition-colors font-body py-2">Catering</a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
