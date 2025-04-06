import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import SearchSection from '../components/SearchSection';
import HowItWorksSection from '../components/HowItWorksSection';
import LegalFrameworkSection from '../components/LegalFrameworkSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  // Initialize animations visibility detection
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animated-element').forEach(element => {
      observer.observe(element);
    });

    return () => {
      document.querySelectorAll('.animated-element').forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen overflow-x-hidden"
    >
      <Helmet>
        <title>CASABINORDA | Global Pharmaceutical Export & NPP Solutions</title>
        <meta name="description" content="Casabinorda is a trusted Turkish pharmaceutical exporter, providing Named Patient Program (NPP) and wholesale medicine supply to Latin America, Africa, MENA, and Central America." />
        <meta name="keywords" content="pharmaceutical export, Turkish medicine exporter, named patient program, NPP medicines, wholesale pharma, Latin America, Africa, MENA, Central America, global medicine supply" />
        <link rel="canonical" href="https://casabinorda.org" />
        {/* Open Graph meta tags for social sharing */}
        <meta property="og:title" content="CASABINORDA | Global Pharmaceutical Export & NPP Solutions" />
        <meta property="og:description" content="Casabinorda is a trusted Turkish pharmaceutical exporter, providing Named Patient Program (NPP) and wholesale medicine supply to Latin America, Africa, MENA, and Central America." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://casabinorda.org" />
        <meta property="og:image" content="https://casabinorda.org/images/logo.png" />
      </Helmet>
      
      <Header />
      <Hero />
      
      {/* About section - hidden on mobile by default */}
      <section id="about" className="md:block hidden">
        <About />
      </section>
      
      <SearchSection />
      
      {/* How It Works section - hidden on mobile by default */}
      <section id="how-it-works" className="md:block hidden">
        <HowItWorksSection />
      </section>
      
      {/* Legal Framework section - hidden on mobile by default */}
      <section id="legal-framework" className="md:block hidden">
        <LegalFrameworkSection />
      </section>
      
      <Contact />
      <Footer />
    </motion.div>
  );
};

export default Index;
