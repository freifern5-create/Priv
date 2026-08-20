// Decode plain-text chrome.storage.local key names ("enabled", "hasAgreedDisclaimer")
// từ chunks/main-B76wFczZ.js (popup Vue3 bundle) của dot-bypasser 4.6.4.
//
// Method: obfuscator dùng multi-layer string encoding tương tự bản 4.6.3
// (xem CLAUDE.md gốc, mục "Obfuscation pattern"), nhưng tên biến/hàm đổi hết:
//   jxOLet    = mảng index-literal (tương đương bTwDubP ở 4.6.3), bọc trong NRAfSfY([...],0x14)
//   h8vJCn    = LZString decompressor object (tương đương luhCq_t)
//   tJTOkf1   = lookup theo __globalObject split (tương đương ly7f2Nj)
//   D2lm0p    = mảng cache compressed-string (tương đương XfXnYea)
//   RaIEi3x   = object cache kết quả decode (tương đương YEJIed)
//   IC1DGRw   = decoder LZString 91-char alphabet (tương đương Rk1aI6v)
//   w0wvwar   = cache wrapper cuối, hàm decode public (tương đương x8JxlXS)
//   nQjrUP    = helper self-nulling dùng như comma-expression side-effect (tương đương xsIb64)
//   z6EHfM5   = utf8-bytes-to-string helper (tương đương xrGWQD)
//
// Khác với decode_keys.js bản 4.6.3 (dùng offset ký tự hardcode, dễ vỡ khi file đổi),
// script này extract theo MARKER TEXT ổn định (tên hàm/biến literal, không phải char offset)
// nên robust hơn nếu obfuscator giữ tên biến nhưng đổi nội dung xung quanh.
//
// Index 0x1266/0x78/0x1267/0x1268/0x1183/0x2be là vị trí literal tìm được bằng cách grep
// call site `nc=Ft(w0wvwar(jxOLet[...])+...)` / `Md=Ft(...)` trong main-B76wFczZ.js
// (Ft = wrapper useStorage() của @vueuse/core — xác nhận qua option keys decode ra đúng
// "writeDefaults"/"listenToStorageChanges").

const fs = require('fs');
const vm = require('vm');

const MAIN_JS_PATH = 'c:\\Users\\Administrator\\Desktop\\dot-bypasser-4.6.3-chrome\\dot-bypasser-4.6.4-chrome\\chunks\\main-B76wFczZ.js';
const src = fs.readFileSync(MAIN_JS_PATH, 'utf8');

function extractBalanced(src, startIdx) {
  let depth = 0, inStr = false, strCh = '', esc = false;
  for (let i = startIdx; i < src.length; i++) {
    const c = src[i];
    if (esc) { esc = false; continue; }
    if (inStr) {
      if (c === '\\') { esc = true; continue; }
      if (c === strCh) inStr = false;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = true; strCh = c; continue; }
    if (c === '(' || c === '[' || c === '{') depth++;
    else if (c === ')' || c === ']' || c === '}') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

function extractFunc(src, start) {
  let depth = 0, inStr = false, strCh = '', esc = false, started = false;
  for (let i = start; i < src.length; i++) {
    if (esc) { esc = false; continue; }
    if (inStr) {
      if (src[i] === '\\') { esc = true; continue; }
      if (src[i] === strCh) inStr = false;
      continue;
    }
    if (src[i] === '"' || src[i] === "'" || src[i] === '`') { inStr = true; strCh = src[i]; continue; }
    if (src[i] === '{') { depth++; started = true; }
    else if (src[i] === '}') { depth--; if (started && depth === 0) return src.slice(start, i + 1); }
  }
  return null;
}

const nrStart = src.indexOf('function NRAfSfY');
const arrOpenIdx = src.indexOf('[', src.indexOf('const jxOLet='));
const arrEndIdx = extractBalanced(src, arrOpenIdx);
const stmtEnd = src.indexOf(';', arrEndIdx) + 1;
const nrSrc = src.slice(nrStart, stmtEnd);

const nqDefIdx = src.indexOf('function nQjrUP(){nQjrUP=function(){}}');
const nqSrc = src.slice(nqDefIdx, nqDefIdx + 'function nQjrUP(){nQjrUP=function(){}}'.length);

const h8CallStart = src.indexOf('nQjrUP(h8vJCn=function(){');
const h8ParenOpen = h8CallStart + 'nQjrUP'.length;
const h8CallEnd = extractBalanced(src, h8ParenOpen);
const bigCallSrc = src.slice(h8CallStart, h8CallEnd + 1) + ';';

const icStart = src.indexOf('function IC1DGRw(');
const icSrc = extractFunc(src, icStart);

const zStart = src.indexOf('function z6EHfM5(');
const zSrc = extractFunc(src, zStart);

const wStart = src.indexOf('function w0wvwar(');
const wSrc = extractFunc(src, wStart);

const cacheCallStart = src.indexOf('nQjrUP(RaIEi3x={},D2lm0p=[');
const cacheParenOpen = cacheCallStart + 'nQjrUP'.length;
const cacheCallEnd = extractBalanced(src, cacheParenOpen);
const cacheCallSrc = src.slice(cacheCallStart, cacheCallEnd + 1) + ';';

const preamble = `
var h8vJCn, tJTOkf1, RaIEi3x, D2lm0p, __globalObject, __TextDecoder, __Uint8Array, __Buffer, __String, __Array, utf8ArrayToStr;
var module = { exports: {} };
__TextDecoder = TextDecoder;
__Uint8Array = Uint8Array;
`;

const diag = `
var __OUT = {};
__OUT.key1 = w0wvwar(jxOLet[0x1266]) + jxOLet[0x78];
__OUT.key1_default = !jxOLet[0x0];
__OUT.key2 = w0wvwar(jxOLet[0x1267]) + w0wvwar(jxOLet[0x1268]) + w0wvwar(jxOLet[0x1183]) + jxOLet[0x2be];
__OUT.key2_default = !jxOLet[0x4];
JSON.stringify(__OUT);
`;

const program = [preamble, nrSrc, nqSrc, bigCallSrc, icSrc, zSrc, wSrc, cacheCallSrc, diag].join('\n');

const result = vm.runInNewContext(program, {
  JSON, String, Array, Object, Math, parseInt, parseFloat,
  isNaN, isFinite, Number, Boolean, RegExp, Error, TypeError, console,
  TextDecoder, Uint8Array, Uint16Array, ArrayBuffer, define: undefined, angular: undefined
}, { timeout: 120000 });

console.log(JSON.stringify(JSON.parse(result), null, 2));
// Expected output: { "key1": "enabled", "key1_default": true, "key2": "hasAgreedDisclaimer", "key2_default": false }
