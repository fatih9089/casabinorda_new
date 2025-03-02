
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Medicine } from '../types/medicine';
import { mockMedicines } from '../data/mockMedicines';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const MedicineDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Önce location.state'den bakalım (performans için)
    if (location.state?.medicine) {
      setMedicine(location.state.medicine);
      setIsLoading(false);
      return;
    }
    
    // State'den gelmezse ID ile bulalım
    if (id) {
      const medicineId = parseInt(id);
      const foundMedicine = mockMedicines.find(m => m.id === medicineId);
      
      if (foundMedicine) {
        setMedicine(foundMedicine);
      }
    }
    
    setIsLoading(false);
  }, [id, location.state]);

  if (isLoading) {
    return (
      <div className="container-tight py-16 flex justify-center">
        <div className="animate-pulse text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="container-tight py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">İlaç bulunamadı</h1>
          <button 
            onClick={() => navigate('/')} 
            className="text-primary hover:underline flex items-center justify-center mx-auto"
          >
            <ArrowLeft size={16} className="mr-2" /> Ana sayfaya dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-tight py-12 md:py-16">
      <button 
        onClick={() => navigate('/')} 
        className="mb-6 flex items-center text-primary hover:underline"
      >
        <ArrowLeft size={16} className="mr-2" /> Arama Sonuçlarına Dön
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
      >
        <div className="bg-primary/5 px-6 py-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">{medicine.name}</h1>
          <p className="text-primary font-medium mt-1">{medicine.activeIngredient}</p>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">İlaç Bilgileri</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-3 border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Kategori</span>
                  <span className="col-span-2 font-medium">{medicine.category || 'Belirtilmemiş'}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Paketleme</span>
                  <span className="col-span-2 font-medium">{medicine.packaging || 'Belirtilmemiş'}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Üretici Firma</span>
                  <span className="col-span-2 font-medium">{medicine.manufacturer || 'Belirtilmemiş'}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Ülke</span>
                  <span className="col-span-2 font-medium">{medicine.country || 'Belirtilmemiş'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Etkin Madde: {medicine.activeIngredient}</h2>
              <p className="text-gray-600 mb-6">
                Bu etkin madde içeren ilaçlar, spesifik hastalıkların tedavisinde kullanılır. 
                Daha fazla bilgi için lütfen doktorunuza danışınız.
              </p>
              <button className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center">
                <ShoppingCart size={18} className="mr-2" />
                Teklif İsteğine Ekle
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Benzer İlaçlar</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {mockMedicines
            .filter(m => 
              m.id !== medicine.id && 
              m.activeIngredient.toLowerCase() === medicine.activeIngredient.toLowerCase()
            )
            .slice(0, 3)
            .map(similarMedicine => (
              <div 
                key={similarMedicine.id}
                onClick={() => navigate(`/medicine/${similarMedicine.id}`, { state: { medicine: similarMedicine } })}
                className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="font-medium">{similarMedicine.name}</h3>
                <p className="text-sm text-gray-500">{similarMedicine.manufacturer || 'Belirtilmemiş'}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MedicineDetail;
