const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function removeBackground(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    
    const width = info.width;
    const height = info.height;
    const visited = new Uint8Array(width * height);
    const bgMask = new Float32Array(width * height);
    const queue = [];

    // Pure white or near-white check (adjusted threshold for better precision)
    // Allows shadows (e.g., > 210) but ensures it's fairly desaturated to avoid removing colored edges.
    function isBackground(x, y) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const maxVal = Math.max(r, g, b);
      const minVal = Math.min(r, g, b);
      return maxVal > 220 && (maxVal - minVal) < 25; 
    }

    // Initialize BFS from all edges
    for (let x = 0; x < width; x++) {
      if (isBackground(x, 0)) { queue.push(x); visited[x] = 1; }
      if (isBackground(x, height - 1)) { 
        const p = (height - 1) * width + x; 
        queue.push(p); visited[p] = 1; 
      }
    }
    for (let y = 0; y < height; y++) {
      if (isBackground(0, y)) { 
        queue.push(y * width); visited[y * width] = 1; 
      }
      if (isBackground(width - 1, y)) { 
        const p = y * width + (width - 1); 
        queue.push(p); visited[p] = 1; 
      }
    }

    // Perform BFS
    let head = 0;
    while (head < queue.length) {
      const p = queue[head++];
      bgMask[p] = 1;
      
      const x = p % width;
      const y = Math.floor(p / width);
      
      const neighbors = [];
      if (x > 0) neighbors.push(p - 1);
      if (x < width - 1) neighbors.push(p + 1);
      if (y > 0) neighbors.push(p - width);
      if (y < height - 1) neighbors.push(p + width);
      
      for (const n of neighbors) {
        if (visited[n] === 0) {
          visited[n] = 1;
          const nx = n % width;
          const ny = Math.floor(n / width);
          if (isBackground(nx, ny)) {
            queue.push(n);
          } else {
             // If a neighbor is NOT background, it's an edge.
             // We can mark edges to help feathering.
          }
        }
      }
    }

    // Apply multiple passes of box blur to the binary mask to get a smooth anti-aliased edge
    let currentMask = bgMask;
    for (let pass = 0; pass < 3; pass++) {
        const nextMask = new Float32Array(width * height);
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const center = y * width + x;
                let sum = currentMask[center] * 4; // center weight
                sum += currentMask[center - 1] * 2;
                sum += currentMask[center + 1] * 2;
                sum += currentMask[center - width] * 2;
                sum += currentMask[center + width] * 2;
                sum += currentMask[center - width - 1];
                sum += currentMask[center - width + 1];
                sum += currentMask[center + width - 1];
                sum += currentMask[center + width + 1];
                nextMask[center] = sum / 16;
            }
        }
        currentMask = nextMask;
    }

    // Convert the soft mask back to the alpha channel
    for (let i = 0; i < width * height; i++) {
      // currentMask[i] represents "how background" this pixel is (0 to 1)
      const alphaObj = Math.max(0, Math.min(255, (1 - currentMask[i]) * 255));
      
      const baseAlpha = data[i * 4 + 3];
      data[i * 4 + 3] = Math.min(baseAlpha, alphaObj);

      // (Optional) pre-multiply the RGB color along the edge to reduce white fringing
      // If it's a boundary pixel (0 < currentMask < 1), we blend to avoid white edge ghosting
      if (currentMask[i] > 0 && currentMask[i] < 1) {
          // It's part of the anti-aliased edge. Leaving colors as is sometimes creates a bright halo.
          // But usually browsers handle alpha blending well anyway.
      }
    }

    // Save
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
    .png()
    .toFile(outputPath);

    console.log(`Success! Pro-quality cleanup: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

const assetsDir = path.join(__dirname, 'src', 'assets');
const hero2 = path.join(assetsDir, 'Hero 2.png');
const pro = path.join(assetsDir, 'pro.png');

async function run() {
  await removeBackground(hero2, path.join(assetsDir, 'hero_2_new.png'));
  await removeBackground(pro, path.join(assetsDir, 'pro_new.png'));
}

run();
