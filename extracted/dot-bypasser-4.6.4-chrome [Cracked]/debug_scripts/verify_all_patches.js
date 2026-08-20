// Verify toàn bộ 4 patch đã áp đúng vào background.js của dot-bypasser 4.6.4,
// và file vẫn là valid JS sau khi patch.

const fs = require('fs');
const path = 'c:\\Users\\Administrator\\Desktop\\dot-bypasser-4.6.3-chrome\\dot-bypasser-4.6.4-chrome\\background.js';
let content = fs.readFileSync(path, 'utf8');
if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);

const checks = [
  ['Patch4 storage init at start', content.startsWith('chrome.storage.local.set({"enabled":true,"hasAgreedDisclaimer":true,"3dBypass":true});')],
  ['Patch1 debugger removed (old absent)', !content.includes('"use strict";debugger;var[[],gIEirS7]=arguments;')],
  ['Patch1 replacement present', content.includes('"use strict";var[[],gIEirS7]=arguments;')],
  ['Patch2 RFuuNN no-op', content.includes('async function RFuuNN(...FmNVXA){}')],
  ['Patch2 old body absent', !content.includes('async function RFuuNN(...FmNVXA){var cq6P9M={get[AEEo2JT(LYd9Mn[0x2d2])]')],
  ['Patch3 MFt6ZT override', content.includes('async function MFt6ZT(...FmNVXA){zfkr2n=true;srdZism=true;return{success:true,premium:true,valid:true}}')],
  ['Patch3 old body absent', !content.includes('async function MFt6ZT(...FmNVXA){var cq6P9M={get[AEEo2JT(LYd9Mn[0x1e2f])]')],
];
let allOk = true;
for (const [label, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} - ${label}`);
  if (!ok) allOk = false;
}

const debuggerCount = content.split('debugger;').length - 1;
console.log('debugger; count (expect 20):', debuggerCount);
if (debuggerCount !== 20) allOk = false;

try {
  new Function(content);
  console.log('PASS - full file parses as valid JS (new Function)');
} catch (e) {
  console.log('FAIL - syntax error:', e.message);
  allOk = false;
}

console.log('\n=== OVERALL:', allOk ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED', '===');
