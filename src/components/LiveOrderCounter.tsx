import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/hooks/useI18n";

const LiveOrderCounter = () => {
  const { lang } = useI18n();
  const [todayCount, setTodayCount] = useState(0);
  const [recentName, setRecentName] = useState("");
  const [showRecent, setShowRecent] = useState(false);

  const labels = {
    ordersToday: { nl: "bestellingen vandaag", en: "orders today", da: "سفارش امروز" },
    justOrdered: { nl: "heeft net besteld!", en: "just ordered!", da: "!همین الان سفارش داد" },
    liveBadge: { nl: "🔴 Live", en: "🔴 Live", da: "🔴 زنده" },
  };

  useEffect(() => {
    const fetchCount = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());
      setTodayCount(count || 0);
    };

    fetchCount();

    // Subscribe to new orders for real-time updates
    const channel = supabase
      .channel("live-orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload: any) => {
        setTodayCount((prev) => prev + 1);
        const name = payload.new?.customer_name;
        if (name) {
          const firstName = name.split(" ")[0];
          const masked = firstName.charAt(0) + "***";
          setRecentName(masked);
          setShowRecent(true);
          setTimeout(() => setShowRecent(false), 4000);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-1.5 text-xs font-body font-semibold text-destructive"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
              </span>
              {labels.liveBadge[lang]}
            </motion.div>

            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              <motion.span
                key={todayCount}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-display text-lg font-bold text-foreground"
              >
                {todayCount}
              </motion.span>
              <span className="font-body text-sm text-muted-foreground">
                {labels.ordersToday[lang]}
              </span>
            </div>
          </div>

          <AnimatePresence>
            {showRecent && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                className="flex items-center gap-2 badge-saffron rounded-full px-3 py-1 text-xs font-body"
              >
                <Users className="w-3 h-3" />
                {recentName} {labels.justOrdered[lang]}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden md:flex items-center gap-2 text-xs font-body text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span>Popular right now</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveOrderCounter;
