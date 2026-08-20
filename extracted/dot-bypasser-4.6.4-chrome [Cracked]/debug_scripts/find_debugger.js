const fs = require('fs');
const path = 'c:\\Users\\Administrator\\Desktop\\dot-bypasser-4.6.3-chrome\\dot-bypasser-4.6.4-chrome\\background.js';
let content = fs.readFileSync(path, 'utf8');
if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);

const re = /debugger;/g;
let m, count = 0;
const results = [];
while ((m = re.exec(content)) !== null) {
  count++;
  const start = Math.max(0, m.index - 60);
  const end = Math.min(content.length, m.index + 60);
  results.push({ index: m.index, ctx: content.slice(start, end) });
}
console.log('Total debugger; count:', count);
results.forEach((r, i) => {
  console.log(`\n--- #${i + 1} at char ${r.index} ---`);
  console.log(r.ctx);
});
