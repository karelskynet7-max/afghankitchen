import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useCart } from "@/hooks/useCart";
import { useSubmitOrder } from "@/hooks/useOrders";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CheckoutDialog = () => {
  const { t, lang, dir } = useI18n();
  const { items, totalPrice, clearCart, isOpen: cartOpen, setIsOpen: setCartOpen } = useCart();
  const submitOrder = useSubmitOrder();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    orderType: "pickup" as "pickup" | "delivery",
    deliveryAddress: "",
    notes: "",
  });

  // Expose open function on cart checkout button
  // We use a global event
  if (typeof window !== "undefined") {
    (window as any).__openCheckout = () => {
      setCartOpen(false);
      setOpen(true);
    };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitOrder.mutateAsync({
        ...form,
        items,
        totalPrice: totalPrice + (form.orderType === "delivery" ? 3.5 : 0),
      });
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setForm({ customerName: "", customerPhone: "", customerEmail: "", orderType: "pickup", deliveryAddress: "", notes: "" });
      }, 3000);
    } catch (err) {
      console.error("Order failed:", err);
    }
  };

  const labels = {
    title: { nl: "Afrekenen", en: "Checkout", da: "پرداخت" },
    name: { nl: "Naam", en: "Name", da: "نام" },
    phone: { nl: "Telefoon", en: "Phone", da: "تلفن" },
    email: { nl: "E-mail (optioneel)", en: "Email (optional)", da: "ایمیل (اختیاری)" },
    pickup: { nl: "Afhalen", en: "Pickup", da: "بردن" },
    delivery: { nl: "Bezorgen", en: "Delivery", da: "تحویل" },
    address: { nl: "Bezorgadres", en: "Delivery address", da: "آدرس تحویل" },
    notes: { nl: "Opmerkingen", en: "Notes", da: "یادداشت" },
    submit: { nl: "Bestelling Plaatsen", en: "Place Order", da: "ثبت سفارش" },
    success: { nl: "Bestelling geplaatst! 🎉", en: "Order placed! 🎉", da: "!سفارش ثبت شد 🎉" },
    successDesc: { nl: "We nemen snel contact op.", en: "We'll contact you shortly.", da: ".به زودی با شما تماس می‌گیریم" },
  };

  const l = (key: keyof typeof labels) => labels[key][lang];

  if (success) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md" dir={dir}>
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <CheckCircle className="w-16 h-16 text-primary" />
            </motion.div>
            <h3 className="font-display text-2xl font-bold text-foreground">{l("success")}</h3>
            <p className="text-muted-foreground font-body">{l("successDesc")}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" dir={dir}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{l("title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="font-body text-sm text-muted-foreground block mb-1">{l("name")} *</label>
            <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border font-body text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
          </div>
          <div>
            <label className="font-body text-sm text-muted-foreground block mb-1">{l("phone")} *</label>
            <input required type="tel" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border font-body text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
          </div>
          <div>
            <label className="font-body text-sm text-muted-foreground block mb-1">{l("email")}</label>
            <input type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border font-body text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
          </div>
          <div className="flex gap-3">
            {(["pickup", "delivery"] as const).map((type) => (
              <button key={type} type="button" onClick={() => setForm({ ...form, orderType: type })}
                className={`flex-1 py-2.5 rounded-xl font-body text-sm font-medium border transition-all ${form.orderType === type ? "btn-gold" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                {l(type)}
              </button>
            ))}
          </div>
          {form.orderType === "delivery" && (
            <div>
              <label className="font-body text-sm text-muted-foreground block mb-1">{l("address")} *</label>
              <input required value={form.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border font-body text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
          )}
          <div>
            <label className="font-body text-sm text-muted-foreground block mb-1">{l("notes")}</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border font-body text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none" />
          </div>

          {/* Order summary */}
          <div className="border-t border-border pt-4 space-y-1">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between font-body text-sm">
                <span className="text-foreground">{item.quantity}x {item.name[lang]}</span>
                <span className="text-muted-foreground">€{(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
              </div>
            ))}
            {form.orderType === "delivery" && (
              <div className="flex justify-between font-body text-sm">
                <span className="text-foreground">{l("delivery")}</span>
                <span className="text-muted-foreground">€3,50</span>
              </div>
            )}
            <div className="flex justify-between font-display font-bold text-lg pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-gold-gradient">€{(totalPrice + (form.orderType === "delivery" ? 3.5 : 0)).toFixed(2).replace(".", ",")}</span>
            </div>
          </div>

          <button type="submit" disabled={submitOrder.isPending || items.length === 0}
            className="w-full btn-gold py-3 rounded-xl font-body text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {submitOrder.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {l("submit")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
