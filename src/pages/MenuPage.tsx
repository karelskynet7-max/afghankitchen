import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame, Leaf, Clock, Search, Filter, X } from "lucide-react";
import { useI18n, I18nProvider } from "@/hooks/useI18n";
import { useCart, CartProvider } from "@/hooks/useCart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import kabuliImg from "@/assets/kabuli-pulao.jpg";
import mantuImg from "@/assets/mantu.jpg";
import bolaniImg from "@/assets/bolani.jpg";
import heroKebab from "@/assets/hero-kebab.jpg";

interface MenuItem {
  id: number;
  name: { nl: string; en: string; da: string };
  nameDari: string;
  desc: { nl: string; en: string; da: string };
  price: number;
  image: string;
  category: string;
  tags: string[];
  prepTime: string;
  popular?: boolean;
  spiceLevel?: number;
}

const menuItems: MenuItem[] = [
  { id: 1, name: { nl: "Kabuli Pulao", en: "Kabuli Pulao", da: "قابلی پلو" }, nameDari: "قابلی پلو", desc: { nl: "Lamsvlees met rijst, rozijnen en wortels", en: "Lamb with rice, raisins and carrots", da: "گوشت بره با برنج، کشمش و زردک" }, price: 16.95, image: kabuliImg, category: "rice", tags: ["Halal", "Gluten-Free"], prepTime: "25 min", popular: true, spiceLevel: 1 },
  { id: 2, name: { nl: "Mantu", en: "Mantu", da: "منتو" }, nameDari: "منتو", desc: { nl: "Gestoomde dumplings met lam en yoghurt", en: "Steamed dumplings with lamb and yogurt", da: "دمپخت با گوشت بره و ماست" }, price: 14.50, image: mantuImg, category: "appetizers", tags: ["Halal"], prepTime: "20 min", popular: true, spiceLevel: 2 },
  { id: 3, name: { nl: "Bolani", en: "Bolani", da: "بولانی" }, nameDari: "بولانی", desc: { nl: "Gevulde platbrood met aardappel", en: "Stuffed flatbread with potato", da: "نان پر شده با کچالو" }, price: 9.95, image: bolaniImg, category: "appetizers", tags: ["Vegan"], prepTime: "15 min", spiceLevel: 0 },
  { id: 4, name: { nl: "Chapli Kebab", en: "Chapli Kebab", da: "کباب چپلی" }, nameDari: "کباب چپلی", desc: { nl: "Gekruide rundergehakt kebab", en: "Spiced minced beef kebab", da: "کباب گوشت بره ادویه‌دار" }, price: 15.50, image: heroKebab, category: "kebabs", tags: ["Halal"], prepTime: "20 min", popular: true, spiceLevel: 3 },
  { id: 5, name: { nl: "Tikka Kebab", en: "Tikka Kebab", da: "کباب تکه" }, nameDari: "کباب تکه", desc: { nl: "Gemarineerde kiplappen op de grill", en: "Marinated chicken pieces on the grill", da: "تکه‌های مرغ ماریناد شده روی گریل" }, price: 14.95, image: heroKebab, category: "kebabs", tags: ["Halal", "Gluten-Free"], prepTime: "18 min", spiceLevel: 2 },
  { id: 6, name: { nl: "Qabili Palau Murgh", en: "Chicken Qabili Palau", da: "قابلی پلو مرغ" }, nameDari: "قابلی پلو مرغ", desc: { nl: "Kip met geurige rijst en rozijnen", en: "Chicken with fragrant rice and raisins", da: "مرغ با برنج خوشبو و کشمش" }, price: 15.50, image: kabuliImg, category: "rice", tags: ["Halal", "Gluten-Free"], prepTime: "25 min", spiceLevel: 1 },
  { id: 7, name: { nl: "Aushak", en: "Aushak", da: "آشک" }, nameDari: "آشک", desc: { nl: "Dumplings met prei en yoghurtsaus", en: "Leek dumplings with yogurt sauce", da: "آشک با تره و ماست" }, price: 13.50, image: mantuImg, category: "appetizers", tags: ["Halal"], prepTime: "22 min", spiceLevel: 1 },
  { id: 8, name: { nl: "Afghaanse Groene Thee", en: "Afghan Green Tea", da: "چای سبز" }, nameDari: "چای سبز", desc: { nl: "Traditionele groene thee met kardemom", en: "Traditional green tea with cardamom", da: "چای سبز سنتی با هل" }, price: 3.50, image: bolaniImg, category: "drinks", tags: ["Vegan", "Gluten-Free"], prepTime: "5 min", spiceLevel: 0 },
];

