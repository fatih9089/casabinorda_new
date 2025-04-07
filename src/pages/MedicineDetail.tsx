import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { Medicine } from '../types/medicine';
import { mockMedicines } from '../data/mockMedicines';
import { ArrowLeft, ShoppingCart, Check, Info, Package, FileText, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import CartButton from '../components/cart/CartButton';
import CartPanel from '../components/cart/CartPanel';
import Notification from '../components/ui/Notification';
import { createSlug } from '../utils/slugUtils';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { nppActiveIngredients, nppDescription } from '../data/nppMedicines';

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
        
        {medicine.requiresPrescription !== undefined && (
          <div className="mt-2">
            <span className="text-gray-600 font-medium">Prescription Required:</span> 
            <span className="ml-2 text-gray-900">{medicine.requiresPrescription ? 'Yes' : 'No'}</span>
          </div>
        )}
      </div>
    </div>
  );
});

// Check if medicine is in NPP program
const isInNPPProgram = (medicine: Medicine): boolean => {
  // Check if the medicine has isInNPP property set
  if (medicine.isInNPP !== undefined) {
    return medicine.isInNPP;
  }
  
  // Otherwise check if the active ingredient is in the NPP list
  return nppActiveIngredients.includes(medicine.activeIngredient);
};

// Casabinorda Services component (combines wholesale and NPP information)
const CasabinordaServices = memo(({ medicine, userType }: { medicine: Medicine, userType: string }) => {
  // Check if the medicine is in NPP program
  const isInNPP = isInNPPProgram(medicine);
  
  return (
    <div className="mt-6">
      <div className="flex items-center mb-3">
        <Info className="text-primary mr-2" size={20} />
        <h3 className="font-semibold text-lg text-primary">Casabinorda Services</h3>
      </div>
      
      <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
        <p className="text-gray-700">
          Casabinorda specializes in providing access to medications through two main services:
        </p>
        
        <div className="mt-3 space-y-4">
          {/* Wholesale Service */}
          <div className="p-3 rounded-lg border bg-white border-gray-100">
            <h4 className="font-medium flex items-center">
              <Package className="mr-2 text-gray-500" size={16} />
              <span className="text-gray-700">Wholesale Supply</span>
            </h4>
            <p className="mt-1 text-sm text-gray-600">
              We provide bulk medications to pharmacies, healthcare facilities, and authorized distributors with competitive pricing and reliable supply chain.
            </p>
          </div>
          
          {/* NPP Service */}
          <div className="p-3 rounded-lg border bg-white border-gray-100">
            <h4 className="font-medium flex items-center">
              <FileText className="mr-2 text-gray-500" size={16} />
              <span className="text-gray-700">Named Patient Program (NPP)</span>
            </h4>
            <p className="mt-1 text-sm text-gray-600">
              Our NPP allows access to medications not commercially available in a patient's country through valid prescriptions from healthcare providers.
            </p>
          </div>
        </div>
        
        {/* NPP Medication Alert */}
        {isInNPP && (
          <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-start">
              <div className="bg-green-100 p-1 rounded-full mr-2">
                <Check size={16} className="text-green-600" />
              </div>
              <div>
                <h5 className="font-medium text-green-800">NPP Medication</h5>
                <p className="text-sm text-green-700 mt-1">
                  This medication containing <strong>{medicine.activeIngredient}</strong> is part of our Named Patient Program.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Target Audience Information component
const TargetAudienceInfo = memo(({ userType }: { userType: string }) => {
  return (
    <div className="mt-6 mb-4">
      <div className="flex items-center">
        <Users className="text-primary mr-2" size={20} />
        <h3 className="font-semibold text-lg text-primary">Who We Serve</h3>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className={`p-3 rounded-lg border ${userType === 'patient' ? 'bg-green-50 border-green-200 ring-2 ring-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className="font-medium mb-1">Patients & Relatives</h4>
          <p className="text-sm text-gray-600">Access to medications through prescription-based programs</p>
        </div>
        <div className={`p-3 rounded-lg border ${userType === 'doctor' || userType === 'pharmacist' ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-200' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className="font-medium mb-1">Healthcare Professionals</h4>
          <p className="text-sm text-gray-600">Support for prescribing and sourcing medications for patients</p>
        </div>
        <div className={`p-3 rounded-lg border ${userType === 'wholesaler' ? 'bg-purple-50 border-purple-200 ring-2 ring-purple-200' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className="font-medium mb-1">Wholesalers & Merchants</h4>
          <p className="text-sm text-gray-600">Bulk ordering and distribution partnerships</p>
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
    
    // Show notification
    setNotificationMessage(`${medicine.name} added to cart`);
    setShowNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  }, []);

  // Memoize update quantity function
  const updateQuantity = useCallback((id: number, newQuantity: number) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        return prevItems.filter(item => item.id !== id);
      }
      
      return prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity: newQuantity } 
          : item
      );
    });
  }, []);

  // Memoize clear cart function
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Toggle request form
  const toggleRequestForm = useCallback(() => {
    setShowRequestForm(prev => !prev);
    setFormError(null);
  }, []);

  // Handle request form input change
  const handleRequestInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRequestFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If userType is changed, update the UI immediately to show relevant information
    if (name === 'userType') {
      // Force a re-render to update the UI with the new user type
      setRequestFormData(prev => ({...prev}));
    }
  }, []);

  // Handle request form submission
  const handleRequestSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!requestFormData.name || !requestFormData.email || !requestFormData.phone) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    emailjs.send(
      'service_aye53iy',
      'template_ooxnw4q',
      {
        name: requestFormData.name,
        email: requestFormData.email,
        phone: requestFormData.phone,
        quantity: requestFormData.quantity,
        message: requestFormData.message,
        userType: requestFormData.userType,
        medicine: medicine?.name,
        subject: `Information Request: ${medicine?.name}`
      },
      'PekYKb6ImWD2awBBC'
    )
    .then((result) => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // 5 saniye sonra formu sıfırla
      setTimeout(() => {
        setIsSubmitted(false);
        setRequestFormData({
          name: '',
          email: '',
          phone: '',
          quantity: '1',
          message: '',
          userType: 'patient'
        });
      }, 5000);
    })
    .catch((error) => {
      setIsSubmitting(false);
      setFormError('Error sending request. Please try again later.');
      console.error('EmailJS error:', error);
    });
  }, [requestFormData, medicine]);

  // Memoize similar medicines
  const similarMedicines = useMemo(() => {
    if (!medicine) return [];
    
    return mockMedicines
      .filter(m => 
        m.id !== medicine.id && 
        m.activeIngredient === medicine.activeIngredient
      );
  }, [medicine]);

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  // Set static background image
  useEffect(() => {
    setBackgroundImage(`/images/backgrounds/medicine-detail.webp`);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
          <meta name="description" content={`${medicine.name} (${medicine.activeIngredient}) - Available for wholesale purchase and through Named Patient Program (NPP). ${medicine.activeIngredientDescription?.substring(0, 100)}...`} />
          <meta name="keywords" content={`${medicine.name}, ${medicine.activeIngredient}, wholesale medicine, NPP, Named Patient Program, prescription medicine, pharmacy supply, Casabinorda`} />
          <meta property="og:title" content={`${medicine.name} (${medicine.activeIngredient}) | Wholesale & NPP | Casabinorda`} />
          <meta property="og:description" content={`${medicine.name} (${medicine.activeIngredient}) - Available for wholesale purchase and through Named Patient Program (NPP). ${medicine.activeIngredientDescription?.substring(0, 100)}...`} />
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
        <div className="container-tight flex md:justify-start justify-end">
          <div> 
            <Link 
              to="/" 
              className="font-display font-bold text-2xl block"
              onClick={() => navigate('/')}
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
                      Send an Inquiry
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
                          <form onSubmit={handleRequestSubmit}>
                            <h3 className="font-medium mb-3">Please fill out the form below and our team will get back to you within 24 hours with the most suitable solution.</h3>
                            
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
                                  type="number"
                                  id="quantity"
                                  name="quantity"
                                  value={requestFormData.quantity}
                                  onChange={handleRequestInputChange}
                                  className="w-full p-2 border rounded-md"
                                  min="1"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="userType" className="block text-sm font-medium mb-1">I am a:</label>
                                <select
                                  id="userType"
                                  name="userType"
                                  value={requestFormData.userType}
                                  onChange={handleRequestInputChange}
                                  className="w-full p-2 border rounded-md"
                                >
                                  <option value="patient">Patient/Patients Relative</option>
                                  <option value="doctor">Healthcare Professional</option>
                                  <option value="pharmacist">Pharmacist</option>
                                  <option value="wholesaler">Wholesaler/Merchant</option>
                                </select>
                              </div>
                              
                              <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                                <textarea
                                  id="message"
                                  name="message"
                                  value={requestFormData.message}
                                  onChange={handleRequestInputChange}
                                  className="w-full p-2 border rounded-md"
                                  rows={4}
                                ></textarea>
                              </div>
                              
                              <div className="flex justify-end">
                                <button
                                  type="submit"
                                  className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                      Sending...
                                    </>
                                  ) : 'Submit Request'}
                                </button>
                              </div>
                            </div>
                          </form>
                        ) : (
                          <div className="bg-green-50 text-green-600 p-4 rounded-md text-center">
                            <Check size={32} className="mx-auto mb-2" />
                            <h3 className="font-medium mb-1">Request Submitted</h3>
                            <p className="text-sm">Thank you for your interest. We will contact you shortly.</p>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Additional information sections */}
            <CasabinordaServices medicine={medicine} userType={requestFormData.userType} />
            <TargetAudienceInfo userType={requestFormData.userType} />
            
            {/* Similar medicines section */}
            {similarMedicines.length > 0 && (
              <SimilarMedicines medicines={similarMedicines} navigate={navigate} />
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Notification component */}
      <Notification 
        isVisible={showNotification} 
        message={notificationMessage} 
        onClose={() => setShowNotification(false)} 
      />
    </div>
  );
};

export default MedicineDetail;
