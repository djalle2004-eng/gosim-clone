import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import PopularDestinations from '../components/home/PopularDestinations';
import BestSellers from '../components/home/BestSellers';
import FeaturesGrid from '../components/home/FeaturesGrid';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import AppDownload from '../components/home/AppDownload';
import Footer from '../components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
        <PopularDestinations />
        <BestSellers />
        <FeaturesGrid />
        <Testimonials />
        <FAQ />
        <AppDownload />
      </main>

      <Footer />
    </div>
  );
}
