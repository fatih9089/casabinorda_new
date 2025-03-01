
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Plus, ShoppingCart, X, Minus, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

// Genişletilmiş ilaç tipi tanımı
interface Medicine {
  id: number;
  name: string;
  activeIngredient: string;
  category: string;
  packaging?: string;
  manufacturer?: string;
  country?: string;
}

// Mock data - genişletilmiş veri alanlarıyla
const mockMedicines: Medicine[] = [
  { id: 1, name: "Parol", activeIngredient: "Parasetamol", category: "Ağrı Kesici", packaging: "20 Tablet", manufacturer: "Atabay", country: "Türkiye" },
  { id: 2, name: "Majezik", activeIngredient: "Flurbiprofen", category: "Ağrı Kesici", packaging: "15 Tablet", manufacturer: "Sanovel", country: "Türkiye" },
  { id: 3, name: "Augmentin", activeIngredient: "Amoksisilin", category: "Antibiyotik", packaging: "14 Tablet", manufacturer: "GSK", country: "İngiltere" },
  { id: 4, name: "Cipro", activeIngredient: "Siprofloksasin", category: "Antibiyotik", packaging: "10 Tablet", manufacturer: "Bayer", country: "Almanya" },
  { id: 5, name: "Xanax", activeIngredient: "Alprazolam", category: "Anksiyolitik", packaging: "30 Tablet", manufacturer: "Pfizer", country: "ABD" },
  { id: 6, name: "Prozac", activeIngredient: "Fluoksetin", category: "Antidepresan", packaging: "28 Kapsül", manufacturer: "Eli Lilly", country: "ABD" },
  { id: 7, name: "Lipitor", activeIngredient: "Atorvastatin", category: "Kolesterol", packaging: "90 Tablet", manufacturer: "Pfizer", country: "ABD" },
  { id: 8, name: "Coumadin", activeIngredient: "Warfarin", category: "Antikoagülan", packaging: "28 Tablet", manufacturer: "Bristol-Myers Squibb", country: "ABD" },
  { id: 9, name: "Ventolin", activeIngredient: "Salbutamol", category: "Bronkodilatatör", packaging: "1 İnhaler", manufacturer: "GSK", country: "İngiltere" },
  { id: 10, name: "Nexium", activeIngredient: "Esomeprazol", category: "Proton Pompası İnhibitörü", packaging: "14 Tablet", manufacturer: "AstraZeneca", country: "İsveç" },
];

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [cartItems, setCartItems] = useState<(Medicine & { quantity: number })[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  
  const searchRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInView = useInView(searchRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = medicines.filter(
        medicine => 
          medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          medicine.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (medicine.manufacturer && medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (medicine.country && medicine.country.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, medicines]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileUploadError(null);
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Doğru veri formatını kontrol et ve dönüştür
        const newMedicines = jsonData.map((row: any, index) => {
          // Excel'den gelen verilerin alan isimlerini kontrol et
          if (!row.name || !row.activeIngredient || !row.category) {
            throw new Error('Excel dosyası doğru formatı içermiyor. İlaç adı, etkin madde ve kategori alanları zorunludur.');
          }
          
          return {
            id: (medicines.length > 0 ? Math.max(...medicines.map(m => m.id)) : 0) + index + 1,
            name: row.name,
            activeIngredient: row.activeIngredient,
            category: row.category,
            packaging: row.packaging || '',
            manufacturer: row.manufacturer || '',
            country: row.country || '',
          };
        });
        
        setMedicines(prevMedicines => [...prevMedicines, ...newMedicines]);
        
        // Dosya seçimini sıfırla
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Excel dosyası yüklenirken hata oluştu:', error);
        setFileUploadError('Excel dosyası yüklenirken bir hata oluştu. Lütfen doğru formatta bir dosya yüklediğinizden emin olun.');
      }
    };
    
    reader.onerror = () => {
      setFileUploadError('Dosya okunurken bir hata oluştu.');
    };
    
    reader.readAsBinaryString(file);
  };

  const addToCart = (medicine: Medicine) => {
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

  const updateQuantity = (id: number, newQuantity: number) => {
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
          <motion.div variants={itemVariants} className="relative mb-6">
            <div className="flex items-center shadow-sm border border-gray-200 rounded-lg overflow-hidden">
              <div className="pl-4">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="İlaç adı, etkin madde, üretici firma veya ülke ara..."
                className="w-full px-4 py-3 focus:outline-none text-lg"
              />
            </div>
          </motion.div>

          {/* Excel Dosyası Yükleme */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <span className="block text-sm font-medium text-gray-900">Excel Dosyası Yükle</span>
                  <span className="block text-xs text-gray-500 mt-1">İlaç listenizi içeren Excel dosyasını (.xlsx) yükleyin</span>
                </div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
            {fileUploadError && (
              <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {fileUploadError}
              </div>
            )}
          </motion.div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md border border-gray-100 mb-8 overflow-hidden overflow-x-auto"
            >
              <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-500 min-w-[1000px]">
                <div className="col-span-2">İlaç Adı</div>
                <div className="col-span-2">Etkin Madde</div>
                <div className="col-span-2">Kategori</div>
                <div className="col-span-2">Paketleme</div>
                <div className="col-span-2">Üretici Firma</div>
                <div className="col-span-1">Ülke</div>
                <div className="col-span-1 text-right">İşlem</div>
              </div>
              
              <div className="divide-y divide-gray-100 min-w-[1000px]">
                {searchResults.map((medicine, index) => (
                  <motion.div
                    key={medicine.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-2 font-medium">{medicine.name}</div>
                    <div className="col-span-2 text-gray-600">{medicine.activeIngredient}</div>
                    <div className="col-span-2 text-gray-600">{medicine.category}</div>
                    <div className="col-span-2 text-gray-600">{medicine.packaging || '-'}</div>
                    <div className="col-span-2 text-gray-600">{medicine.manufacturer || '-'}</div>
                    <div className="col-span-1 text-gray-600">{medicine.country || '-'}</div>
                    <div className="col-span-1 flex justify-end">
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
                              <p className="text-xs text-gray-400">{item.manufacturer} | {item.packaging}</p>
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
