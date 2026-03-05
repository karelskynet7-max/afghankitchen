import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Minus, Plus, X, Loader2, ShoppingCart, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/hooks/useI18n";
import { useCart } from "@/hooks/useCart";
import ReactMarkdown from "react-markdown";

const labels = {
  nl: { button: "AI Maaltijd Suggestie", guests: "Gasten", go: "Verras me!", close: "Sluiten", loading: "Even denken...", addAll: "Alles toevoegen", addSelected: "Geselecteerde toevoegen", added: "Toegevoegd!" },
  en: { button: "AI Meal Suggestion", guests: "Guests", go: "Surprise me!", close: "Close", loading: "Thinking...", addAll: "Add all to cart", addSelected: "Add selected", added: "Added!" },
  da: { button: "پیشنهاد غذای هوشمند", guests: "مهمان‌ها", go: "!غافلگیرم کن", close: "بستن", loading: "...در حال فکر کردن", addAll: "افزودن همه به سبد", addSelected: "افزودن انتخاب‌شده‌ها", added: "!اضافه شد" },
};

interface SuggestedItem {
  id: number;
  quantity: number;
  name: { nl: string; en: string; da: string };
  price: number;
  image: string;
}

const MealSuggestion = () => {
  const { lang } = useI18n();
  const { addItem } = useCart();
  const l = labels[lang] || labels.en;
  const [open, setOpen] = useState(false);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [suggestedItems, setSuggestedItems] = useState<SuggestedItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSuggestedItems([]);
    setSelectedIds(new Set());
    setAddedToCart(false);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("suggest-meal", {
        body: { guests, lang },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setResult(data.suggestion);
      if (data.suggestedItems?.length) {
        setSuggestedItems(data.suggestedItems);
        setSelectedIds(new Set(data.suggestedItems.map((i: SuggestedItem) => i.id)));
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addToCart = (itemsToAdd: SuggestedItem[]) => {
    for (const item of itemsToAdd) {
      for (let i = 0; i < item.quantity; i++) {
        addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
      }
    }
    setAddedToCart(true);
    setTimeout(() => setOpen(false), 1200);
  };

  const handleAddAll = () => addToCart(suggestedItems);
  const handleAddSelected = () => addToCart(suggestedItems.filter((i) => selectedIds.has(i.id)));

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => { setOpen(true); setResult(null); setError(null); setSuggestedItems([]); setAddedToCart(false); }}
        className="fixed bottom-6 right-6 z-40 btn-gold rounded-full px-5 py-3 font-body text-sm font-semibold flex items-center gap-2 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="w-5 h-5" />
        <span className="hidden sm:inline">{l.button}</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="glass-card rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full btn-gold flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">{l.button}</h2>
              </div>

              {/* Guest selector */}
              {!result && !loading && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between glass-card rounded-xl p-4">
                    <span className="font-body text-sm text-foreground">{l.guests}</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-display text-xl font-bold text-gold-gradient w-8 text-center">{guests}</span>
                      <button onClick={() => setGuests(Math.min(10, guests + 1))}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <motion.button
                    onClick={suggest}
                    className="w-full btn-gold rounded-xl py-3 font-body font-semibold text-sm flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    {l.go}
                  </motion.button>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="font-body text-sm text-muted-foreground">{l.loading}</p>
                </div>
              )}

              {/* Result */}
              {result && !addedToCart && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="prose prose-sm prose-invert max-w-none font-body text-sm text-foreground [&_h1]:font-display [&_h2]:font-display [&_h3]:font-display [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-primary [&_li]:text-foreground/90">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>

                  {/* Selectable items */}
                  {suggestedItems.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">
                        {lang === "nl" ? "Selecteer & voeg toe" : lang === "da" ? "انتخاب و افزودن" : "Select & add to cart"}
                      </p>
                      {suggestedItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                            selectedIds.has(item.id)
                              ? "border-primary bg-primary/10"
                              : "border-border bg-muted/30 opacity-60"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                            selectedIds.has(item.id) ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}>
                            {selectedIds.has(item.id) && <Check className="w-3 h-3 text-primary-foreground" />}
                          </div>
                          {item.image && (
                            <img src={item.image} alt={item.name[lang]} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm font-medium text-foreground truncate">{item.name[lang]}</p>
                            <p className="font-body text-xs text-muted-foreground">
                              {item.quantity > 1 ? `${item.quantity}× ` : ""}€{item.price.toFixed(2).replace(".", ",")}
                            </p>
                          </div>
                          <span className="font-display text-sm font-bold text-gold-gradient shrink-0">
                            €{(item.price * item.quantity).toFixed(2).replace(".", ",")}
                          </span>
                        </button>
                      ))}

                      {/* Action buttons */}
                      <div className="flex gap-2 mt-3">
                        <motion.button
                          onClick={handleAddAll}
                          className="flex-1 btn-gold rounded-xl py-2.5 font-body font-semibold text-xs flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {l.addAll}
                        </motion.button>
                        {selectedIds.size < suggestedItems.length && selectedIds.size > 0 && (
                          <motion.button
                            onClick={handleAddSelected}
                            className="flex-1 btn-lapis rounded-xl py-2.5 font-body font-semibold text-xs flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Plus className="w-4 h-4" />
                            {l.addSelected}
                          </motion.button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Try again */}
                  <motion.button
                    onClick={() => { setResult(null); setSuggestedItems([]); }}
                    className="w-full mt-3 border border-border rounded-xl py-2 font-body text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="w-3 h-3" />
                    {l.go}
                  </motion.button>
                </motion.div>
              )}

              {/* Added confirmation */}
              {addedToCart && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 gap-3"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-7 h-7 text-primary" />
                  </div>
                  <p className="font-display text-lg font-bold text-foreground">{l.added}</p>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <div className="text-center py-6">
                  <p className="font-body text-sm text-destructive">{error}</p>
                  <button onClick={suggest} className="mt-3 btn-gold rounded-lg px-4 py-2 font-body text-xs font-semibold">
                    Retry
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MealSuggestion;
