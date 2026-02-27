import { I18nProvider } from "@/hooks/useI18n";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesStrip from "@/components/FeaturesStrip";
import QuickOrderSection from "@/components/QuickOrderSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <FeaturesStrip />
        <QuickOrderSection />
        <Footer />
      </div>
    </I18nProvider>
  );
};

export default Index;
