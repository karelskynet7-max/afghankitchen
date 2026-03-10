import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const testimonials = [
  {
    name: "Sophie de Vries",
    location: { nl: "Amsterdam", en: "Amsterdam", da: "آمستردام" },
    rating: 5,
    text: {
      nl: "Het lekkerste Afghaanse eten dat ik ooit heb gehad! De Kabuli Pulao is een meesterwerk. Binnen 30 minuten bezorgd, nog warm en vers.",
      en: "The best Afghan food I've ever had! The Kabuli Pulao is a masterpiece. Delivered within 30 minutes, still hot and fresh.",
      da: "بهترین غذای افغانی که تا حالا خوردم! قابلی پلو یک شاهکار است. در عرض ۳۰ دقیقه تحویل داده شد، هنوز گرم و تازه.",
    },
    avatar: "S",
  },
  {
    name: "Mohammed Al-Rashid",
    location: { nl: "Den Haag", en: "The Hague", da: "لاهه" },
    rating: 5,
    text: {
      nl: "Eindelijk een restaurant dat authentiek Afghaans eten maakt. De mantu smaakt precies zoals mijn oma het maakte. Aanrader!",
      en: "Finally a restaurant that makes authentic Afghan food. The mantu tastes exactly like my grandmother used to make. Highly recommended!",
      da: "بالاخره رستورانی که غذای اصیل افغانی می‌سازد. منتو دقیقاً مثل مادربزرگم مزه می‌دهد. شدیداً توصیه می‌شود!",
    },
    avatar: "M",
  },
  {
    name: "Emma Jansen",
    location: { nl: "Rotterdam", en: "Rotterdam", da: "روتردام" },
    rating: 5,
    text: {
      nl: "Perfect voor onze catering! 150 gasten en iedereen was onder de indruk. Professionele service en ongelooflijk eten.",
      en: "Perfect for our catering! 150 guests and everyone was impressed. Professional service and incredible food.",
      da: "عالی برای کیترینگ ما! ۱۵۰ مهمان و همه تحت تأثیر قرار گرفتند. خدمات حرفه‌ای و غذای باورنکردنی.",
    },
    avatar: "E",
  },
  {
    name: "Daan Bakker",
    location: { nl: "Utrecht", en: "Utrecht", da: "اوترخت" },
    rating: 5,
    text: {
      nl: "De chapli kebab is verslavend! Ik bestel nu elke week. De kwaliteit is altijd consistent en de bezorging is supersnel.",
      en: "The chapli kebab is addictive! I order every week now. Quality is always consistent and delivery is super fast.",
      da: "چپلی کباب اعتیادآور است! حالا هر هفته سفارش می‌دهم. کیفیت همیشه ثابت و تحویل فوق‌العاده سریع است.",
    },
    avatar: "D",
  },
];

const sectionLabels = {
  title: { nl: "Wat onze klanten zeggen", en: "What Our Customers Say", da: "مشتریان ما چه می‌گویند" },
  subtitle: { nl: "Beoordeeld met ⭐ 4.9 door honderden tevreden klanten", en: "Rated ⭐ 4.9 by hundreds of happy customers", da: "با ⭐ ۴.۹ توسط صدها مشتری خوشحال ارزیابی شده" },
};

const TestimonialsSection = () => {
  const { lang, dir } = useI18n();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden" dir={dir}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            {sectionLabels.title[lang]}
          </h2>
          <p className="font-body text-muted-foreground">{sectionLabels.subtitle[lang]}</p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl border border-border p-8 md:p-10"
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="font-body text-foreground/90 text-lg md:text-xl leading-relaxed mb-6">
                "{testimonials[current].text[lang]}"
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-display font-bold text-primary text-sm">
                    {testimonials[current].avatar}
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">
                      {testimonials[current].name}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {testimonials[current].location[lang]}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(testimonials[current].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="p-2 rounded-full border border-border hover:border-primary/30 transition-colors">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-primary w-6" : "bg-border hover:bg-primary/30"
                  }`}
                />
              ))}
            </div>
            <button onClick={next} className="p-2 rounded-full border border-border hover:border-primary/30 transition-colors">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
