
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5 text-primary" />,
      title: "Telefon",
      value: "+90 (212) 123 45 67"
    },
    {
      icon: <Mail className="w-5 h-5 text-primary" />,
      title: "E-posta",
      value: "info@casbinorda.com"
    },
    {
      icon: <MapPin className="w-5 h-5 text-primary" />,
      title: "Adres",
      value: "İstanbul, Türkiye"
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-primary" />,
      title: "WhatsApp",
      value: "+90 (532) 123 45 67"
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
    <section id="contact" className="py-16 md:py-24 bg-secondary/50">
      <div className="container-tight">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary mb-4"
          >
            İletişim
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Bize Ulaşın
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-foreground/70"
          >
            İhtiyaçlarınız ve talepleriniz için bizimle iletişime geçebilirsiniz.
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div 
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-2xl font-bold mb-6"
            >
              İletişim Bilgilerimiz
            </motion.h3>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="flex items-start"
                >
                  <div className="p-2 rounded-full bg-primary/10 mr-4">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{info.title}</p>
                    <p className="font-medium">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              variants={itemVariants}
              className="mt-10"
            >
              <h4 className="text-lg font-semibold mb-3">Çalışma Saatleri</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Pazartesi - Cuma</span>
                  <span>09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cumartesi</span>
                  <span>09:00 - 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pazar</span>
                  <span>Kapalı</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
          >
            <h3 className="text-2xl font-bold mb-6">Mesaj Gönderin</h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">İsim</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="İsminiz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Soyisim</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Soyisminiz"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">E-posta</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="E-posta adresiniz"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Telefon</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Telefon numaranız"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Mesajınız</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Mesajınızı yazın..."
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:shadow-md hover:shadow-primary/20 transition-all"
              >
                Mesaj Gönder
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
