import https from 'https';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function isNeutralOrCardBg(hex) {
  const upper = hex.toUpperCase();
  return ['#FCFCFC', '#FFFFFF', '#FAFAFA', '#FBFBFB', '#F5F5F5', '#F7F7F7'].includes(upper);
}

async function main() {
  console.log('Fetching Figma color combinations page...');
  const html = await fetchUrl('https://www.figma.com/resource-library/color-combinations/');
  
  const h3s = [];
  const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
  let hm;
  while ((hm = h3Regex.exec(html)) !== null) {
    h3s.push({ title: hm[1].replace(/<[^>]+>/g, '').trim(), index: hm.index });
  }

  const reg = /<h4 id="(combination-\d+[^"]*)"[^>]*>[\s\S]*?<strong>Combination\s*(\d+):\s*([^<]+)<\/strong>[\s\S]*?<img[^>]*src="([^"]+)"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  const rawList = [];
  while ((match = reg.exec(html)) !== null) {
    const num = parseInt(match[2]);
    const name = match[3].replace(/&nbsp;|\s+/g, ' ').trim();
    const img = match[4].replace(/&amp;/g, '&');
    const desc = match[5].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    
    let category = 'Monochromatic';
    for (const h of h3s) {
      if (h.index < match.index && h.title.toLowerCase().includes('color combinations')) {
        category = h.title.replace(/color combinations/i, '').trim();
      }
    }

    rawList.push({ num, name, img, desc, category });
  }

  console.log(`Found ${rawList.length} Figma combinations. Extracting palettes...`);
  
  // Ensure cache directory
  const cacheDir = path.resolve('scripts/cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const results = [];
  const BATCH_SIZE = 10;
  for (let i = 0; i < rawList.length; i += BATCH_SIZE) {
    const batch = rawList.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (item) => {
      const imgPath = path.join(cacheDir, `combo_${item.num}.png`);
      try {
        if (!fs.existsSync(imgPath)) {
          execSync(`curl -sL --max-time 15 "${item.img}" -o "${imgPath}"`);
        }
        const hist = execSync(`convert "${imgPath}" -colors 16 -depth 8 -format "%c\\n" histogram:info: | sort -nr | head -n 12`).toString();
        
        const extractedColors = [];
        const lines = hist.trim().split('\n');
        for (const line of lines) {
          const m = line.match(/#([0-9a-fA-F]{6})/);
          if (m) {
            const hex = '#' + m[1].toLowerCase();
            if (!isNeutralOrCardBg(hex) && !extractedColors.includes(hex)) {
              extractedColors.push(hex);
            }
          }
        }
        
        const palette = extractedColors.slice(0, 5);
        results.push({ ...item, palette });
      } catch (err) {
        console.error(`Error combo ${item.num}:`, err.message);
        results.push({ ...item, palette: ['#3b82f6', '#6366f1', '#06b6d4', '#f43f5e'] });
      }
    }));
  }
  
  results.sort((a, b) => a.num - b.num);
  console.log(`Successfully processed ${results.length} combinations.`);

  // Write as both JSON and clean TypeScript module
  const outJson = path.resolve('src/data/figmaColorCombinations.json');
  fs.writeFileSync(outJson, JSON.stringify(results, null, 2));

  console.log('Saved to src/data/figmaColorCombinations.json');
}

main().catch(console.error);
