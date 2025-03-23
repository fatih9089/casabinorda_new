import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, TrendingUp, Heart, Users, MapPin, Package, Calendar, Phone, Mail } from 'lucide-react';

const About = () => {
  const ref = useRef(null);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const storyRef = useRef(null);
  const statsRef = useRef(null);
  
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const isAboutInView = useInView(aboutRef, { once: true, amount: 0.3 });
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const isStoryInView = useInView(storyRef, { once: true, amount: 0.3 });
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });
  
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Reliable Supply",
      description: "All our medicines are supplied in accordance with legal regulations."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Wide Product Range",
      description: "We are at your service with our portfolio of 2500+ medicines and active ingredients."
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Quality Focused",
      description: "We work meticulously on proper storage and distribution of medicines."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Professional Team",
      description: "We provide fast and effective solutions to your needs with our expert staff."
    }
  ];
  
  const stats = [
    {
      icon: <Package className="w-8 h-8 text-primary" />,
      value: "2500+",
      label: "Medicines in Our Portfolio"
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      value: "25+",
      label: "Countries We Export To"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      value: "5000+",
      label: "Satisfied Customers"
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      value: "15+",
      label: "Years of Experience"
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-secondary/50">
      <div className="container-tight">
        {/* Introduction Section */}
        <div className="text-center max-w-3xl mx-auto mb-16" ref={aboutRef}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary mb-4"
          >
            About Us
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            What is CASABINORDA?
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-foreground/80 mb-8 max-w-3xl mx-auto text-center"
          >
            <p className="mb-4 text-lg">
              CASABINORDA is a leading pharmaceutical supplier dedicated to providing high-quality medicines to healthcare facilities, pharmacies, and patients worldwide. We specialize in sourcing and distributing a comprehensive range of pharmaceutical products, ensuring reliable access to essential medications.
            </p>
            <p className="text-lg">
              Our mission is to improve global health outcomes by delivering premium pharmaceutical products with integrity, reliability, and exceptional service. We maintain the highest standards of quality and compliance while fostering strong relationships with our partners and customers.
            </p>
          </motion.div>
        </div>
        
        {/* Our Values Section */}
        <motion.div 
          ref={featuresRef}
          variants={containerVariants}
          initial="hidden"
          animate={isFeaturesInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              custom={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 mb-6 rounded-full flex items-center justify-center bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Our Story Section */}
        <div 
          ref={storyRef}
          className="py-16 px-4 md:px-8 bg-gray-50 text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isStoryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary mb-4"
          >
            Our Story
          </motion.span>
            
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isStoryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            How It All Started
          </motion.h2>
            
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isStoryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-lg text-foreground/70 mb-6">
              CASABINORDA was founded in 2010 by a team of pharmaceutical experts with a shared vision: to bridge the gap in global medicine supply chains and ensure that quality healthcare products reach those who need them most.
            </p>
              
            <div className="space-y-6 text-lg">
              <p>
                What began as a small operation has grown into a trusted international supplier with a presence in over 25 countries. Our journey has been guided by unwavering principles of quality, integrity, and customer focus.
              </p>
                
              <p>
                Our founders recognized early on that reliable access to medicines is fundamental to healthcare systems globally. This insight has driven our expansion into diverse pharmaceutical categories and markets.
              </p>
                
              <p>
                Throughout our growth, we've maintained our founding commitment to ethical business practices and regulatory compliance, earning the trust of healthcare providers, pharmacies, and patients worldwide.
              </p>
                
              <p>
                Today, CASABINORDA continues to innovate in pharmaceutical supply chain management, leveraging technology and expertise to overcome distribution challenges and improve healthcare outcomes globally.
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Stats Section */}
        <div className="mb-24 py-12 bg-primary/5 rounded-2xl" ref={statsRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <span className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
              Our Impact
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">CASABINORDA in Numbers</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-white shadow-sm">
                  {stat.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-2 text-primary">{stat.value}</h3>
                <p className="text-foreground/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
