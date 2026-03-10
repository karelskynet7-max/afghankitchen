import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Flame, Star, ShoppingBag } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useCart } from "@/hooks/useCart";

const SpecialOfTheDay = () => {
  const { lang, dir } = useI18n();
  const { data: menuItems } = useMenuItems();
  const { addItem } = useCart();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [added, setAdded] = useState(false);

  // Pick a "special" item based on the day of the week
  const specialItem = menuItems?.filter((i) => i.popular)?.[new Date().getDay() % (menuItems?.filter((i) => i.popular)?.length || 1)];

  useEffect(() => {
    const calcTime = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };
    setTimeLeft(calcTime());
    const timer = setInterval(() => setTimeLeft(calcTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const labels = {
    title: { nl: "Speciaal van de Dag", en: "Special of the Day", da: "ویژه امروز" },
    subtitle: { nl: "Tijdelijke aanbieding – 15% korting!", en: "Limited time offer – 15% off!", da: "!پیشنهاد محدود – ۱۵٪ تخفیف" },
    addBtn: { nl: "Bestel Nu", en: "Order Now", da: "همین الان سفارش بده" },
    added: { nl: "Toegevoegd! ✓", en: "Added! ✓", da: "!✓ اضافه شد" },
    endsIn: { nl: "Verloopt over", en: "Ends in", da: "پایان در" },
  };

  if (!specialItem) return null;

  const discountedPrice = (specialItem.price * 0.85).toFixed(2);

  const handleAdd = () => {
    addItem({
      id: specialItem.id,
      name: specialItem.name,
      price: Number(discountedPrice),
      image: specialItem.image,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="py-16 md:py-20" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-primary/20"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Content */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 badge-saffron rounded-full px-4 py-1.5 text-xs font-body font-semibold mb-4 w-fit">
                <Flame className="w-3.5 h-3.5" />
                {labels.title[lang]}
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                {specialItem.name[lang]}
              </h2>
              {specialItem.nameDari && (
                <p className="font-body text-lg text-muted-foreground mb-4" dir="rtl">
                  {specialItem.nameDari}
                </p>
              )}
              <p className="font-body text-foreground/70 leading-relaxed mb-6">
                {specialItem.desc[lang]}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-display text-3xl font-bold text-gold-gradient">
                  €{discountedPrice.replace(".", ",")}
                </span>
                <span className="font-body text-lg text-muted-foreground line-through">
                  €{specialItem.price.toFixed(2).replace(".", ",")}
                </span>
                <span className="badge-saffron rounded-full px-2.5 py-0.5 text-xs font-body font-bold">
                  -15%
                </span>
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-body text-sm text-muted-foreground">{labels.endsIn[lang]}</span>
                <div className="flex gap-1.5">
                  {[
                    { val: timeLeft.hours, label: "h" },
                    { val: timeLeft.minutes, label: "m" },
                    { val: timeLeft.seconds, label: "s" },
                  ].map(({ val, label }) => (
                    <div key={label} className="bg-background/80 border border-border rounded-lg px-2.5 py-1 text-center min-w-[3rem]">
                      <span className="font-display text-lg font-bold text-foreground">{String(val).padStart(2, "0")}</span>
                      <span className="font-body text-xs text-muted-foreground ml-0.5">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={added}
                className="btn-gold px-8 py-3.5 rounded-xl font-body text-sm font-semibold flex items-center gap-2 w-fit disabled:opacity-70 transition-all"
              >
                {added ? labels.added[lang] : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {labels.addBtn[lang]}
                  </>
                )}
              </button>
            </div>

            {/* Image */}
            <div className="relative flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, rotate: -3 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-2xl scale-110" />
                <img
                  src={specialItem.image}
                  alt={specialItem.name[lang]}
                  className="relative w-full max-w-sm rounded-2xl shadow-2xl object-cover aspect-square"
                />
                {/* Rating badge */}
                <div className="absolute -top-3 -right-3 glass-card rounded-xl border border-border px-3 py-2 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-display font-bold text-sm text-foreground">4.9</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialOfTheDay;
