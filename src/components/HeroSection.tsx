import { motion } from "framer-motion";
import { ArrowRight, Clock, Star } from "lucide-react";
import heroImage from "@/assets/hero-kebab.jpg";
import { useI18n } from "@/hooks/useI18n";

const HeroSection = () => {
  const { t, dir } = useI18n();

  return (
    <section className="relative min-h-screen flex items-end pb-20 md:pb-32 overflow-hidden" dir={dir}>
      <div className="absolute inset-0">
        <img src={heroImage} alt="Afghan kebabs grilling over charcoal" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 badge-saffron rounded-full px-4 py-1.5 text-xs font-body font-medium mb-6">
            <Star className="w-3 h-3" />
            {t("hero.badge")}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
            {t("hero.title1")}<br />
            <span className="text-gold-gradient">{t("hero.title2")}</span> {t("hero.title3")}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="font-body text-foreground/70 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
            {t("hero.subtitle")}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4">
            <button className="btn-gold px-8 py-3.5 rounded-xl font-body text-sm flex items-center gap-2 group">
              {t("hero.order")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="btn-lapis px-8 py-3.5 rounded-xl font-body text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {t("hero.delivery")}
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-10 flex items-center gap-6 text-muted-foreground text-xs font-body">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
              <span>4.9/5</span>
            </div>
            <span className="w-px h-4 bg-border" />
            <span>{t("hero.reviews")}</span>
            <span className="w-px h-4 bg-border hidden sm:block" />
            <span className="hidden sm:block">{t("hero.halal")}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
