import './HomePage.css';

import Navbar from '../components/common/Navbar';
import Hero from '../components/sections/Hero';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { DestinationsSection } from '../components/sections/DestinationsSection';
import { ChatPreviewSection } from '../components/sections/ChatPreview';
import { TestimonialsSection } from '../components/sections/Testimonials';
import { NewsletterSection } from '../components/sections/Newsletter';
import { Footer } from '../components/common/Footer';

export const HomePage = () => {
  return (
    <div className="home-page">

      {/* Background Effects */}
      <div className="background-wrapper">
        <div className="bg-circle blue" />
        <div className="bg-circle purple" />
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        <Navbar />
        <Hero />
        <FeaturesSection />
        <DestinationsSection />
        <ChatPreviewSection />
        <TestimonialsSection />
        <NewsletterSection />
        <Footer />
      </div>

    </div>
  );
};