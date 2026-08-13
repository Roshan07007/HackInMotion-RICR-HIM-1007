const fs = require('fs');
const path = require('path');

const dirs = ['server/src', 'client/src', 'mobile/src'];

const walkSync = (dir, callback) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile() && /\.(ts|tsx|js|jsx)$/.test(filepath)) {
      callback(filepath);
    }
  });
};

const processFile = (filepath) => {
  // skip logger itself and seed scripts
  if (filepath.includes('logger.ts') || filepath.includes('seedJobs.ts')) return;

  let content = fs.readFileSync(filepath, 'utf8');
  let newContent = content.replace(/^.*console\.log\(.*$/gm, '');
  if (content !== newContent) {
    fs.writeFileSync(filepath, newContent, 'utf8');
    console.log(`Removed console.log from ${filepath}`);
  }
};

dirs.forEach(dir => walkSync(dir, processFile));
