const sharp = require("sharp");
const path = require("path");

async function checkCornerPixels(filename) {
  const filePath = path.join(__dirname, "public/mascot", filename);
  console.log(`Checking ${filename}...`);
  
  const image = sharp(filePath);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  
  // Extract a 32x32 area from the top-left corner
  const buffer = await image.extract({ left: 0, top: 0, width: 32, height: 32 }).raw().toBuffer();
  
  // Print the RGB of first few pixels in the first few rows
  for (let y = 0; y < 4; y++) {
    let line = "";
    for (let x = 0; x < 4; x++) {
      const idx = (y * 32 + x) * 4;
      const r = buffer[idx];
      const g = buffer[idx + 1];
      const b = buffer[idx + 2];
      line += `(${r},${g},${b}) `;
    }
    console.log(`Row ${y}: ${line}`);
  }
}

checkCornerPixels("thinking.png").catch(console.error);
