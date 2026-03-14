const sharp = require('sharp');
const path = require('path');

async function removeWhiteBackground(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    
    // Convert the image to 4 channels (RGBA) and ensure it has an alpha channel
    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Process each pixel
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // If the pixel is close to white (threshold 235), make it transparent
      if (r > 235 && g > 235 && b > 235) {
        data[i + 3] = 0; // Alpha channel to 0
      }
    }

    // Save the processed image
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
    .png()
    .toFile(outputPath);

    console.log(`Processed: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

const assetsDir = path.join(__dirname, 'src', 'assets');
const hero2 = path.join(assetsDir, 'Hero 2.png');
const pro = path.join(assetsDir, 'pro.png');

async function run() {
  await removeWhiteBackground(hero2, path.join(assetsDir, 'hero_2_new.png'));
  await removeWhiteBackground(pro, path.join(assetsDir, 'pro_new.png'));
}

run();
