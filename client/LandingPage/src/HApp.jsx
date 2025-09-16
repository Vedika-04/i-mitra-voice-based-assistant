import { useEffect } from "react";
import "./index.css";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturesSection from "./components/FeaturesSection";
import PurposeSection from "./components/PurposeSection";
import DepartmentsSection from "./components/DepartmentsSection";
import Services from "./components/Services";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ChatBot from "./components/layout/ChatBot1";
// Analytics hooks and utils
import useScrollTracking from "./utils/useScrollTracking";
import useTimeTracking from "./utils/useTimeTracking";
import { trackPageView } from "./utils/analytics";

function HPage() {
  // Initialize analytics tracking hooks
  useScrollTracking();
  useTimeTracking();

  // Track page view
  useEffect(() => {
    trackPageView("Home");
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden scroll-smooth">
      {/* Background Gradient Blob */}
      <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>

      <div className="overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Sections */}
        <section id="home">
          <Hero />
          <ChatBot />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="file">
          <FeaturesSection />
        </section>
        <section id="about">
          <PurposeSection />
        </section>
        <section id="department">
          <DepartmentsSection />
        </section>

        {/* Footer and Scroll Button */}
        <Footer />
        <ScrollToTop />
      </div>
    </main>
  );
}

export default HPage;
