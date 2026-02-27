import { motion } from "framer-motion";
import { ArrowRight, Clock, Star } from "lucide-react";
import heroImage from "@/assets/hero-kebab.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-end pb-20 md:pb-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Afghan kebabs grilling over charcoal"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        {/* Extra overlay for readability */}
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 badge-saffron rounded-full px-4 py-1.5 text-xs font-body font-medium mb-6"
          >
            <Star className="w-3 h-3" />
            #1 Afghan Cuisine in Nederland
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
          >
            Authentic Afghan
            <br />
            <span className="text-gold-gradient">Flavours,</span> Delivered
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="font-body text-foreground/70 text-lg md:text-xl leading-relaxed mb-8 max-w-lg"
          >
            Van Amsterdam tot Den Haag — verse kebabs, mantu & kabuli pulao bij jou thuis binnen 35 minuten.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <button className="btn-gold px-8 py-3.5 rounded-xl font-body text-sm flex items-center gap-2 group">
              Bestel Nu
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="btn-lapis px-8 py-3.5 rounded-xl font-body text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Bezorgtijd: ~35 min
            </button>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex items-center gap-6 text-muted-foreground text-xs font-body"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
              <span>4.9/5</span>
            </div>
            <span className="w-px h-4 bg-border" />
            <span>2.500+ beoordelingen</span>
            <span className="w-px h-4 bg-border hidden sm:block" />
            <span className="hidden sm:block">100% Halal</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
