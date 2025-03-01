
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Plus, ShoppingCart } from 'lucide-react';

// Mock data - in a real app, this would come from an API
const mockMedicines = [
  { id: 1, name: "Parol", activeIngredient: "Parasetamol", category: "Ağrı Kesici" },
  { id: 2, name: "Majezik", activeIngredient: "Flurbiprofen", category: "Ağrı Kesici" },
  { id: 3, name: "Augmentin", activeIngredient: "Amoksisilin", category: "Antibiyotik" },
  { id: 4, name: "Cipro", activeIngredient: "Siprofloksasin", category: "Antibiyotik" },
  { id: 5, name: "Xanax", activeIngredient: "Alprazolam", category: "Anksiyolitik" },
  { id: 6, name: "Prozac", activeIngredient: "Fluoksetin", category: "Antidepresan" },
  { id: 7, name: "Lipitor", activeIngredient: "Atorvastatin", category: "Kolesterol" },
  { id: 8, name: "Coumadin", activeIngredient: "Warfarin", category: "Antikoagülan" },
  { id: 9, name: "Ventolin", activeIngredient: "Salbutamol", category: "Bronkodilatatör" },
  { id: 10, name: "Nexium", activeIngredient: "Esomeprazol", category: "Proton Pompası İnhibitörü" },
];

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const searchRef = useRef(null);
  const isInView = useInView(searchRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = mockMedicines.filter(
        medicine => 
          medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          medicine.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const addToCart = (medicine) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const exists = prevItems.find(item => item.id === medicine.id);
      
      if (exists) {
        // Increment quantity if exists
        return prevItems.map(item => 
          item.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...medicine, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    } else {
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

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
    <section id="search" className="py-16 md:py-24">
      <div className="container-tight">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary mb-4"
          >
            İlaç Arama
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Toptan İlaç Kataloğu
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-foreground/70"
          >
            İlaç adı veya etkin madde ile arama yaparak, ihtiyacınız olan ürünleri bulun ve talep listesi oluşturun.
          </motion.p>
        </div>
        
        <motion.div 
          ref={searchRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          <motion.div variants={itemVariants} className="relative mb-10">
            <div className="flex items-center shadow-sm border border-gray-200 rounded-lg overflow-hidden">
              <div className="pl-4">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="İlaç adı veya etkin madde ara..."
                className="w-full px-4 py-3 focus:outline-none text-lg"
              />
            </div>
          </motion.div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md border border-gray-100 mb-8 overflow-hidden"
            >
              <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-500">
                <div className="col-span-4 md:col-span-4">İlaç Adı</div>
                <div className="col-span-4 md:col-span-4">Etkin Madde</div>
                <div className="col-span-3 md:col-span-3">Kategori</div>
                <div className="col-span-1 md:col-span-1 text-right">İşlem</div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {searchResults.map((medicine, index) => (
                  <motion.div
                    key={medicine.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-4 md:col-span-4 font-medium">{medicine.name}</div>
                    <div className="col-span-4 md:col-span-4 text-gray-600">{medicine.activeIngredient}</div>
                    <div className="col-span-3 md:col-span-3 text-gray-600">{medicine.category}</div>
                    <div className="col-span-1 md:col-span-1 flex justify-end">
                      <button
                        onClick={() => addToCart(medicine)}
                        className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        aria-label="Sepete ekle"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Cart Button */}
          <motion.div 
            variants={itemVariants}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center justify-center p-4 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </motion.div>

          {/* Cart/Quote Request Sliding Panel */}
          {isCartOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                onClick={() => setIsCartOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl z-50 overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Talep Listesi</h3>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">Listenizde henüz ürün yok</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
                      >
                        Ürün Aramaya Başla
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="divide-y divide-gray-100 mb-6">
                        {cartItems.map((item) => (
                          <div key={item.id} className="py-4 flex justify-between">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">{item.activeIngredient}</p>
                            </div>
                            <div className="flex items-center">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <form className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium mb-1">İsim Soyisim</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="İsim Soyisim"
                          />
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
                          <label className="block text-sm font-medium mb-1">Notlar</label>
                          <textarea
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Eklemek istediğiniz notlar..."
                          />
                        </div>
                      </form>

                      <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:shadow-md hover:shadow-primary/20 transition-all">
                        Teklif Talebi Gönder
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default SearchSection;
