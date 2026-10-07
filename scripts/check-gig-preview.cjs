// Inspect the server response, without React or a browser modifying the metadata.
const https = require('https');
const target = process.argv[2];
if (!target || !/^https:\/\/giglist\.com\.au\/gig-[^/?#]+\/?$/.test(target)) {
    console.error('Usage: node scripts/check-gig-preview.cjs https://giglist.com.au/gig-…');
    process.exit(1);
}
const request = https.get(target, { headers: { 'User-Agent': 'facebookexternalhit/1.1' } }, response => {
    let html = '';
    response.setEncoding('utf8');
    response.on('data', chunk => { html += chunk; });
    response.on('end', () => {
        const tags = {};
        for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
            const property = /property=["'](og:[^"']+)["']/i.exec(tag);
            const content = /content=(["'])(.*?)\1/i.exec(tag);
            if (property && content) tags[property[1]] = content[2];
        }
        console.log(JSON.stringify({ status: response.statusCode, ...tags }, null, 2));
        if (response.statusCode !== 200 || tags['og:url'] !== target.replace(/\/$/, '') ||
            !tags['og:title'] || tags['og:title'].startsWith('Giglist |') ||
            !tags['og:description'] || !/^https?:\/\//.test(tags['og:image'] || '') ||
            /favicon/i.test(tags['og:image'])) {
            console.error('FAIL: the public gig URL is not serving event-specific Open Graph metadata. Check that gig-preview.php is deployed and its rewrite rule precedes every SPA fallback, including parent-directory rules.');
            process.exitCode = 1;
        } else {
            console.log('PASS: the gig URL serves its own title, description, image and canonical URL.');
        }
    });
});
request.setTimeout(20000, () => request.destroy(new Error('Preview request timed out')));
request.on('error', error => { console.error(error.message); process.exitCode = 1; });
