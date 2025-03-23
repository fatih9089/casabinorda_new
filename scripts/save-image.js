const fs = require('fs');
const path = require('path');

// Resim verisini al (base64 formatında)
const imageData = process.argv[2];
const outputPath = process.argv[3];

// Base64 formatındaki veriyi ayıkla
const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
const buffer = Buffer.from(base64Data, 'base64');

// Dosya yolunu oluştur
const fullPath = path.resolve(outputPath);

// Resmi kaydet
fs.writeFileSync(fullPath, buffer);
console.log(`Resim başarıyla kaydedildi: ${fullPath}`);
