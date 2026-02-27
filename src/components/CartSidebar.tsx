import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useI18n } from "@/hooks/useI18n";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const CartSidebar = () => {
  const { items, totalItems, totalPrice, isOpen, setIsOpen, updateQuantity, removeItem, clearCart } = useCart();
  const { t, lang, dir } = useI18n();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side={dir === "rtl" ? "left" : "right"} className="w-full sm:w-[420px] bg-card border-border flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-display text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            {t("cart.title")} ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 opacity-30" />
            <p className="font-body text-sm">{t("cart.empty")}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="glass-card rounded-xl p-3 flex gap-3">
                  <img src={item.image} alt={item.name.en} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-sm font-semibold text-foreground truncate">{item.name[lang]}</h4>
                    <p className="text-primary font-display font-bold text-sm mt-0.5">€{(item.price * item.quantity).toFixed(2).replace(".", ",")}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                        <Minus className="w-3 h-3 text-foreground" />
                      </button>
                      <span className="font-body text-sm font-medium text-foreground w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                        <Plus className="w-3 h-3 text-foreground" />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto w-7 h-7 rounded-full hover:bg-destructive/10 flex items-center justify-center transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between font-body text-sm text-muted-foreground">
                <span>{t("cart.subtotal")}</span>
                <span className="text-foreground font-medium">€{totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-muted-foreground">
                <span>{t("cart.delivery")}</span>
                <span className="text-foreground font-medium">€2,50</span>
              </div>
              <div className="flex justify-between font-display text-lg font-bold text-foreground pt-2 border-t border-border">
                <span>{t("cart.total")}</span>
                <span className="text-gold-gradient">€{(totalPrice + 2.5).toFixed(2).replace(".", ",")}</span>
              </div>
              <button className="w-full btn-gold py-3 rounded-xl font-body font-semibold text-sm">
                {t("cart.checkout")}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
