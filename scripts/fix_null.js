const fs = require('fs');
const c = fs.readFileSync('src/components/AdminDashboard.tsx', 'latin1');
// Find null bytes near line 2838 (the error line)
const lineNum = 2837; const searchStart = Math.max(0, lineNum - 100);
const searchEnd = Math.min(c.length, lineNum + 100);
const segment = c.substring(searchStart, searchEnd);
const nullPositions = [];
for (let i = 0; i < segment.length; i++) {
  const code = segment.charCodeAt(i);
  if (code === 0) nullPositions.push({ pos: searchStart + i, byte: 0 });
}
console.log('Found null bytes:', nullPositions);
// Remove them
let result = c.slice(0, searchStart);
for (const pos of nullPositions.sort((a,b) => b - a)) {
  result = result.slice(0, pos) + c.slice(pos + 1);
}
fs.writeFileSync('src/components/AdminDashboard.tsx', result);
console.log('Fixed', nullPositions.length, 'bytes removed');
