import { motion } from "framer-motion";
import { Heart, Award, Flame, MapPin } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import aboutImg from "@/assets/about-feast.jpg";

const AboutSection = () => {
  const { t, dir } = useI18n();

  const stats = [
    { icon: Flame, value: "2019", label: t("about.since") },
    { icon: Heart, value: "50K+", label: t("about.served") },
    { icon: Award, value: "100%", label: t("about.halal") },
    { icon: MapPin, value: "4", label: t("about.cities") },
  ];

  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden" dir={dir}>
      {/* Subtle decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden aspect-square relative group">
              <img
                src={aboutImg}
                alt="Traditional Afghan feast"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
            {/* Floating quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-4 left-4 right-4 sm:left-8 sm:right-8 glass-card rounded-xl p-5 border border-primary/20"
            >
              <p className="font-display text-sm md:text-base text-foreground italic leading-relaxed">
                "{t("about.quote")}"
              </p>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold-gradient font-body text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">
              {t("about.label")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {t("about.title")}
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-4">
              {t("about.p1")}
            </p>
            <p className="text-muted-foreground font-body leading-relaxed mb-8">
              {t("about.p2")}
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-4 text-center"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="font-display text-xl font-bold text-gold-gradient">{stat.value}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
