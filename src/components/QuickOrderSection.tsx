import { motion } from "framer-motion";
import { Plus, Flame, Leaf, Clock } from "lucide-react";
import kabuliImg from "@/assets/kabuli-pulao.jpg";
import mantuImg from "@/assets/mantu.jpg";
import bolaniImg from "@/assets/bolani.jpg";

interface Dish {
  id: number;
  name: string;
  nameDari: string;
  price: string;
  image: string;
  tags: string[];
  prepTime: string;
  popular?: boolean;
}

const dishes: Dish[] = [
  {
    id: 1,
    name: "Kabuli Pulao",
    nameDari: "قابلی پلو",
    price: "€16,95",
    image: kabuliImg,
    tags: ["Halal", "Gluten-Free"],
    prepTime: "25 min",
    popular: true,
  },
  {
    id: 2,
    name: "Mantu",
    nameDari: "منتو",
    price: "€14,50",
    image: mantuImg,
    tags: ["Halal"],
    prepTime: "20 min",
  },
  {
    id: 3,
    name: "Bolani",
    nameDari: "بولانی",
    price: "€9,95",
    image: bolaniImg,
    tags: ["Vegan"],
    prepTime: "15 min",
  },
];

const DishCard = ({ dish, index }: { dish: Dish; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="glass-card-hover rounded-2xl overflow-hidden group cursor-pointer"
  >
    {/* Image */}
    <div className="relative aspect-square overflow-hidden">
      <img
        src={dish.image}
        alt={dish.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {dish.popular && (
        <div className="absolute top-3 left-3 flex items-center gap-1 badge-saffron rounded-full px-3 py-1 text-xs font-body font-medium">
          <Flame className="w-3 h-3" />
          Populair
        </div>
      )}
      {/* Quick add */}
      <button className="absolute bottom-3 right-3 w-10 h-10 rounded-full btn-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <Plus className="w-5 h-5" />
      </button>
    </div>

    {/* Info */}
    <div className="p-4">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">{dish.name}</h3>
          <span className="text-muted-foreground text-xs font-body" dir="rtl">{dish.nameDari}</span>
        </div>
        <span className="text-gold-gradient font-display font-bold text-lg">{dish.price}</span>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <div className="flex items-center gap-1 text-muted-foreground text-xs font-body">
          <Clock className="w-3 h-3" />
          {dish.prepTime}
        </div>
        {dish.tags.map((tag) => (
          <span
            key={tag}
            className={`text-xs font-body px-2 py-0.5 rounded-full ${
              tag === "Vegan"
                ? "bg-accent/10 text-accent-foreground border border-accent/20"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {tag === "Vegan" && <Leaf className="w-3 h-3 inline mr-0.5 -mt-0.5" />}
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const QuickOrderSection = () => {
  return (
    <section id="menu" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-lapis-gradient font-body text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">
            Snel Bestellen
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Jouw Favorieten
          </h2>
          <p className="text-muted-foreground font-body max-w-md">
            Bestel opnieuw of ontdek onze meest geliefde Afghaanse gerechten, vers bereid met liefde.
          </p>
        </motion.div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish, i) => (
            <DishCard key={dish.id} dish={dish} index={i} />
          ))}
        </div>

        {/* View full menu */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <button className="btn-lapis px-8 py-3 rounded-xl font-body text-sm">
            Bekijk Volledige Menu →
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickOrderSection;
