import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, Truck, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { I18nProvider, useI18n } from "@/hooks/useI18n";
import Navbar from "@/components/Navbar";

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  preparing: Package,
  delivering: Truck,
  delivered: CheckCircle,
  completed: CheckCircle,
};

const statusColors: Record<string, string> = {
  pending: "text-yellow-500",
  preparing: "text-orange-500",
  delivering: "text-blue-500",
  delivered: "text-primary",
  completed: "text-primary",
};

const MyOrdersInner = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { lang } = useI18n();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, menu_items(name_nl, name_en, name_da))")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const labels = {
    title: { nl: "Mijn Bestellingen", en: "My Orders", da: "سفارش‌های من" },
    empty: { nl: "Nog geen bestellingen", en: "No orders yet", da: "هنوز سفارشی ندارید" },
    orderCta: { nl: "Bestel nu →", en: "Order now →", da: "← سفارش بدهید" },
    logout: { nl: "Uitloggen", en: "Sign Out", da: "خروج" },
    status: {
      pending: { nl: "In afwachting", en: "Pending", da: "در انتظار" },
      preparing: { nl: "Wordt bereid", en: "Preparing", da: "در حال آماده‌سازی" },
      delivering: { nl: "Onderweg", en: "On the way", da: "در راه" },
      delivered: { nl: "Bezorgd", en: "Delivered", da: "تحویل داده شده" },
      completed: { nl: "Voltooid", en: "Completed", da: "تکمیل شده" },
    } as Record<string, Record<string, string>>,
  };

  const nameKey = lang === "nl" ? "name_nl" : lang === "da" ? "name_da" : "name_en";

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground">{labels.title[lang]}</h1>
          <button onClick={async () => { await signOut(); navigate("/"); }} className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" /> {labels.logout[lang]}
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-xl border border-border p-6 animate-pulse h-24" />
            ))}
          </div>
        ) : !orders?.length ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body mb-4">{labels.empty[lang]}</p>
            <button onClick={() => navigate("/menu")} className="btn-gold px-6 py-2.5 rounded-xl font-body text-sm font-semibold">
              {labels.orderCta[lang]}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any, idx: number) => {
              const StatusIcon = statusIcons[order.status] || Clock;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card rounded-xl border border-border p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-5 h-5 ${statusColors[order.status] || "text-muted-foreground"}`} />
                      <span className="font-body text-sm font-medium text-foreground">
                        {labels.status[order.status]?.[lang] || order.status}
                      </span>
                    </div>
                    <span className="font-display font-bold text-foreground">
                      €{Number(order.total_price).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between font-body text-sm text-muted-foreground">
                        <span>{item.quantity}x {item.menu_items?.[nameKey] || "—"}</span>
                        <span>€{(item.unit_price * item.quantity).toFixed(2).replace(".", ",")}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground font-body">
                    <span>{order.order_type === "delivery" ? "🚲" : "🏪"} {order.order_type}</span>
                    <span>{new Date(order.created_at).toLocaleDateString(lang === "da" ? "fa-IR" : lang === "nl" ? "nl-NL" : "en-GB")}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const MyOrdersPage = () => (
  <I18nProvider>
    <MyOrdersInner />
  </I18nProvider>
);

export default MyOrdersPage;
