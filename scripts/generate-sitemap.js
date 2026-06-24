const fs = require("fs");
const path = require("path");
const https = require("https");

const SITE_URL = "https://giglist.com.au";
const FEED_URLS = [
    "https://giglist.com.au/feed_national.php",
    "http://giglist.com.au/feed_national.php",
    "https://www.giglist.com.au/feed_national.php",
];

const STATIC_ROUTES = [
    { loc: `${SITE_URL}/`, changefreq: "hourly", priority: "1.0" },
    { loc: `${SITE_URL}/gigmap`, changefreq: "daily", priority: "0.9" },
    { loc: `${SITE_URL}/about`, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE_URL}/submit`, changefreq: "weekly", priority: "0.7" },
    { loc: `${SITE_URL}/supporters`, changefreq: "weekly", priority: "0.5" },
];

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith("https://")
            ? require("https")
            : require("http");

        const request = client.get(
            url,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                    Accept: "application/json,text/plain,*/*",
                },
            },
            (res) => {
                if (res.statusCode !== 200) {
                    reject(
                        new Error(
                            `Failed to fetch ${url} (status ${res.statusCode})`,
                        ),
                    );
                    return;
                }

                let data = "";
                res.on("data", (chunk) => {
                    data += chunk;
                });

                res.on("end", () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        reject(error);
                    }
                });
            },
        );

        request.on("error", reject);
    });
}

async function fetchFeed() {
    let lastError;

    for (const url of FEED_URLS) {
        try {
            return await fetchJson(url);
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError;
}

function slugifySegment(value) {
    const normalized = (value || "")
        .replace(/&amp;/gi, "and")
        .replace(/&/g, " and ")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const slug = normalized
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");

    return slug || "gig";
}

function toEventPath(artist, venue, date) {
    return `/gig-${slugifySegment(artist)}-${slugifySegment(venue)}-${slugifySegment(date)}`;
}

function escapeXml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function buildUrlSet(entries) {
    const rows = entries
        .map((entry) => {
            const parts = ["  <url>", `    <loc>${escapeXml(entry.loc)}</loc>`];

            if (entry.lastmod) {
                parts.push(
                    `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`,
                );
            }

            if (entry.changefreq) {
                parts.push(
                    `    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`,
                );
            }

            if (entry.priority) {
                parts.push(
                    `    <priority>${escapeXml(entry.priority)}</priority>`,
                );
            }

            parts.push("  </url>");
            return parts.join("\n");
        })
        .join("\n");

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        rows,
        "</urlset>",
        "",
    ].join("\n");
}

function buildSitemapIndex(files) {
    const rows = files
        .map((file) => {
            const now = new Date().toISOString();
            return [
                "  <sitemap>",
                `    <loc>${escapeXml(`${SITE_URL}/${file}`)}</loc>`,
                `    <lastmod>${escapeXml(now)}</lastmod>`,
                "  </sitemap>",
            ].join("\n");
        })
        .join("\n");

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        rows,
        "</sitemapindex>",
        "",
    ].join("\n");
}

async function generate() {
    const feed = await fetchFeed();

    const eventsByUrl = new Map();

    for (const day of feed || []) {
        const listings = Array.isArray(day.listings) ? day.listings : [];

        for (const listing of listings) {
            if (!listing || !listing.artist || !listing.name || !listing.date) {
                continue;
            }

            const url = `${SITE_URL}${toEventPath(
                listing.artist,
                listing.name,
                listing.date,
            )}`;

            if (!eventsByUrl.has(url)) {
                eventsByUrl.set(url, {
                    loc: url,
                    lastmod: listing.date,
                    changefreq: "daily",
                    priority: "0.8",
                });
            }
        }
    }

    const eventEntries = Array.from(eventsByUrl.values()).sort((a, b) =>
        a.loc.localeCompare(b.loc),
    );

    const publicDir = path.join(process.cwd(), "/home/giglistc/public_html/");
    const staticSitemapPath = path.join(publicDir, "sitemap-static.xml");
    const eventsSitemapPath = path.join(publicDir, "sitemap-events.xml");
    const indexSitemapPath = path.join(publicDir, "sitemap.xml");

    fs.writeFileSync(staticSitemapPath, buildUrlSet(STATIC_ROUTES), "utf8");
    fs.writeFileSync(eventsSitemapPath, buildUrlSet(eventEntries), "utf8");
    fs.writeFileSync(
        indexSitemapPath,
        buildSitemapIndex(["sitemap-static.xml", "sitemap-events.xml"]),
        "utf8",
    );

    console.log(`Generated ${eventEntries.length} event URLs`);
    console.log(`Wrote ${path.relative(process.cwd(), staticSitemapPath)}`);
    console.log(`Wrote ${path.relative(process.cwd(), eventsSitemapPath)}`);
    console.log(`Wrote ${path.relative(process.cwd(), indexSitemapPath)}`);
}

generate().catch((error) => {
    console.error("Sitemap generation failed:", error);
    process.exit(1);
});
