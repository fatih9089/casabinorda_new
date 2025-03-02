
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Medicine } from '../../types/medicine';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface SearchResultsProps {
  searchResults: Medicine[];
  addToCart: (medicine: Medicine) => void;
}

const SearchResults = ({ searchResults, addToCart }: SearchResultsProps) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMedicineClick = (medicine: Medicine) => {
    navigate(`/medicine/${medicine.id}`, { state: { medicine } });
  };

  if (searchResults.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md border border-gray-100 mb-8 overflow-hidden"
    >
      <div className={`grid ${isMobile ? 'grid-cols-5' : 'grid-cols-12'} px-6 py-3 bg-gray-50 text-sm font-medium text-gray-500 ${isMobile ? '' : 'min-w-[1000px]'}`}>
        <div className={isMobile ? "col-span-3" : "col-span-2"}>İlaç Adı</div>
        <div className={isMobile ? "col-span-2" : "col-span-2"}>Etkin Madde</div>
        {!isMobile && (
          <>
            <div className="col-span-2">Kategori</div>
            <div className="col-span-2">Paketleme</div>
            <div className="col-span-2">Üretici Firma</div>
            <div className="col-span-1">Ülke</div>
          </>
        )}
        <div className={`${isMobile ? "" : "col-span-1"} text-right`}>İşlem</div>
      </div>
      
      <div className={`divide-y divide-gray-100 ${isMobile ? '' : 'min-w-[1000px]'}`}>
        {searchResults.map((medicine, index) => (
          <motion.div
            key={medicine.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`grid ${isMobile ? 'grid-cols-5' : 'grid-cols-12'} px-6 py-4 hover:bg-gray-50 transition-colors`}
          >
            <div 
              className={`${isMobile ? "col-span-3" : "col-span-2"} font-medium cursor-pointer`} 
              onClick={() => handleMedicineClick(medicine)}
            >
              {medicine.name}
            </div>
            <div 
              className={`${isMobile ? "col-span-2" : "col-span-2"} text-gray-600 cursor-pointer`}
              onClick={() => handleMedicineClick(medicine)}
            >
              {medicine.activeIngredient}
            </div>
            {!isMobile && (
              <>
                <div className="col-span-2 text-gray-600">{medicine.category || '-'}</div>
                <div className="col-span-2 text-gray-600">{medicine.packaging || '-'}</div>
                <div className="col-span-2 text-gray-600">{medicine.manufacturer || '-'}</div>
                <div className="col-span-1 text-gray-600">{medicine.country || '-'}</div>
              </>
            )}
            <div className={`${isMobile ? "" : "col-span-1"} flex justify-end`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(medicine);
                }}
                className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex-shrink-0 w-8 h-8 flex items-center justify-center"
                aria-label="Sepete ekle"
              >
                <Plus size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchResults;
