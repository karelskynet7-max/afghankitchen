import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, Clock, Truck, CheckCircle, XCircle, ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { I18nProvider } from "@/hooks/useI18n";

const deliverySteps = [
  { key: "pending", icon: Clock, label: "Order Received" },
  { key: "preparing", icon: ChefHat, label: "Preparing" },
  { key: "delivering", icon: Truck, label: "On the Way" },
  { key: "delivered", icon: Package, label: "Delivered" },
  { key: "completed", icon: CheckCircle, label: "Completed" },
];

const pickupSteps = [
  { key: "pending", icon: Clock, label: "Order Received" },
  { key: "preparing", icon: ChefHat, label: "Preparing" },
  { key: "ready", icon: Package, label: "Ready for Pickup" },
  { key: "completed", icon: CheckCircle, label: "Completed" },
];

const TrackOrderInner = () => {
  const { token } = useParams<{ token: string }>();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["track-order", token],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, menu_items(name_en))")
        .eq("tracking_token", token!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!token,
    refetchInterval: 15000,
  });

  const statusSteps = order?.order_type === "pickup" ? pickupSteps : deliverySteps;
  const isCancelled = order?.status === "cancelled";
  const currentStepIdx = statusSteps.findIndex((s) => s.key === order?.status);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        {isLoading && (
          <div className="glass-card rounded-2xl border border-border p-8 animate-pulse h-64" />
        )}
        {error && (
          <div className="glass-card rounded-2xl border border-border p-8 text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-foreground">Order not found</h2>
            <p className="text-muted-foreground font-body text-sm mt-1">This tracking link is invalid or expired.</p>
          </div>
        )}
        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-card rounded-2xl border border-border p-6">
              <h1 className="font-display text-2xl font-bold text-foreground mb-1">Order Tracking</h1>
              <p className="text-muted-foreground font-body text-sm">
                {order.customer_name} • {new Date(order.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            {/* Status timeline */}
            <div className="glass-card rounded-2xl border border-border p-6">
              {isCancelled ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <XCircle className="w-12 h-12 text-destructive" />
                  <p className="font-display text-lg font-bold text-destructive">Order Cancelled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {statusSteps.map((step, idx) => {
                    const isActive = idx <= currentStepIdx;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className={`flex-1 border-b border-border pb-3 ${idx === statusSteps.length - 1 ? "border-b-0" : ""}`}>
                          <p className={`font-body text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                        </div>
                        {idx === currentStepIdx && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-body font-medium">Current</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order items */}
            <div className="glass-card rounded-2xl border border-border p-6">
              <h3 className="font-display text-lg font-bold text-foreground mb-3">Order Details</h3>
              <div className="space-y-2">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between font-body text-sm">
                    <span className="text-foreground">{item.quantity}x {item.menu_items?.name_en || "Item"}</span>
                    <span className="text-muted-foreground">€{(Number(item.unit_price) * item.quantity).toFixed(2).replace(".", ",")}</span>
                  </div>
                ))}
                <div className="flex justify-between font-display font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-gold-gradient">€{Number(order.total_price).toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const TrackOrderPage = () => (
  <I18nProvider>
    <TrackOrderInner />
  </I18nProvider>
);

export default TrackOrderPage;
