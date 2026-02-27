import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ShoppingBag, User, Menu, X, Globe } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, lang, setLang, languages, dir } = useI18n();
  let cart: { totalItems: number; setIsOpen: (o: boolean) => void } | null = null;
  try { cart = useCart(); } catch { /* cart not available on pages without CartProvider */ }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border"
      dir={dir}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2">
            <span className="text-gold-gradient font-display text-2xl md:text-3xl font-bold tracking-tight">Ariana</span>
            <span className="text-muted-foreground font-body text-xs uppercase tracking-[0.3em] mt-1 hidden sm:block">Tech</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/menu" className="text-foreground/70 hover:text-primary transition-colors font-body text-sm tracking-wide">{t("nav.menu")}</Link>
            <a href="#about" className="text-foreground/70 hover:text-primary transition-colors font-body text-sm tracking-wide">{t("nav.about")}</a>
            <a href="#catering" className="text-foreground/70 hover:text-primary transition-colors font-body text-sm tracking-wide">{t("nav.catering")}</a>
          </div>

          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-body"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{languages[lang]}</span>
              </button>
              {langOpen && (
                <div className="absolute top-full mt-2 right-0 glass-card rounded-lg border border-border py-1 min-w-[100px] z-50">
                  {(Object.keys(languages) as Array<keyof typeof languages>).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm font-body hover:bg-muted/50 transition-colors ${lang === l ? "text-primary" : "text-foreground/70"}`}
                    >
                      {languages[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline font-body">Amsterdam</span>
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center glass-card hover:border-primary/30 transition-all">
              <User className="w-4 h-4 text-foreground/70" />
            </button>
            <button onClick={() => cart?.setIsOpen(true)} className="relative w-9 h-9 rounded-full flex items-center justify-center btn-gold rounded-full">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-saffron text-[10px] font-bold flex items-center justify-center text-background">{cart?.totalItems ?? 0}</span>
            </button>
            <button className="md:hidden w-9 h-9 flex items-center justify-center" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="md:hidden glass-card border-t border-border">
          <div className="px-4 py-4 flex flex-col gap-3">
            <Link to="/menu" className="text-foreground/70 hover:text-primary transition-colors font-body py-2">{t("nav.menu")}</Link>
            <a href="#about" className="text-foreground/70 hover:text-primary transition-colors font-body py-2">{t("nav.about")}</a>
            <a href="#catering" className="text-foreground/70 hover:text-primary transition-colors font-body py-2">{t("nav.catering")}</a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
