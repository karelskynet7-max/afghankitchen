import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Copy, Check } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const DISMISSED_KEY = "ariana_first_order_dismissed";
const COUPON_CODE = "WELCOME10";

const labels = {
  nl: {
    title: "Welkom bij Ariana! 🎉",
    subtitle: "Ontvang 10% korting op je eerste bestelling",
    code: "Gebruik code",
    cta: "Bestel nu",
    copied: "Gekopieerd!",
    dismiss: "Nee bedankt",
  },
  en: {
    title: "Welcome to Ariana! 🎉",
    subtitle: "Get 10% off your first order",
    code: "Use code",
    cta: "Order now",
    copied: "Copied!",
    dismiss: "No thanks",
  },
  da: {
    title: "!به آریانا خوش آمدید 🎉",
    subtitle: "در اولین سفارش خود ۱۰٪ تخفیف بگیرید",
    code: "کد استفاده",
    cta: "همین الان سفارش دهید",
    copied: "!کپی شد",
    dismiss: "نه ممنون",
  },
};

const FirstOrderPopup = () => {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const { lang } = useI18n();
  const l = labels[lang] || labels.en;

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, "true");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(COUPON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOrder = () => {
    handleDismiss();
    const menuLink = document.querySelector('a[href="/menu"]') as HTMLAnchorElement;
    if (menuLink) menuLink.click();
  };

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
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-md glass-card border border-border rounded-2xl p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-5"
            >
              <Gift className="w-8 h-8 text-primary" />
            </motion.div>

            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              {l.title}
            </h2>
            <p className="font-body text-muted-foreground mb-6">
              {l.subtitle}
            </p>

            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="font-body text-sm text-muted-foreground">{l.code}:</span>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2 border border-border">
                <span className="font-display text-lg font-bold text-primary tracking-wider">
                  {COUPON_CODE}
                </span>
                <button onClick={handleCopy} className="text-muted-foreground hover:text-primary transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleOrder}
              className="btn-gold w-full px-6 py-3 rounded-xl font-body text-sm font-medium mb-3"
            >
              {l.cta}
            </button>
            <button
              onClick={handleDismiss}
              className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.dismiss}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FirstOrderPopup;
