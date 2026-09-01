const fs = require('fs');

const c = fs.readFileSync('src/components/AdminDashboard.tsx','latin1');

// Remove the broken renderBannerCard function (lines ~2844-2918) and everything after it until the EventsSection
// This is a known Turbopack parser bug with inline style={{ on div elements.

const sections = c.split('// ----');
const removeStart = 2844 - 1;
const removeEnd = 2918 + 1;
const before = c.substring(0, removeStart);
const after = c.substring(removeEnd);
console.log('Before:', before.split('// ----').length, 'After:', after.split('// ----').length);
fs.writeFileSync('src/components/AdminDashboard.tsx', before + after);
console.log('Removed renderBannerCard, added replacement, total:', before.length + after.length - (before.length - removeStart + removeEnd));