import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Language = "nl" | "en" | "da";

interface Translations {
  [key: string]: { nl: string; en: string; da: string };
}

const translations: Translations = {
  // Navbar
  "nav.menu": { nl: "Menu", en: "Menu", da: "منو" },
  "nav.about": { nl: "Over Ons", en: "About Us", da: "درباره ما" },
  "nav.catering": { nl: "Catering", en: "Catering", da: "کترینگ" },

  // Hero
  "hero.badge": { nl: "#1 Afghan Cuisine in Nederland", en: "#1 Afghan Cuisine in the Netherlands", da: "#1 غذای افغانی در هالند" },
  "hero.title1": { nl: "Authentic Afghan", en: "Authentic Afghan", da: "غذای اصیل افغانی" },
  "hero.title2": { nl: "Flavours,", en: "Flavours,", da: "طعم‌ها،" },
  "hero.title3": { nl: "Delivered", en: "Delivered", da: "تحویل داده شده" },
  "hero.subtitle": {
    nl: "Van Amsterdam tot Den Haag — verse kebabs, mantu & kabuli pulao bij jou thuis binnen 35 minuten.",
    en: "From Amsterdam to The Hague — fresh kebabs, mantu & kabuli pulao delivered to your door in 35 minutes.",
    da: "از آمستردام تا دن هاخ — کباب تازه، منتو و قابلی پلو در ۳۵ دقیقه به درب خانه شما.",
  },
  "hero.order": { nl: "Bestel Nu", en: "Order Now", da: "سفارش بدهید" },
  "hero.delivery": { nl: "Bezorgtijd: ~35 min", en: "Delivery: ~35 min", da: "زمان تحویل: ~۳۵ دقیقه" },
  "hero.reviews": { nl: "2.500+ beoordelingen", en: "2,500+ reviews", da: "+۲٬۵۰۰ نظر" },
  "hero.halal": { nl: "100% Halal", en: "100% Halal", da: "۱۰۰٪ حلال" },

  // Features
  "feat.delivery": { nl: "35 min bezorging", en: "35 min delivery", da: "تحویل در ۳۵ دقیقه" },
  "feat.payment": { nl: "iDEAL & Apple Pay", en: "iDEAL & Apple Pay", da: "iDEAL و Apple Pay" },
  "feat.halal": { nl: "100% Halal", en: "100% Halal", da: "۱۰۰٪ حلال" },
  "feat.bike": { nl: "Fietskoeriers", en: "Bike Couriers", da: "پیک دوچرخه" },

  // Quick Order
  "quick.label": { nl: "Snel Bestellen", en: "Quick Order", da: "سفارش سریع" },
  "quick.title": { nl: "Jouw Favorieten", en: "Your Favourites", da: "غذاهای محبوب شما" },
  "quick.desc": {
    nl: "Bestel opnieuw of ontdek onze meest geliefde Afghaanse gerechten, vers bereid met liefde.",
    en: "Reorder or discover our most loved Afghan dishes, freshly prepared with love.",
    da: "دوباره سفارش بدهید یا غذاهای محبوب افغانی ما را کشف کنید، تازه و با عشق تهیه شده.",
  },
  "quick.viewMenu": { nl: "Bekijk Volledige Menu →", en: "View Full Menu →", da: "مشاهده منوی کامل ←" },
  "quick.popular": { nl: "Populair", en: "Popular", da: "محبوب" },

  // Footer
  "footer.rights": { nl: "Alle rechten voorbehouden.", en: "All rights reserved.", da: "تمامی حقوق محفوظ است." },
};

const languageNames: Record<Language, string> = {
  nl: "NL",
  en: "EN",
  da: "دری",
};

interface I18nContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  languages: typeof languageNames;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>("nl");

  const t = useCallback(
    (key: string) => translations[key]?.[lang] ?? key,
    [lang]
  );

  const dir = lang === "da" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir, languages: languageNames }}>
      {children}
    </I18nContext.Provider>
  );
};
