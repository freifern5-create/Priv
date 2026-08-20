// Áp Patch 5 — nullify fingerprint condition chain trong popup, khiến component
// "Unofficial Source" không bao giờ render. ĐÂY LÀ PATCH QUAN TRỌNG NHẤT cho popup UI —
// patch 1-4 (background.js) không đủ, popup tự đánh giá điều kiện này độc lập lúc mount.

const fs = require('fs');
const path = 'c:\\Users\\Administrator\\Desktop\\dot-bypasser-4.6.3-chrome\\dot-bypasser-4.6.4-chrome\\chunks\\main-B76wFczZ.js';
let content = fs.readFileSync(path, 'utf8');
const hadBOM = content.charCodeAt(0) === 0xFEFF;
if (hadBOM) content = content.slice(1);

const oldStr = '(oc()||!(await wp()))';
const newStr = '(false)';

if (content.includes(newStr) && !content.includes(oldStr)) {
  console.log('Patch5 already applied, skipping.');
} else {
  const count = content.split(oldStr).length - 1;
  if (count !== 1) throw new Error('Expected exactly 1 occurrence of old_string, found ' + count);
  content = content.replace(oldStr, newStr);
  console.log('Patch5 applied.');
}

const out = (hadBOM ? '﻿' : '') + content;
fs.writeFileSync(path, out, 'utf8');
console.log('WRITTEN, new length (chars):', out.length);

// main-*.js là ES module (chứa import/export) -> new Function() sẽ báo lỗi sai (không phải
// lỗi thật). Copy sang .mjs tạm để check cú pháp đúng cách nếu cần:
//   Copy-Item main-B76wFczZ.js temp.mjs; node --check temp.mjs
