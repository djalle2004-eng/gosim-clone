import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { HeroSection } from './components/HeroSection';
import { SearchFilterSection } from './components/SearchFilterSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FeaturedPlansSection } from './components/FeaturedPlansSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PricingSection } from './components/PricingSection';
import { TrustBadges } from './components/TrustBadges';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans" dir="rtl">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <SearchFilterSection />
        <HowItWorksSection />
        <FeaturedPlansSection />
        <TestimonialsSection />
        <PricingSection />
        <TrustBadges />
      </main>

      <Footer />
    </div>
  );
}
