import { motion } from "framer-motion";
import { Plus, Flame, Leaf, Clock } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useCart } from "@/hooks/useCart";
import { useMenuItems } from "@/hooks/useMenuItems";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const QuickOrderSection = () => {
  const { t, lang, dir } = useI18n();
  const { data: allItems = [], isLoading } = useMenuItems();
  let cart: ReturnType<typeof useCart> | null = null;
  try { cart = useCart(); } catch { /* no cart provider */ }

  // Show first 3 popular items, or first 3 if none popular
  const dishes = allItems.filter((i) => i.popular).slice(0, 3);
  const displayDishes = dishes.length >= 3 ? dishes : allItems.slice(0, 3);

  return (
    <section id="menu" className="py-20 md:py-28" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <span className="text-lapis-gradient font-body text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">{t("quick.label")}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{t("quick.title")}</h2>
          <p className="text-muted-foreground font-body max-w-md">{t("quick.desc")}</p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-3 w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayDishes.map((dish, i) => (
              <motion.div key={dish.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card-hover rounded-2xl overflow-hidden group cursor-pointer">
                <div className="relative aspect-square overflow-hidden">
                  <img src={dish.image} alt={dish.name.en} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {dish.popular && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 badge-saffron rounded-full px-3 py-1 text-xs font-body font-medium">
                      <Flame className="w-3 h-3" />
                      {t("quick.popular")}
                    </div>
                  )}
                  <button onClick={() => cart?.addItem({ id: dish.id, name: dish.name, price: dish.price, image: dish.image })}
                    className="absolute bottom-3 right-3 w-10 h-10 rounded-full btn-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">{dish.name[lang]}</h3>
                      {lang !== "da" && <span className="text-muted-foreground text-xs font-body" dir="rtl">{dish.nameDari}</span>}
                    </div>
                    <span className="text-gold-gradient font-display font-bold text-lg">€{dish.price.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs font-body">
                      <Clock className="w-3 h-3" />
                      {dish.prepTime}
                    </div>
                    {dish.tags.map((tag) => (
                      <span key={tag} className={`text-xs font-body px-2 py-0.5 rounded-full ${tag === "Vegan" ? "bg-accent/10 text-accent-foreground border border-accent/20" : "bg-muted text-muted-foreground"}`}>
                        {tag === "Vegan" && <Leaf className="w-3 h-3 inline mr-0.5 -mt-0.5" />}
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 text-center">
          <Link to="/menu" className="btn-lapis px-8 py-3 rounded-xl font-body text-sm inline-block">{t("quick.viewMenu")}</Link>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickOrderSection;
