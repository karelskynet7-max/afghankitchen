import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";

const DUTCH_NAMES = ["Ahmed", "Fatima", "Mohammed", "Sara", "Ali", "Noor", "Hassan", "Layla", "Omar", "Yasmin", "Karim", "Amina"];
const DISHES_NL = ["Kabuli Pulao", "Mantu", "Chapli Kebab", "Bolani", "Tikka Kebab", "Aushak", "Qabili Chicken"];
const CITIES = ["Amsterdam", "Rotterdam", "Utrecht", "Den Haag"];

const SocialProofToasts = () => {
  const [notification, setNotification] = useState<{ name: string; dish: string; city: string; id: number } | null>(null);

  const showRandom = useCallback(() => {
    const name = DUTCH_NAMES[Math.floor(Math.random() * DUTCH_NAMES.length)];
    const dish = DISHES_NL[Math.floor(Math.random() * DISHES_NL.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    setNotification({ name, dish, city, id: Date.now() });

    setTimeout(() => setNotification(null), 4000);
  }, []);

  useEffect(() => {
    // First toast after 15s, then every 25-40s
    const initialTimer = setTimeout(() => {
      showRandom();
      const interval = setInterval(() => {
        showRandom();
      }, 25000 + Math.random() * 15000);
      return () => clearInterval(interval);
    }, 15000);

    return () => clearTimeout(initialTimer);
  }, [showRandom]);

  return (
    <div className="fixed bottom-4 left-4 z-[90] max-w-xs">
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -80, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ type: "spring", damping: 20 }}
            className="glass-card border border-border rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg"
          >
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-body text-sm text-foreground">
                <span className="font-semibold">{notification.name}</span> uit {notification.city}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                bestelde <span className="text-primary font-medium">{notification.dish}</span> 🔥
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialProofToasts;
