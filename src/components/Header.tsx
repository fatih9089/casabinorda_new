import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  isTransparent?: boolean;
}

const Header = ({ isTransparent = false }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle scroll effect with IntersectionObserver
  useEffect(() => {
    // Sayfa başlangıcını izlemek için bir sentinel element oluştur
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    sentinel.style.left = '0';
    sentinel.style.height = '10px';
    sentinel.style.width = '100%';
    sentinel.style.pointerEvents = 'none';
    sentinel.style.opacity = '0';
    document.body.prepend(sentinel);

    // Intersection Observer oluştur
    const observer = new IntersectionObserver(
      ([entry]) => {
        // entry.isIntersecting true ise, sayfa en üstte demektir
        setIsScrolled(!entry.isIntersecting);
      },
      {
        // Eşik değeri: 0 = tamamen görünmez olduğunda tetikle
        threshold: 0,
        // Root margin: üst kısımda 10px'lik bir alan izle
        rootMargin: '-10px 0px 0px 0px'
      }
    );

    // Sentinel elementi izlemeye başla
    observer.observe(sentinel);

    // Temizleme fonksiyonu
    return () => {
      observer.disconnect();
      if (document.body.contains(sentinel)) {
        document.body.removeChild(sentinel);
      }
    };
  }, []);

  // Sayfa en yukarı kaydırıldığında gizli bölümleri gizleyen yeni useEffect
  useEffect(() => {
    // Eğer sayfa en üstteyse (isScrolled false ise) ve mobil görünümdeyse
    if (!isScrolled && window.innerWidth < 768) {
      // Gizlenmesi gereken bölümleri bul ve gizle
      const hiddenSections = ['about', 'how-it-works', 'legal-framework'];
      hiddenSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.classList.add('hidden');
          section.classList.remove('block');
        }
      });
    }
  }, [isScrolled]); // isScrolled değiştiğinde çalışacak

  const headerClass = `fixed top-0 w-full z-50 transition-all duration-300 ${
    isScrolled ? 'py-3 bg-white/50 backdrop-blur-lg shadow-md' : 'py-5 bg-transparent'
  }`;

  const logoVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: custom => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        delay: custom * 0.1 
      }
    })
  };

  const navItems = [
    { name: 'Home', href: '/#home', isPageLink: true, isAnchor: true },
    { name: 'About Us', href: '/#about', isPageLink: true, isAnchor: true },
    { name: 'Search', href: '/#search', isPageLink: true, isAnchor: true },
    { name: 'How It Works', href: '/#how-it-works', isPageLink: true, isAnchor: true },
    { name: 'Legal Framework', href: '/#legal-framework', isPageLink: true, isAnchor: true },
    { name: 'Contact', href: '/#contact', isPageLink: true, isAnchor: true }
  ];

  // Function to handle smooth scrolling for anchor links
  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    
    // If we're not on the home page, navigate to home page first
    if (location.pathname !== '/') {
      window.location.href = href;
      return;
    }
    
    // Extract the anchor part
    const anchor = href.split('#')[1];
    
    // If there's no anchor or it's just the home page, scroll to top
    if (!anchor) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // For mobile view, make the section visible if it's one of the hidden sections
    if (window.innerWidth < 768) {
      const hiddenSections = ['about', 'how-it-works', 'legal-framework'];
      if (hiddenSections.includes(anchor)) {
        const section = document.getElementById(anchor);
        if (section) {
          // Remove hidden class and add block class
          section.classList.remove('hidden');
          section.classList.add('block');
        }
      }
    }
    
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header ref={headerRef} className={headerClass}>
      <div className="container-tight flex items-center justify-between">
        <motion.div 
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          className="flex-shrink-0"
        >
          <div 
            className="font-display font-bold text-2xl"
          >
            <span className="text-primary">CASA</span>
            <span className="text-foreground">BINORDA</span>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              custom={index}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
            >
              {item.isAnchor ? (
                <a
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  to={item.href}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </Link>
              )}
            </motion.div>
          ))}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-primary" />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white w-full shadow-lg"
        >
          <div className="container-tight py-4 flex flex-col space-y-4">
            {navItems.map((item, index) => (
              item.isAnchor ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    handleAnchorClick(e, item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-foreground/80 hover:text-primary py-2 transition-colors font-medium"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground/80 hover:text-primary py-2 transition-colors font-medium"
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
