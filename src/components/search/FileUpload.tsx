
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Medicine } from '../../types/medicine';

interface FileUploadProps {
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
  fileUploadError: string | null;
  setFileUploadError: React.Dispatch<React.SetStateAction<string | null>>;
  itemVariants: any;
}

const FileUpload = ({ medicines, setMedicines, fileUploadError, setFileUploadError, itemVariants }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
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
  );
};

export default FileUpload;
