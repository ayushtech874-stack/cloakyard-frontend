const sharp = require('sharp');

async function processLogo() {
  try {
    console.log("Processing logo...");
    await sharp('public/logo.jpeg')
      .trim({ background: '#000000', threshold: 15 }) // Increased threshold slightly for jpeg compression artifacts
      .toFile('public/logo-cropped.png');
      
    console.log("Logo trimmed and saved to public/logo-cropped.png");
  } catch (err) {
    console.error(err);
  }
}

processLogo();
