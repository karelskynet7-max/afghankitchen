import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, ArrowRight } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { Link } from "react-router-dom";

const SHOWN_KEY = "ariana_exit_intent_shown";

const labels = {
  nl: {
    title: "Wacht even! 🍽️",
    subtitle: "Gratis Bolani bij je eerste bestelling boven €25",
    cta: "Bekijk het menu",
    dismiss: "Misschien later",
    urgency: "Alleen vandaag geldig",
  },
  en: {
    title: "Wait! 🍽️",
    subtitle: "Free Bolani with your first order over €25",
    cta: "View the menu",
    dismiss: "Maybe later",
    urgency: "Valid today only",
  },
  da: {
    title: "!صبر کنید 🍽️",
    subtitle: "بولانی رایگان با اولین سفارش بالای ۲۵ یورو",
    cta: "مشاهده منو",
    dismiss: "شاید بعداً",
    urgency: "فقط امروز معتبر است",
  },
};

const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);
  const triggered = useRef(false);
  const { lang } = useI18n();
  const l = labels[lang] || labels.en;

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SHOWN_KEY);
    if (alreadyShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !triggered.current) {
        triggered.current = true;
        sessionStorage.setItem(SHOWN_KEY, "true");
        setShow(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const handleDismiss = () => setShow(false);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", damping: 22 }}
            className="relative w-full max-w-sm glass-card border border-border rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Urgency strip */}
            <div className="bg-primary px-4 py-1.5 flex items-center justify-center gap-2">
              <Flame className="w-3.5 h-3.5 text-primary-foreground" />
              <span className="font-body text-xs font-semibold text-primary-foreground uppercase tracking-wider">
                {l.urgency}
              </span>
              <Flame className="w-3.5 h-3.5 text-primary-foreground" />
            </div>

            <div className="p-7 text-center">
              <button
                onClick={handleDismiss}
                className="absolute top-10 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                {l.title}
              </h2>
              <p className="font-body text-muted-foreground mb-6 text-sm leading-relaxed">
                {l.subtitle}
              </p>

              <Link
                to="/menu"
                onClick={handleDismiss}
                className="btn-gold w-full px-6 py-3 rounded-xl font-body text-sm font-medium flex items-center justify-center gap-2 group"
              >
                {l.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={handleDismiss}
                className="mt-3 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.dismiss}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
