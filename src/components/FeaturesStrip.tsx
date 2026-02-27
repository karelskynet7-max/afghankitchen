import { motion } from "framer-motion";
import { Bike, CreditCard, Shield, Zap } from "lucide-react";

const features = [
  { icon: Zap, label: "35 min bezorging" },
  { icon: CreditCard, label: "iDEAL & Apple Pay" },
  { icon: Shield, label: "100% Halal" },
  { icon: Bike, label: "Fietskoeriers" },
];

const FeaturesStrip = () => (
  <section className="border-y border-border bg-muted/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-center gap-3 py-5 md:py-6"
          >
            <f.icon className="w-5 h-5 text-primary" />
            <span className="font-body text-sm text-foreground/80">{f.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesStrip;
