# Live-music poster direction

Research updated 2026-09-30. Giglist is exclusively live music. All theme artwork is original or separately licensed; reference posters are never shipped in the application.

## 100 concert-poster study

Reviewed 100 concert posters from [Todd Slater's public archive](https://toddslater.net/collections/posters-in-stock), including work for Jack White, Foo Fighters, Tool, Primus, Pearl Jam, The Avett Brothers, Dave Matthews Band and Widespread Panic. The exact inspected items are recorded in [poster-reference-index.md](poster-reference-index.md). This is a reference selection, not a claim that these are a definitive ranked “100 best”.

Observed across the contact sheets: a dominant animal or landscape, integrated type, limited print palettes, engraved detail, screenprint texture and relatively small event information. The central image carries the emotional idea. A small decorative header above a generic table does not capture that approach.

Additional primary references: [DKNG concert-poster portfolio](https://www.dkngstudios.com/work/posters), [Ashmolean's Donwood/Yorke exhibition](https://www.ashmolean.org/exhibition/this-is-what-you-get-stanley-donwood-radiohead-thom-yorke), [Glastonbury's official 2025 lineup poster](https://www.glastonburyfestivals.co.uk/news/glastonbury-2025-line-up-so-far/).

## Implemented compositions

- **Into the Wild / Cinematic rock:** full-bleed landscape photograph, towering ivory title and a dark fade behind dates.
- **Wildflower / Indie folk:** warm editorial paper, large serif title, tall photograph and asymmetric date column.
- **Feedback / DIY punk:** black-and-white concert photograph, acid-yellow label, rough paper edge and compact dates.
- **Heatwave / Desert rock:** vermilion ground, panoramic landscape, large black type.
- **Blue Hour / Dream pop:** immersive night photography with floating serif type and a deep-blue date field.
- **Red Room / Post-punk:** a red/black photographic split and asymmetric gig listing.

These are interpretations of live-music design approaches, not replicas of a particular band's identity. No fake tour names, sponsors, headliners or event facts are added.

## Assets and export

39 images are bundled: 27 sourced photographs/abstract images and 12 public-domain artworks from the Art Institute of Chicago. Photos come from Unsplash under its [license](https://unsplash.com/license). Exact image sources are in [the asset credits](../src/assets/posters/SOURCES.md). Generated artwork has been removed at the user’s request; use sourced photography and public-domain artwork. Actual venue photos take priority over atmospheric artwork. Themes have compatible image pools; Shuffle image changes imagery while keeping the gig data and selected layout. Random theme changes the layout and image together.

Poster colours are art-directed and do not invert. QR-only pages retain inversion. All posters preserve every matching gig, dates, times, month filtering, a scannable QR and the shared black footer containing the QR code, scan message, URL and Powered by Giglist branding.

## Quality gate

Inspect the actual exported compositions with loaded photographs and fonts, not just mocked canvas tests. Check every theme, real venue images, long names, empty and dense schedules. Keep text out of detailed high-contrast image areas or supply a sufficient tonal overlay. Fit every listing inside its theme's explicit date region. Do not hide layout errors with opaque patches over art. Local imagery avoids runtime third-party image-service failures and canvas CORS problems.


## Space and hierarchy rules (2026-09-30)

- No generated images in Giglist posters. Use licensed, internet-sourced images and actual venue photos.
- Put “Live music in October” (using the selected month) directly below the artist, venue or suburb title. Without a month filter, use “Live music”. Do not place the subtitle below an image or across an empty band.
- Maximise readable gig text before preserving decorative whitespace. Dense posters use a compact title with the month directly underneath, and full-page artwork beneath the listings. Keep theme-specific fades, translucent column panels and text shadows; never collapse every theme into the same corner thumbnail.
- Fit text upward as well as downward: do not leave a low font-size cap while the listing region remains empty. Compare column counts using measured text.
- Retain every gig and the QR/footer. Reduce title space before shrinking already-small listing text; artwork can fill the page behind readable text.

## Dense festival bills

Studied the actual posters in [Double J’s Big Day Out retrospective](https://www.abc.net.au/listen/doublej/music-reads/features/every-big-day-out-line-up/11539046), including 2002, 2004 and 2013. Observations: dense bills retain full-page illustrated grounds; contrasting text, outlined lettering and deliberate colour panels separate listings from busy art. The illustration need not consume separate layout space. No Big Day Out artwork is distributed with Giglist.

Dense theme treatments now include dark photographic washes and shadows, botanical art under warm translucent paper columns, monochrome concert photography under cut-paper columns, amber festival panels, midnight-blue floating text, and red duotone artwork behind dark translucent columns. Image pools contain at least 15 choices each, with no immediate repeat on shuffle. Venue photos still take priority.

## On-demand location imagery

All suburb posters offer an opt-in Location imagery button. It searches Wikimedia Commons at click time using the suburb and state from the national feed, caches successful results for the session, and lets the user shuffle them or return to theme artwork. Theme changes preserve location mode. No suburb-specific bundled collection or automatic Fremantle selection remains.

Search results are filtered to large raster images with public-domain, CC0 or attribution-only CC BY metadata. Unknown and share-alike licenses are excluded. The author, source record, license and cropping/colour-adjustment notice travel with the exported PNG; clickable source/license links also appear in the editor. Empty searches and network errors leave theme artwork available. Imagery is supplied by search metadata rather than manually verified; the editor shows the source/title so users can check the chosen photo.

References: https://www.mediawiki.org/wiki/API:Imageinfo and https://www.mediawiki.org/wiki/API:Cross-site_requests . Google Custom Search is closed to new customers and ends January 1, 2027 (https://developers.google.com/custom-search/v1/overview); the user selected Wikimedia Commons instead.

## Independent font shuffle

Shuffle fonts selects a different heading/listing pairing from the bundled condensed, serif and grotesk fonts. It preserves the theme, photo, palette, gig data and branding. Measure and refit with the selected fonts after loading them; the Giglist wordmark always retains carbon type. Metadata and footer typography remain consistent for readability.
