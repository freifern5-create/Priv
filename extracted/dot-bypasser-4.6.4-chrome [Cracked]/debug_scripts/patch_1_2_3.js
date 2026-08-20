// Áp Patch 1 (xoá debugger; trong message dispatcher K5BKUy),
// Patch 2 (no-op RFuuNN — integrity check trigger unofficial popup),
// Patch 3 (override MFt6ZT — license validation trả premium giả)
// vào background.js của dot-bypasser 4.6.4. Xem CLAUDE.md để biết chi tiết từng patch.

const fs = require('fs');
const path = 'c:\\Users\\Administrator\\Desktop\\dot-bypasser-4.6.3-chrome\\dot-bypasser-4.6.4-chrome\\background.js';
let content = fs.readFileSync(path, 'utf8');
const hadBOM = content.charCodeAt(0) === 0xFEFF;
if (hadBOM) content = content.slice(1);

function applyPatch(label, oldStr, newStr) {
  const count = content.split(oldStr).length - 1;
  if (count !== 1) {
    throw new Error(`[${label}] expected exactly 1 occurrence, found ${count}`);
  }
  content = content.replace(oldStr, newStr);
  console.log(`[${label}] OK (len ${oldStr.length} -> ${newStr.length})`);
}

applyPatch(
  'Patch1-debugger',
  '"use strict";debugger;var[[],gIEirS7]=arguments;',
  '"use strict";var[[],gIEirS7]=arguments;'
);

applyPatch(
  'Patch2-noop-RFuuNN',
  'async function RFuuNN(...FmNVXA){var cq6P9M={get[AEEo2JT(LYd9Mn[0x2d2])](){return mTx3UvZ},get[AEEo2JT(LYd9Mn[0x2d7])+LYd9Mn[0x2d8]](){return oTxqo9},set[AEEo2JT(LYd9Mn[0x2d7])+LYd9Mn[0x2d8]](FmNVXA){oTxqo9=FmNVXA},get[AEEo2JT(LYd9Mn[0x2da])+LYd9Mn[0x40]](){return YRDNEy},[AEEo2JT(LYd9Mn[0x2d0])](...FmNVXA){return JNejtk(...FmNVXA)},[AEEo2JT(LYd9Mn[0x2e1])](...FmNVXA){return Jn4Q4ex(...FmNVXA)},[AEEo2JT(LYd9Mn[0x2e5])](...FmNVXA){return d4UcvP(...FmNVXA)},[AEEo2JT(LYd9Mn[0x2ec])+LYd9Mn[0x118]](...FmNVXA){return o4mI3u(...FmNVXA)}};return Ir4VQL0(FmNVXA,cq6P9M)}',
  'async function RFuuNN(...FmNVXA){}'
);

applyPatch(
  'Patch3-override-MFt6ZT',
  'async function MFt6ZT(...FmNVXA){var cq6P9M={get[AEEo2JT(LYd9Mn[0x1e2f])](){return zfkr2n},set[AEEo2JT(LYd9Mn[0x1e2f])](FmNVXA){zfkr2n=FmNVXA},[AEEo2JT(LYd9Mn[0x2ac])](...FmNVXA){return ydPo9h(...FmNVXA)},[AEEo2JT(0x1f2c)](...FmNVXA){return TaVoqC(...FmNVXA)},[AEEo2JT(0x1f2d)+LYd9Mn[0x2bc]](...FmNVXA){return Jn4Q4ex(...FmNVXA)},[AEEo2JT(0x1f2e)](...FmNVXA){return VsZ64dd(...FmNVXA)},[AEEo2JT(0x1f2f)](...FmNVXA){return Jg36lsf(...FmNVXA)}};return SCk9of(FmNVXA,cq6P9M)}',
  'async function MFt6ZT(...FmNVXA){zfkr2n=true;srdZism=true;return{success:true,premium:true,valid:true}}'
);

const out = (hadBOM ? '﻿' : '') + content;
fs.writeFileSync(path, out, 'utf8');
console.log('WRITTEN, new length (chars):', out.length);

try {
  new Function(content);
  console.log('SYNTAX OK (new Function parse)');
} catch (e) {
  console.error('SYNTAX ERROR:', e.message);
}
