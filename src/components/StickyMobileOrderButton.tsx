import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { Link } from "react-router-dom";

const labels = {
  nl: "Bestel Nu",
  en: "Order Now",
  da: "همین الان سفارش دهید",
};

const StickyMobileOrderButton = () => {
  const { lang } = useI18n();
  const label = labels[lang] || labels.en;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[80] md:hidden">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring", damping: 20 }}
      >
        <Link
          to="/menu"
          className="btn-gold px-7 py-3.5 rounded-full font-body text-sm font-bold flex items-center gap-2.5 shadow-[0_4px_20px_hsl(45_80%_55%/0.35)]"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ShoppingBag className="w-5 h-5" />
          </motion.div>
          {label}
        </Link>
      </motion.div>
    </div>
  );
};

export default StickyMobileOrderButton;
