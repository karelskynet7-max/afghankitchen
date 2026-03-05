import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { I18nProvider } from "@/hooks/useI18n";
import { CartProvider } from "@/hooks/useCart";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RamadanBanner from "@/components/RamadanBanner";
import FeaturesStrip from "@/components/FeaturesStrip";
import QuickOrderSection from "@/components/QuickOrderSection";
import CateringSection from "@/components/CateringSection";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <CartSidebar />
          <HeroSection />
          <RamadanBanner />
          <FeaturesStrip />
          <QuickOrderSection />
          <CateringSection />
          <Footer />
        </div>
      </CartProvider>
    </I18nProvider>
  );
};

export default Index;
