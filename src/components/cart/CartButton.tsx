import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle, X } from 'lucide-react';
import { Medicine } from '../../types/medicine';
import { useState } from 'react';

interface CartButtonProps {
  cartItems: (Medicine & { quantity: number })[];
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  itemVariants: any;
}

const CartButton = ({ cartItems, setIsCartOpen, itemVariants }: CartButtonProps) => {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Sepet butonuna tıklandığında talep listesini aç
  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  // WhatsApp butonuna tıklandığında modal'ı aç
  const handleWhatsAppButtonClick = () => {
    setShowWhatsAppModal(true);
  };

  // Modal'ı kapat
  const closeWhatsAppModal = () => {
    setShowWhatsAppModal(false);
  };

  // WhatsApp'a yönlendirme fonksiyonu
  const handleWhatsAppClick = (messageType: string) => {
    const phoneNumber = "905011513491"; // Güncellenmiş telefon numarası
    let message = "";
    
    // Mesaj tipine göre farklı mesajlar
    switch(messageType) {
      case 'npp':
        message = "Hello CASABINORDA, I would like to get information about NPP (Named Patient Program). Medicines I'm interested in:";
        break;
      case 'wholesale':
        message = "Hello CASABINORDA, I would like to get information about wholesale medicine purchase. Medicines I'm interested in:";
        break;
      default:
        message = "Hello CASABINORDA, I would like to get information about your services.";
    }
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeWhatsAppModal();
  };

  // Sepette ürün olup olmadığını kontrol et
  const hasItems = cartItems.length > 0;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
        {/* WhatsApp butonu - sadece mobil görünümde */}
        <motion.div 
          variants={itemVariants}
          className="md:hidden block"
        >
          <button
            onClick={handleWhatsAppButtonClick}
            className="flex items-center justify-center p-4 bg-green-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
            aria-label="WhatsApp ile iletişime geç"
          >
            <MessageCircle size={24} />
          </button>
        </motion.div>
        
        {/* Sepet butonu - sadece sepette ürün varsa göster */}
        {hasItems && (
          <motion.div variants={itemVariants}>
            <button
              onClick={handleCartClick}
              className="flex items-center justify-center p-4 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all relative"
              aria-label="Sepeti aç"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                {getTotalItems()}
              </span>
            </button>
          </motion.div>
        )}
      </div>

      {/* WhatsApp Mesaj Seçenekleri Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={closeWhatsAppModal}
          ></div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-10 relative">
            <div className="p-4 text-center">
              <p className="text-lg font-medium mb-4">Select your purpose of contact</p>
              <div className="space-y-2">
                <button 
                  onClick={() => handleWhatsAppClick('npp')}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors"
                >
                  I would like to get information about NPP (Named Patient Program)
                </button>
                <button 
                  onClick={() => handleWhatsAppClick('wholesale')}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors"
                >
                  I would like to get information about wholesale medicine purchase
                </button>
                <button 
                  onClick={closeWhatsAppModal}
                  className="w-full py-2 px-4 mt-2 bg-gray-100 rounded-lg text-center hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartButton;
