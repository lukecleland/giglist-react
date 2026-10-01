const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const build = path.join(root, 'build');
if (!fs.existsSync(path.join(build, 'index.html'))) {
    throw new Error('Build the React app before packaging PHP endpoints.');
}

// Keep server code out of public/: the development server cannot execute PHP.
// Run after CRA so these dynamic endpoints are not added to the offline cache.
const endpoints = ['gigstatssimple.php', 'gigstatsfeed.php'];
for (const endpoint of endpoints) {
    fs.copyFileSync(path.join(root, endpoint), path.join(build, endpoint));
}
console.log(`Packaged PHP endpoints: ${endpoints.join(', ')}`);
