import fs from 'node:fs';
import path from 'node:path';

const bannedWords = [
  'seamless', 'unlock', 'elevate', 'journey', 'empower',
  'curated', 'gateway', 'immerse', 'authentic experience',
  'hidden gems', 'tapestry', 'vibrant', 'nestled', 'embark',
  'premium', 'unique', 'beyond the ordinary'
];

const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

const checkDirs = ['app', 'components', 'lib', 'supabase/migrations', 'tests'];
let failed = false;

function scan(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (f !== 'node_modules' && f !== '.next') scan(full);
    } else if (/\.(ts|tsx|sql|json|md)$/.test(f)) {
      const content = fs.readFileSync(full, 'utf8');
      if (emojiRegex.test(content)) {
        console.error(`Emoji found in ${full}`);
        failed = true;
      }
      for (const w of bannedWords) {
        if (/\.(tsx|ts|md)$/.test(f)) {
          const regex = new RegExp(`\\b${w}\\b`, 'i');
          if (regex.test(content)) {
            console.error(`Banned word "${w}" found in ${full}`);
            failed = true;
          }
        }
      }
    }
  }
}

for (const d of checkDirs) {
  scan(d);
}

if (!failed) {
  console.log('Zero emojis and zero banned words check PASSED cleanly.');
} else {
  process.exit(1);
}

