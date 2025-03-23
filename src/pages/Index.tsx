import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import SearchSection from '../components/SearchSection';
import HowItWorksSection from '../components/HowItWorksSection';
import LegalFrameworkSection from '../components/LegalFrameworkSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { useEffect } from 'react';
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
        <title>Casabinorda | International Pharmacy Supplier</title>
        <meta name="description" content="Casabinorda is your trusted international pharmacy supplier. We provide high-quality medicines and healthcare products from around the world." />
        <meta name="keywords" content="pharmacy, international pharmacy, medicine supplier, healthcare products, buy medicine online" />
        <link rel="canonical" href="https://casabinorda.com" />
        {/* Open Graph meta tags for social sharing */}
        <meta property="og:title" content="Casabinorda | International Pharmacy Supplier" />
        <meta property="og:description" content="Casabinorda is your trusted international pharmacy supplier. We provide high-quality medicines and healthcare products from around the world." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://casabinorda.com" />
        <meta property="og:image" content="https://casabinorda.com/images/logo.png" />
      </Helmet>
      
      <Header />
      <Hero />
      <About />
      <SearchSection />
      <HowItWorksSection />
      <LegalFrameworkSection />
      <Contact />
      <Footer />
    </motion.div>
  );
};

export default Index;
