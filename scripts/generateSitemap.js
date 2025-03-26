// generateSitemap.js - Tüm ilaçları ve etkin maddeleri içeren dinamik bir sitemap oluşturur
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules için __dirname ve __filename oluştur
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// mockMedicines.ts dosyasını okuyup ilaç verilerini çıkarmak için regex kullanacağız
const mockMedicinesPath = path.join(__dirname, '../src/data/mockMedicines.ts');
const mockMedicinesContent = fs.readFileSync(mockMedicinesPath, 'utf8');

// İlaç verilerini regex ile çıkaralım
const medicineRegex = /{\s*id:\s*(\d+),\s*name:\s*"([^"]+)",\s*activeIngredient:\s*"([^"]+)"/g;
const medicines = [];
let match;

while ((match = medicineRegex.exec(mockMedicinesContent)) !== null) {
  medicines.push({
    id: match[1],
    name: match[2].trim(),
    activeIngredient: match[3].trim()
  });
}

// Benzersiz etkin maddeleri bulalım
const uniqueActiveIngredients = [...new Set(medicines.map(med => med.activeIngredient))];

console.log(`Toplam ${medicines.length} ilaç bulundu.`);
console.log(`Toplam ${uniqueActiveIngredients.length} benzersiz etkin madde bulundu.`);

// URL dostu slug oluşturma fonksiyonu
function createSlug(text) {
  if (!text) return '';
  
  // Türkçe karakterleri dönüştür
  const turkishChars = {
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
}

// Sitemap XML oluştur
const domain = 'https://casabinorda.org'; // Domain adınızı buraya girin
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD formatında bugünün tarihi

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Ana Sayfalar -->
  <url>
    <loc>${domain}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/medicines</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${domain}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/active-ingredients</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- İlaç Detay Sayfaları -->
`;

// Her ilaç için URL ekle (/medicine/{etkin-madde-slug}/{ilaç-adı-slug} formatında)
medicines.forEach(medicine => {
  const activeIngredientSlug = createSlug(medicine.activeIngredient);
  const nameSlug = createSlug(medicine.name);
  
  sitemap += `  <url>
    <loc>${domain}/medicine/${activeIngredientSlug}/${nameSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
});

// Her etkin madde için URL ekle
uniqueActiveIngredients.forEach(ingredient => {
  const ingredientSlug = createSlug(ingredient);
  
  sitemap += `  <url>
    <loc>${domain}/active-ingredient/${ingredientSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
});

sitemap += `</urlset>`;

// Sitemap dosyasını public klasörüne yaz
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);

console.log(`Sitemap başarıyla oluşturuldu: ${sitemapPath}`);

// robots.txt dosyasını da oluştur
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${domain}/sitemap.xml`;

const robotsPath = path.join(__dirname, '../public/robots.txt');
fs.writeFileSync(robotsPath, robotsTxt);

console.log(`robots.txt başarıyla oluşturuldu: ${robotsPath}`);
