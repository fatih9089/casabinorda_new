
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Medicine } from '../../types/medicine';

interface SearchResultsProps {
  searchResults: Medicine[];
  addToCart: (medicine: Medicine) => void;
}

const SearchResults = ({ searchResults, addToCart }: SearchResultsProps) => {
  if (searchResults.length === 0) return null;
  
  return (
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
  );
};

export default SearchResults;
