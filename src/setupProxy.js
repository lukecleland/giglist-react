const https = require('https');

// Keep venue photos on the development origin so canvas PNG exports remain readable.
module.exports = function (app) {
    app.get(/^\/wp-content\/uploads\/.*\.(?:jpe?g|png|webp|gif)$/i, (req, res) => {
        const upstream = https.get(new URL(req.originalUrl, 'https://giglist.com.au'), (image) => {
            res.status(image.statusCode || 502);
            for (const header of ['content-type', 'cache-control', 'last-modified']) {
                if (image.headers[header]) res.setHeader(header, image.headers[header]);
            }
            image.pipe(res);
        });
        upstream.setTimeout(10000, () => upstream.destroy(new Error('Venue image timeout')));
        upstream.on('error', () => {
            if (!res.headersSent) res.status(502).send('Venue image unavailable');
            else res.destroy();
        });
        res.on('close', () => upstream.destroy());
    });
};