const categories = [
  { key: "all", label: { nl: "Alles", en: "All", da: "همه" } },
  { key: "kebabs", label: { nl: "Kebabs", en: "Kebabs", da: "کباب‌ها" } },
  { key: "rice", label: { nl: "Rijst", en: "Rice Dishes", da: "غذاهای برنجی" } },
  { key: "appetizers", label: { nl: "Voorgerechten", en: "Appetizers", da: "پیش‌غذا" } },
  { key: "drinks", label: { nl: "Dranken", en: "Drinks", da: "نوشیدنی‌ها" } },
];

const filters = ["Halal", "Vegan", "Gluten-Free"];

const MenuPageInner = () => {
  const { t, lang, dir } = useI18n();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]);
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) return false;
      if (activeFilters.length > 0 && !activeFilters.every((f) => item.tags.includes(f))) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return item.name[lang].toLowerCase().includes(q) || item.nameDari.includes(q);
      }
      return true;
    });
  }, [activeCategory, activeFilters, searchQuery, lang]);

  const handleAdd = (item: MenuItem) => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Navbar />
      <CartSidebar />

      {/* Header */}
      <section className="pt-24 md:pt-32 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-lapis-gradient font-body text-sm font-semibold uppercase tracking-[0.2em] mb-2 block">{t("menu.label")}</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">{t("menu.title")}</h1>
            <p className="text-muted-foreground font-body max-w-lg">{t("menu.desc")}</p>
          </motion.div>

          {/* Search + Filters */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("menu.search")}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={`px-3 py-1.5 rounded-full font-body text-xs font-medium border transition-all ${
                    activeFilters.includes(filter)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {filter === "Vegan" && <Leaf className="w-3 h-3 inline mr-1 -mt-0.5" />}
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2 rounded-full font-body text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.key
                    ? "btn-gold"
                    : "glass-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label[lang]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + activeFilters.join(",") + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="glass-card-hover rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={item.image} alt={item.name.en} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {item.popular && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 badge-saffron rounded-full px-3 py-1 text-xs font-body font-medium">
                        <Flame className="w-3 h-3" />
                        {t("quick.popular")}
                      </div>
                    )}
                    {item.spiceLevel !== undefined && item.spiceLevel > 0 && (
                      <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-background/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-body">
                        {Array.from({ length: item.spiceLevel }).map((_, si) => (
                          <span key={si}>🌶️</span>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => handleAdd(item)}
                      className="absolute bottom-3 right-3 w-10 h-10 rounded-full btn-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-display text-base font-semibold text-foreground">{item.name[lang]}</h3>
                        {lang !== "da" && <span className="text-muted-foreground text-xs font-body" dir="rtl">{item.nameDari}</span>}
                      </div>
                      <span className="text-gold-gradient font-display font-bold text-base">€{item.price.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <p className="text-muted-foreground text-xs font-body mt-1 line-clamp-2">{item.desc[lang]}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1 text-muted-foreground text-xs font-body">
                        <Clock className="w-3 h-3" />
                        {item.prepTime}
                      </div>
                      {item.tags.map((tag) => (
                        <span key={tag} className={`text-xs font-body px-2 py-0.5 rounded-full ${tag === "Vegan" ? "bg-accent/10 text-accent-foreground border border-accent/20" : "bg-muted text-muted-foreground"}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-body text-lg">{t("menu.noResults")}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

const MenuPage = () => (
  <I18nProvider>
    <CartProvider>
      <MenuPageInner />
    </CartProvider>
  </I18nProvider>
);

export default MenuPage;
