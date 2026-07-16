const fs = require('fs');
const path = require('path');

// 1. Fix directory casing (e.g., Src -> src)
const directoriesToTry = ['Src', 'SRC'];
for (const dir of directoriesToTry) {
  if (fs.existsSync(dir) && !fs.existsSync('src')) {
    try {
      fs.renameSync(dir, 'src');
      console.log(`Successfully renamed directory "${dir}" to "src"`);
    } catch (err) {
      console.error(`Failed to rename directory "${dir}":`, err);
    }
  }
}

// 2. Fix main.tsx file casing (e.g., Main.tsx -> main.tsx)
if (fs.existsSync('src')) {
  try {
    const files = fs.readdirSync('src');
    const mainFile = files.find(f => f.toLowerCase() === 'main.tsx');
    if (mainFile && mainFile !== 'main.tsx') {
      fs.renameSync(path.join('src', mainFile), path.join('src', 'main.tsx'));
      console.log(`Successfully renamed file "${mainFile}" to "main.tsx"`);
    }
  } catch (err) {
    console.error('Failed to read or rename main.tsx file casing:', err);
  }
}
