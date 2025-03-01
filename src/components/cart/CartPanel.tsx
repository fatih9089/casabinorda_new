
import { motion } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { Medicine } from '../../types/medicine';

interface CartPanelProps {
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: (Medicine & { quantity: number })[];
  updateQuantity: (id: number, newQuantity: number) => void;
}

const CartPanel = ({ isCartOpen, setIsCartOpen, cartItems, updateQuantity }: CartPanelProps) => {
  if (!isCartOpen) return null;

  return (
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
  );
};

export default CartPanel;
