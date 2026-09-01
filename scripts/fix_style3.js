const fs = require('fs');
const file = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
let result = file;

// Replace \u2713 (✓) with \u2713
// \u2713 is U+2713 = ✓ in JSX, which Turbopack rejects.
// In the EventsSection renderEventCard publish toggle, we already use P/D.
result = result.replace(/\u2713/g, '✓');

fs.writeFileSync('src/components/AdminDashboard.tsx', result);
console.log('Fixed');
