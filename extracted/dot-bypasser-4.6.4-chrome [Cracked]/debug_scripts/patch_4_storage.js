// Áp Patch 4 — inject chrome.storage.local.set({enabled:true, hasAgreedDisclaimer:true, ...})
// vào đầu background.js của dot-bypasser 4.6.4. Key names verify bằng decode_storage_keys.js
// (giữ nguyên "enabled"/"hasAgreedDisclaimer" so với bản 4.6.3).

const fs = require('fs');
const path = 'c:\\Users\\Administrator\\Desktop\\dot-bypasser-4.6.3-chrome\\dot-bypasser-4.6.4-chrome\\background.js';
let content = fs.readFileSync(path, 'utf8');
const hadBOM = content.charCodeAt(0) === 0xFEFF;
if (hadBOM) content = content.slice(1);

const inject = 'chrome.storage.local.set({"enabled":true,"hasAgreedDisclaimer":true,"3dBypass":true});';

if (content.startsWith(inject)) {
  console.log('Patch4 already applied, skipping.');
} else {
  content = inject + content;
  console.log('Patch4 injected.');
}

const out = (hadBOM ? '﻿' : '') + content;
fs.writeFileSync(path, out, 'utf8');
console.log('WRITTEN, new length (chars):', out.length);

try {
  new Function(content);
  console.log('SYNTAX OK (new Function parse)');
} catch (e) {
  console.error('SYNTAX ERROR:', e.message);
}
