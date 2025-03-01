
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, TrendingUp, Heart, Users } from 'lucide-react';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Güvenilir Tedarik",
      description: "Tüm ilaçlarımız, yasal mevzuata uygun olarak tedarik edilmektedir."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Geniş Ürün Yelpazesi",
      description: "2500+ çeşit ilaç ve etkin madde portföyümüz ile hizmetinizdeyiz."
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Kalite Odaklı",
      description: "İlaçların uygun şartlarda depolanması ve dağıtımı konusunda titizlikle çalışıyoruz."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Profesyonel Ekip",
      description: "Uzman kadromuz ile ihtiyaçlarınıza hızlı ve etkili çözümler sunuyoruz."
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
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary mb-4"
          >
            Hakkımızda
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            CASBINORDA Nedir?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-foreground/70"
          >
            CASBINORDA, sağlık sektörünün güvenilir toptan ilaç tedarikçisidir. Geniş ürün yelpazemiz, profesyonel hizmet anlayışımız ve müşteri odaklı yaklaşımımızla sektörde öncü konumdayız.
          </motion.p>
        </div>
        
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
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
      </div>
    </section>
  );
};

export default About;
