import { useState, useEffect } from "react";
import { Clock, Zap } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const labels = {
  nl: {
    prefix: "Bestel binnen",
    suffix: "voor bezorging vóór",
  },
  en: {
    prefix: "Order within",
    suffix: "for delivery by",
  },
  da: {
    prefix: "سفارش در",
    suffix: "برای تحویل تا",
  },
};

const UrgencyCountdown = () => {
  const { lang } = useI18n();
  const l = labels[lang] || labels.en;
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });
  const [deliveryTime, setDeliveryTime] = useState("");

  useEffect(() => {
    const calculateTarget = () => {
      const now = new Date();
      // Next delivery slot is in 45 minutes, rounded to nearest 15 min
      const target = new Date(now);
      target.setMinutes(Math.ceil((now.getMinutes() + 15) / 15) * 15);
      target.setSeconds(0);
      
      const delivery = new Date(target);
      delivery.setMinutes(delivery.getMinutes() + 30);
      
      return { target, delivery };
    };

    const update = () => {
      const { target, delivery } = calculateTarget();
      const now = new Date();
      const diff = Math.max(0, target.getTime() - now.getTime());
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ minutes, seconds });
      setDeliveryTime(
        delivery.toLocaleTimeString(lang === "nl" ? "nl-NL" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 flex-wrap">
      <Zap className="w-4 h-4 text-primary flex-shrink-0" />
      <span className="font-body text-xs text-foreground">
        {l.prefix}
      </span>
      <span className="font-display text-sm font-bold text-primary tabular-nums">
        {pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
      <span className="font-body text-xs text-foreground">
        {l.suffix}
      </span>
      <span className="font-display text-sm font-bold text-primary">
        {deliveryTime}
      </span>
      <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
    </div>
  );
};

export default UrgencyCountdown;
