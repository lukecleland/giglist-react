---
name: poster-banner
description: Research and implement illustrated title banners and expressive typography for live-music posters, including Giglist artist, venue and suburb headers. Use for poster mastheads and header artwork; not website navigation or general page styling.
---

# Live-music poster banners

Read [reference studies](references/studies.md) when choosing a visual direction. Study actual artwork from the designer or festival, not just a search summary. Extract composition and lettering principles; create original ornaments rather than lifting logos, mascots or protected artwork.

Treat the artist, venue or suburb name as the headline. Artwork should frame it, with the live-music period immediately underneath. Build an intentional pairing: ornamental western lettering with an engraved frame, expressive serif with botanical ornament, geometric lettering with a radial print. A font swap alone is not a new banner design.

For Giglist:
- Use original canvas/vector artwork or documented licensed imagery. The user rejected generated raster images.
- Always use the same font family for the header and listings. Header shuffle changes artwork and alternates the name between all caps and its original casing, never fonts. Header selection and sequential navigation change only artwork. The poster font controls change both together. Never alter the Carbon Giglist footer logo.
- Keep artwork visible behind the name: never cover illustrated banners with a solid centre panel. Keep artwork and header photos at full colour: no translucent wash or darkening. Use a substantial contrasting outline plus a tight drop shadow for both the name and period, keeping the letter faces crisp; clip artwork to the header bounds. Fit measured text without horizontal distortion.
- Use fixed poster-space padding and gaps; do not let larger fonts create larger margins. Compact dense bills must retain their listing space.
- Custom banner and background uploads are processed locally. Extract a palette from opaque pixels; the active custom banner palette takes priority over a custom background. Keep header uploads undimmed with outlined text, and allow removing or reselecting uploads.
- Illustrated headers dictate the translucent listing-panel tint and coordinated text/accent colours, even when the page theme is shuffled independently. Keep the background image visible through the panel.
- Do not introduce theatre imagery, fake headliners, invented sponsors or borrowed festival branding.
- Outlines and offset shadows must maintain contrast against the field, not obscure the letterforms.
- Provide a way to select treatments directly as well as shuffle, so designs are reviewable.

Implementation lives in `src/utils/posterBanners.ts`, composed by `posterDesign.ts`, with controls in `QrPoster.tsx`. The production canvas is also the exported PNG; use `scripts/preview-posters.cjs` for browser proofs. Check short and long titles, sparse listings and dense festival bills. Inspect the actual rendered proof, including ornament boundaries, subtitle contrast and the gap before listings. Keep vector output local and deterministic so export needs no external asset request.
