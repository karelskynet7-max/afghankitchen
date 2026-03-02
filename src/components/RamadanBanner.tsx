import { motion } from "framer-motion";
import { Moon, X } from "lucide-react";
import { useState } from "react";
import ramadanImage from "@/assets/ramadan-mubarak.jpg";
import { useI18n } from "@/hooks/useI18n";

const RamadanBanner = () => {
  const [visible, setVisible] = useState(true);
  const { t, dir } = useI18n();

  if (!visible) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-auto max-w-7xl mt-6"
      dir={dir}
    >
      <div className="relative h-[220px] sm:h-[280px] md:h-[340px] rounded-2xl overflow-hidden">
        <img
          src={ramadanImage}
          alt="Ramadan Mubarak — Restaurant Family"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />

        <div className="absolute inset-0 flex items-center px-6 sm:px-10 lg:px-14">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary rounded-full px-4 py-1.5 text-xs font-body font-medium mb-3">
              <Moon className="w-3.5 h-3.5" />
              {t("ramadan.badge")}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t("ramadan.title")}
            </h2>
            <p className="font-body text-foreground/70 text-sm sm:text-base leading-relaxed mb-4 max-w-sm">
              {t("ramadan.desc")}
            </p>
            <a
              href="/menu"
              className="btn-gold px-6 py-2.5 rounded-xl font-body text-sm inline-flex items-center gap-2"
            >
              {t("ramadan.cta")}
            </a>
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-background/60 backdrop-blur-sm text-foreground/70 hover:text-foreground transition-colors"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.section>
  );
};

export default RamadanBanner;
