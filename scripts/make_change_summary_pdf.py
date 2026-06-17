from fpdf import FPDF

OUT_PATH = "CHANGE_SUMMARY_2026-06-17.pdf"

sections = [
    (
        "Location and Modal UX",
        [
            "Removed automatic first-visit location modal opening so users can choose location later.",
            "Set/kept default location behavior at postcode 0000 (national view).",
            "Header postcode now shows National when postcode is 0000 or 0.",
            "Replaced Semantic UI listing modal with a custom React overlay modal.",
            "Improved listing modal visuals: vertical centering, white border, 20px radius.",
        ],
    ),
    (
        "Runtime Warning/Error Fixes",
        [
            "Removed debug console logs from location/data paths.",
            "Fixed missing React list key warning in listing rendering.",
            "Resolved malformed URI exceptions in listing text handling.",
            "Migrated page-level helmet usage from react-helmet to react-helmet-async.",
        ],
    ),
    (
        "Gig Ads Stability",
        [
            "Fixed national postcode behavior so active ads are shown for national mode.",
            "Added safe handling for empty/malformed ad data.",
            "Prevented ad index/modulo issues when no ads are available.",
        ],
    ),
    (
        "Gig Map Preview Improvements",
        [
            "Reworked marker InfoWindow content into a cleaner preview card.",
            "Added venue/location image with improved layout and readability.",
            "Removed temporary OPEN LISTING button.",
            "Styled preview card to match modal tone (dark card, white border, rounded corners).",
        ],
    ),
    (
        "SEO Improvements",
        [
            "Enhanced global metadata in public/index.html (title, description, OG/Twitter tags, robots).",
            "Added page-specific metadata on Home, About, Submit, and Gig Map pages.",
            "Improved event page metadata (title/description/OG/Twitter) and image fallback.",
            "Extended Event schema with canonical event URL and ISO date-time formatting.",
            "Added robots.txt and sitemap setup with index structure.",
        ],
    ),
    (
        "Sitemap Automation (Option 2)",
        [
            "Created scripts/generate-sitemap.js.",
            "Script outputs sitemap-static.xml, sitemap-events.xml, and sitemap.xml index.",
            "Added npm scripts generate:sitemap and seo:refresh.",
            "Hardened feed fetch logic to avoid endpoint blocking (418) with browser-like headers/fallback.",
            "Validated generation with thousands of event URLs.",
        ],
    ),
    (
        "URL Canonicalization and Compatibility",
        [
            "Added shared URL utility for event paths/URLs and normalized slug creation.",
            "Wired utility across routing, schema, page canonicals, hidden links, and sitemap generation.",
            "Added legacy event route redirects so older slug links resolve to canonical paths.",
        ],
    ),
    (
        "Notes",
        [
            "Current setup supports scheduled sitemap regeneration via cron (recommended every 3 hours).",
            "After cron execution, ensure updated sitemap files are published by deploy/static hosting pipeline.",
        ],
    ),
]

pdf = FPDF(orientation="P", unit="mm", format="A4")
pdf.set_auto_page_break(auto=True, margin=12)
pdf.add_page()

pdf.set_font("Helvetica", "B", 18)
pdf.cell(0, 10, "Giglist React - Change Summary", ln=True)

pdf.set_font("Helvetica", size=11)
pdf.set_text_color(80, 80, 80)
pdf.cell(0, 7, "Date: 2026-06-17", ln=True)
pdf.ln(2)
pdf.set_text_color(0, 0, 0)

for title, bullets in sections:
    pdf.set_font("Helvetica", "B", 13)
    pdf.cell(0, 8, title, ln=True)
    pdf.set_font("Helvetica", size=11)

    for bullet in bullets:
        pdf.multi_cell(0, 6, f"- {bullet}")
    pdf.ln(1)

pdf.output(OUT_PATH)
print(f"Wrote {OUT_PATH}")
