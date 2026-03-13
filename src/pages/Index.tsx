import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { I18nProvider } from "@/hooks/useI18n";
import { CartProvider } from "@/hooks/useCart";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LiveOrderCounter from "@/components/LiveOrderCounter";
import RamadanBanner from "@/components/RamadanBanner";
import FeaturesStrip from "@/components/FeaturesStrip";
import SpecialOfTheDay from "@/components/SpecialOfTheDay";
import QuickOrderSection from "@/components/QuickOrderSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import CateringSection from "@/components/CateringSection";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import FirstOrderPopup from "@/components/FirstOrderPopup";
import SocialProofToasts from "@/components/SocialProofToasts";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import SpinWheelPopup from "@/components/SpinWheelPopup";
import StickyMobileOrderButton from "@/components/StickyMobileOrderButton";

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
          <LiveOrderCounter />
          <RamadanBanner />
          <FeaturesStrip />
          <SpecialOfTheDay />
          <QuickOrderSection />
          <TestimonialsSection />
          <AboutSection />
          <CateringSection />
          <Footer />
          <FirstOrderPopup />
          <SocialProofToasts />
          <ExitIntentPopup />
        </div>
      </CartProvider>
    </I18nProvider>
  );
};

export default Index;
