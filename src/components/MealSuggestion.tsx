import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Minus, Plus, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/hooks/useI18n";
import ReactMarkdown from "react-markdown";

const labels = {
  nl: { button: "AI Maaltijd Suggestie", guests: "Gasten", go: "Verras me!", close: "Sluiten", loading: "Even denken..." },
  en: { button: "AI Meal Suggestion", guests: "Guests", go: "Surprise me!", close: "Close", loading: "Thinking..." },
  da: { button: "پیشنهاد غذای هوشمند", guests: "مهمان‌ها", go: "!غافلگیرم کن", close: "بستن", loading: "...در حال فکر کردن" },
};

const MealSuggestion = () => {
  const { lang } = useI18n();
  const l = labels[lang] || labels.en;
  const [open, setOpen] = useState(false);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const suggest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("suggest-meal", {
        body: { guests, lang },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setResult(data.suggestion);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => { setOpen(true); setResult(null); setError(null); }}
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
              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="prose prose-sm prose-invert max-w-none font-body text-sm text-foreground [&_h1]:font-display [&_h2]:font-display [&_h3]:font-display [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-primary [&_li]:text-foreground/90">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                  <motion.button
                    onClick={() => { setResult(null); }}
                    className="w-full mt-4 btn-lapis rounded-xl py-2.5 font-body font-semibold text-sm flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    {l.go}
                  </motion.button>
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
