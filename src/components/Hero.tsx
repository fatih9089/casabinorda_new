import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section id="home" className="pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden relative">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Desktop background */}
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat w-full h-full hidden md:block"
          style={{ 
            backgroundImage: 'url("/images/backgrounds/diverse-people.webp")',
            backgroundSize: '100%',
            backgroundPosition: 'center 10%',
            filter: 'blur(0px)',
            transform: 'scale(1.01)',
          }}
        />
        {/* Mobile background */}
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat w-full h-full block md:hidden"
          style={{ 
            backgroundImage: 'url("/images/backgrounds/diverse-people2.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(0px)',
            transform: 'scale(1.01)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-white/40" />
      </div>

      <div className="container-tight relative z-10">
        {/* Background decorative element */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center py-2 max-w-3xl mx-auto relative z-10 -mt-4"
        >
          {/* Negatif margin-top değerini azalttım */}
          
          <motion.div variants={itemVariants} className="mb-4">
            <span className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
              Wholesale Medicine Supply
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 leading-tight text-gray-900"
          >
            Reliable and professional <span className="text-primary">medicine supply</span>
          </motion.h1>
          
          {/* Başlık ile butonlar arasına boşluk ekledim */}
          <div className="h-16"></div>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.a
              href="/#search"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium inline-flex items-center justify-center gap-2 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 transition-all"
              variants={itemVariants}
            >
              Search Medicine
              <ArrowRight size={16} />
            </motion.a>
            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white border border-primary/20 text-primary rounded-lg font-medium inline-flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
              variants={itemVariants}
            >
              Contact Us
            </motion.a>
          </motion.div>
          
          {/* Butonların altına boşluk ekledim */}
          <div className="h-16"></div>
        </motion.div>
      </div>
      
      {/* Dalga dekorasyonunu kaldırdım */}
    </section>
  );
};

export default Hero;
