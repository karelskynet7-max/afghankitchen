import { motion } from "framer-motion";
import { Users, FileText, ChefHat, CalendarClock, ArrowRight } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import cateringImg from "@/assets/catering-buffet.jpg";

const CateringSection = () => {
  const { t, dir } = useI18n();

  const features = [
    { icon: Users, text: t("catering.minOrder") },
    { icon: FileText, text: t("catering.vat") },
    { icon: ChefHat, text: t("catering.custom") },
    { icon: CalendarClock, text: t("catering.weekly") },
  ];

  return (
    <section id="catering" className="py-20 md:py-28 bg-muted/30" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden aspect-[4/3]"
          >
            <img src={cateringImg} alt="Afghan catering buffet" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-lapis-gradient font-body text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">
              {t("catering.label")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("catering.title")}
            </h2>
            <p className="text-muted-foreground font-body mb-8 leading-relaxed">
              {t("catering.desc")}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feat, i) => (
                <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-body text-sm text-foreground font-medium">{feat.text}</span>
                </div>
              ))}
            </div>

            <button className="btn-gold px-8 py-3.5 rounded-xl font-body text-sm flex items-center gap-2 group">
              {t("catering.cta")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CateringSection;
