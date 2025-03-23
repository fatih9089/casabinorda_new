import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { Medicine } from '../types/medicine';
import { mockMedicines } from '../data/mockMedicines';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import CartButton from '../components/cart/CartButton';
import CartPanel from '../components/cart/CartPanel';
import Notification from '../components/ui/Notification';
import { createSlug } from '../utils/slugUtils';
import { Link } from 'react-router-dom';

// Similar medicines component extracted and optimized with memo
const SimilarMedicines = memo(({ medicines, navigate }: { 
  medicines: Medicine[], 
  navigate: (path: string, options?: any) => void 
}) => {
  if (medicines.length === 0) return null;
  
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Similar Medicines</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {medicines.map(medicine => (
          <div 
            key={medicine.id}
            onClick={() => navigate(`/medicine/${createSlug(medicine.activeIngredient)}/${createSlug(medicine.name)}`, { state: { medicine } })}
            className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="font-medium">{medicine.name}</h3>
            <p className="text-sm text-gray-500">{medicine.packaging || 'Not specified'}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

// Medicine information component extracted and optimized with memo
const MedicineInfo = memo(({ medicine }: { medicine: Medicine }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Medicine Information</h2>
      <div className="space-y-3">
        <div>
          <span className="text-gray-600 font-medium">Active Ingredient:</span> 
          <span className="ml-2 text-gray-900">{medicine.activeIngredient}</span>
          {medicine.activeIngredientDescription && (
            <p className="mt-1 text-sm text-gray-600">{medicine.activeIngredientDescription}</p>
          )}
        </div>
        
        <div>
          <span className="text-gray-600 font-medium">Packaging:</span> 
          <span className="ml-2 text-gray-900">{medicine.packaging || '-'}</span>
        </div>
        
        <div>
          <span className="text-gray-600 font-medium">Manufacturer:</span> 
          <span className="ml-2 text-gray-900">{medicine.manufacturer || '-'}</span>
        </div>
        
        <div>
          <span className="text-gray-600 font-medium">Country of Origin:</span> 
          <span className="ml-2 text-gray-900">{medicine.country || '-'}</span>
        </div>
      </div>
    </div>
  );
});

const MedicineDetail = () => {
  const { id, activeIngredient, brandName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [cartItems, setCartItems] = useState<(Medicine & { quantity: number })[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [headerBg, setHeaderBg] = useState('bg-transparent');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  
  // Request form data
  const [requestFormData, setRequestFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: '',
    message: '',
    userType: 'patient' // Default to patient
  });
  
  // Add scroll event listener to change header background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHeaderBg('bg-white/80 backdrop-blur-sm shadow-sm');
      } else {
        setHeaderBg('bg-transparent');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Optimize localStorage operations
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save to localStorage when cart updates
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Load medicine data
  useEffect(() => {
    if (location.state?.medicine) {
      setMedicine(location.state.medicine);
      setIsLoading(false);
      return;
    }
    
    if (activeIngredient && brandName) {
      // SEO dostu URL'den ilaç bilgisini bul
      const foundMedicine = mockMedicines.find(m => 
        createSlug(m.activeIngredient) === activeIngredient && 
        createSlug(m.name) === brandName
      );
      
      if (foundMedicine) {
        setMedicine(foundMedicine);
        setIsLoading(false);
        return;
      }
    }
    
    if (id) {
      // Geriye dönük uyumluluk için ID ile ilaç bilgisini bul
      const medicineId = parseInt(id);
      const foundMedicine = mockMedicines.find(m => m.id === medicineId);
      
      if (foundMedicine) {
        setMedicine(foundMedicine);
        setIsLoading(false);
        return;
      }
    }
    
    setIsLoading(false);
  }, [id, activeIngredient, brandName, location.state]);

  // Update URL to SEO friendly format if needed
  useEffect(() => {
    if (medicine && id && !activeIngredient && !brandName) {
      // Eğer ID ile geldiyse ve ilaç bilgisi yüklendiyse, URL'i SEO dostu formata yönlendir
      const activeIngredientSlug = createSlug(medicine.activeIngredient);
      const brandNameSlug = createSlug(medicine.name);
      navigate(`/medicine/${activeIngredientSlug}/${brandNameSlug}`, { 
        replace: true, // Tarayıcı geçmişini değiştirmeden URL'i güncelle
        state: { medicine } 
      });
    }
  }, [medicine, id, activeIngredient, brandName, navigate]);

  // Memoize add to cart function
  const addToCart = useCallback((medicine: Medicine) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === medicine.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevItems, { ...medicine, quantity: 1 }];
      }
    });
    
    // Show notification instead of opening cart panel
    setNotificationMessage(`${medicine.name} added to cart`);
    setShowNotification(true);
  }, []);

  // Memoize update quantity function
  const updateQuantity = useCallback((id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // If quantity is 0 or less, remove the item from cart
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    } else {
      // Otherwise update the quantity
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  }, []);

  // Sepeti temizleme fonksiyonu
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Separate variants for content and form
  const contentVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }), []);
  
  // No animation for the form to prevent zoom effect
  const formVariants = useMemo(() => ({
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
  }), []);

  // Memoize similar medicines
  const similarMedicines = useMemo(() => {
    if (!medicine) return [];
    
    return mockMedicines
      .filter(m => 
        m.id !== medicine.id && 
        m.activeIngredient === medicine.activeIngredient
      );
  }, [medicine]);

  const handleRequestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRequestFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserTypeChange = (type: string) => {
    setRequestFormData(prev => ({ ...prev, userType: type }));
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    // Form validation
    if (!requestFormData.name || !requestFormData.email || !requestFormData.phone || !requestFormData.userType) {
      e.preventDefault();
      setFormError('Please fill in all required fields and select your user type.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requestFormData.email)) {
      e.preventDefault();
      setFormError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    // Form will be submitted naturally by the browser
    // We don't prevent default here to allow the form to submit normally
  };

  const toggleRequestForm = () => {
    setShowRequestForm(!showRequestForm);
  };

  useEffect(() => {
    // Select a random background image on component mount
    const imageCount = 10; // Total number of background images
    const randomImageNumber = Math.floor(Math.random() * imageCount) + 1;
    setBackgroundImage(`/images/backgrounds/medicine-detail${randomImageNumber}.webp`);
  }, []);

  if (isLoading) {
    return (
      <div className="container-tight py-16 flex justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="container-tight py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Medicine not found</h1>
          <button 
            onClick={() => navigate('/')} 
            className="text-primary hover:underline flex items-center justify-center mx-auto"
          >
            <ArrowLeft size={16} className="mr-2" /> Return to home page
          </button>
        </div>
      </div>
    );
  }

  // Create image URL
  const imageUrl = medicine.imageUrl || `/images/medicines/${medicine.id}.webp`;

  return (
    <div className="bg-gray-50 min-h-screen pb-16 relative max-w-full">
      {medicine && (
        <Helmet>
          <title>{medicine.name} ({medicine.activeIngredient}) | Casabinorda</title>
          <meta name="description" content={`${medicine.name} (${medicine.activeIngredient}) - ${medicine.activeIngredientDescription?.substring(0, 150)}...`} />
          <meta name="keywords" content={`${medicine.name}, ${medicine.activeIngredient}, medicine, pharmacy, health, Casabinorda`} />
          <meta property="og:title" content={`${medicine.name} (${medicine.activeIngredient}) | Casabinorda`} />
          <meta property="og:description" content={`${medicine.name} (${medicine.activeIngredient}) - ${medicine.activeIngredientDescription?.substring(0, 150)}...`} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:image" content={imageUrl} />
        </Helmet>
      )}
      
      {/* Fixed background image that doesn't change with content size */}
      <div className="fixed inset-0 w-full h-full z-0">
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat w-full h-full"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%', 
            filter: 'blur(0px)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/50" /> 
      </div>
      
      <CartPanel 
        isCartOpen={isCartOpen} 
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        clearCart={clearCart}
      />
      
      {/* Back button positioned at the absolute left edge of the page */}
      <button 
        onClick={() => navigate('/')} 
        className="fixed left-4 top-4 text-gray-800 hover:text-gray-900 flex items-center z-20 transition-all"
      >
        <ArrowLeft size={18} className="mr-2" /> Back
      </button>
      
      {/* Fixed header with CASABINORDA branding positioned to align with content area */}
      <div className={`fixed top-0 left-0 right-0 z-10 py-4 transition-all duration-300 ${headerBg}`}>
        <div className="container-tight flex">
          <div> 
            <Link 
              to="/" 
              className="font-display font-bold text-2xl block"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="text-primary">CASA</span>
              <span className="text-foreground">BINORDA</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container-tight py-8 md:py-12 relative z-10 pt-20">
        <div className="grid grid-cols-1 items-center w-full mb-6">
          <div className="flex justify-end">
            <CartButton 
              cartItems={cartItems} 
              setIsCartOpen={setIsCartOpen} 
              itemVariants={contentVariants}
            />
          </div>
        </div>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden w-full mt-12"
        >
          <div className="p-6 md:p-8">
            {/* Image element */}
            {!imageError && (
              <div className="mb-6 flex justify-center">
                <img
                  src={imageUrl}
                  alt={medicine.name}
                  onError={() => setImageError(true)}
                  className="w-64 h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{medicine.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <MedicineInfo medicine={medicine} />
              
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Order Information</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => addToCart(medicine)}
                      className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center"
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/');
                        setTimeout(() => {
                          const searchElement = document.getElementById('search');
                          if (searchElement) {
                            searchElement.scrollIntoView({ behavior: 'smooth' });
                            // Arama kutusuna odaklan
                            const searchInput = document.querySelector('#search input[type="text"]');
                            if (searchInput) {
                              (searchInput as HTMLInputElement).focus();
                            }
                          }
                        }, 500);
                      }}
                      className="w-full bg-white border border-primary text-primary py-2 px-4 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      Find Another Medicine
                    </button>
                    
                    <button
                      onClick={toggleRequestForm}
                      className="w-full bg-white border border-primary text-primary py-2 px-4 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      Request Information
                    </button>
                    
                  </div>
                  
                  {showRequestForm && (
                    <div className="mt-4 border-t pt-4">
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={formVariants}
                      >
                        {!isSubmitted ? (
                          <form onSubmit={handleRequestSubmit} action="https://formsubmit.co/devvare@gmail.com" method="POST">
                            <h3 className="font-medium mb-3">Request Information</h3>
                            
                            {formError && (
                              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-3 text-sm">
                                {formError}
                              </div>
                            )}
                            
                            <div className="space-y-3">
                              <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
                                <input
                                  type="text"
                                  id="name"
                                  name="name"
                                  value={requestFormData.name}
                                  onChange={handleRequestInputChange}
                                  className="w-full p-2 border rounded-md"
                                  required
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  value={requestFormData.email}
                                  onChange={handleRequestInputChange}
                                  className="w-full p-2 border rounded-md"
                                  required
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone *</label>
                                <input
                                  type="tel"
                                  id="phone"
                                  name="phone"
                                  value={requestFormData.phone}
                                  onChange={handleRequestInputChange}
                                  className="w-full p-2 border rounded-md"
                                  required
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="quantity" className="block text-sm font-medium mb-1">Quantity</label>
                                <input
                                  type="text"
                                  id="quantity"
                                  name="quantity"
                                  value={requestFormData.quantity}
                                  onChange={handleRequestInputChange}
                                  className="w-full p-2 border rounded-md"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-2">I am a...</label>
                                <div className="grid grid-cols-1 gap-3 pl-4">
                                  <div 
                                    onClick={() => handleUserTypeChange('patient')}
                                    className={`p-3 border rounded-md cursor-pointer flex items-center justify-between transition-colors ${requestFormData.userType === 'patient' ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}
                                  >
                                    <span>Patient/Patient Relative</span>
                                    {requestFormData.userType === 'patient' && <Check className="h-4 w-4 text-primary" />}
                                  </div>
                                  <div 
                                    onClick={() => handleUserTypeChange('healthcare')}
                                    className={`p-3 border rounded-md cursor-pointer flex items-center justify-between transition-colors ${requestFormData.userType === 'healthcare' ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}
                                  >
                                    <span>Healthcare Professional</span>
                                    {requestFormData.userType === 'healthcare' && <Check className="h-4 w-4 text-primary" />}
                                  </div>
                                  <div 
                                    onClick={() => handleUserTypeChange('business')}
                                    className={`p-3 border rounded-md cursor-pointer flex items-center justify-between transition-colors ${requestFormData.userType === 'business' ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}
                                  >
                                    <span>Wholesaler/Merchant</span>
                                    {requestFormData.userType === 'business' && <Check className="h-4 w-4 text-primary" />}
                                  </div>
                                </div>
                                <input type="hidden" name="userType" value={requestFormData.userType} />
                              </div>
                              
                              <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                                <textarea
                                  id="message"
                                  name="message"
                                  value={requestFormData.message}
                                  onChange={handleRequestInputChange}
                                  className="w-full p-2 border rounded-md"
                                  rows={3}
                                />
                              </div>
                              
                              <input type="hidden" name="_subject" value={`Information Request for ${medicine?.name}`} />
                              <input type="hidden" name="_captcha" value="false" />
                              <input type="hidden" name="_next" value={window.location.href} />
                              <input type="hidden" name="_template" value="table" />
                              
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70"
                              >
                                {isSubmitting ? 'Sending...' : 'Send Request'}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="bg-green-50 text-green-600 p-4 rounded-md text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Check className="h-6 w-6 mr-2" />
                              <span className="font-medium">Request Sent!</span>
                            </div>
                            <p className="text-sm">Thank you for your request. We will contact you shortly.</p>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-500 mt-4">
                    * Please contact us for pricing information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <SimilarMedicines medicines={similarMedicines} navigate={navigate} />
        
        {/* Notification */}
        <Notification
          message={notificationMessage}
          isVisible={showNotification}
          onClose={() => setShowNotification(false)}
          type="success"
        />
      </div>
    </div>
  );
};

export default MedicineDetail;
