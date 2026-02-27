import { motion } from "framer-motion";
import { Bike, CreditCard, Shield, Zap } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const FeaturesStrip = () => {
  const { t, dir } = useI18n();

  const features = [
    { icon: Zap, label: t("feat.delivery") },
    { icon: CreditCard, label: t("feat.payment") },
    { icon: Shield, label: t("feat.halal") },
    { icon: Bike, label: t("feat.bike") },
  ];

  return (
    <section className="border-y border-border bg-muted/30" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex items-center justify-center gap-3 py-5 md:py-6">
              <f.icon className="w-5 h-5 text-primary" />
              <span className="font-body text-sm text-foreground/80">{f.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesStrip;
