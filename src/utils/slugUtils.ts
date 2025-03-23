/**
 * Metni URL dostu bir slug'a dönüştürür
 * @param text Dönüştürülecek metin
 * @returns URL dostu slug
 */
export const createSlug = (text: string): string => {
  if (!text) return '';
  
  // Türkçe karakterleri dönüştür
  const turkishChars: Record<string, string> = {
    'ğ': 'g', 'Ğ': 'G', 'ü': 'u', 'Ü': 'U', 'ş': 's', 'Ş': 'S',
    'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ç': 'c', 'Ç': 'C'
  };
  
  let slug = text.toLowerCase();
  
  // Türkçe karakterleri değiştir
  Object.keys(turkishChars).forEach(char => {
    slug = slug.replace(new RegExp(char, 'g'), turkishChars[char]);
  });
  
  // Alfanumerik olmayan karakterleri tire ile değiştir ve ardışık tireleri tek tireye dönüştür
  slug = slug
    .replace(/[^a-z0-9]+/g, '-')  // Alfanumerik olmayan karakterleri tire ile değiştir
    .replace(/^-+|-+$/g, '')      // Baştaki ve sondaki tireleri kaldır
    .replace(/-+/g, '-');         // Ardışık tireleri tek tireye dönüştür
  
  return slug;
};

/**
 * İlaç için tam slug oluşturur
 * @param activeIngredient Etkin madde
 * @param brandName İlaç adı
 * @returns Tam slug
 */
export const createMedicineSlug = (activeIngredient: string, brandName: string): string => {
  const activeIngredientSlug = createSlug(activeIngredient);
  const brandNameSlug = createSlug(brandName);
  
  return `${activeIngredientSlug}/${brandNameSlug}`;
};

/**
 * Slug'dan ilaç bilgilerini ayıklar
 * @param slug İlaç slug'ı
 * @returns {activeIngredient, brandName} objesi
 */
export const parseMedicineSlug = (slug: string): { activeIngredient: string, brandName: string } => {
  const parts = slug.split('/');
  return {
    activeIngredient: parts[0] || '',
    brandName: parts[1] || ''
  };
};
