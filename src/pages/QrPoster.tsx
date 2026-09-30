import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { getTourProfile } from "../utils/tourProfile";
import { compactName } from "../utils/searchUrl";
import { normalizeGigText } from "../utils/normalizeGigText";
import "./QrPoster.scss";
import { drawPoster, posterThemes, realVenueImage, posterGigs, posterMonthNames, randomPosterTheme } from "../utils/posterDesign";
import { posterArtwork, loadPosterImage } from "../utils/posterArtwork";
import { fetchLocationPhotos, LocationPhoto } from "../utils/locationPhotos";
import { nextPosterArtwork, nextPosterFonts, PosterFonts } from "../utils/posterThemes";
import { TListing } from "../types/types";
import { posterMonths } from "../utils/qrUrl";
import { filterGigSearch } from "../utils/searchUrl";

export const QrPoster = ({ targetUrl, poster = false, month }: { targetUrl: string; poster?: boolean; month?: number }) => {
    const [gigs, setGigs] = useState<TListing[]>([]);
    const [theme, setTheme] = useState("nocturne");
    const [posterFonts, setPosterFonts] = useState<PosterFonts | null>(null);
    const [artwork, setArtwork] = useState("mountains");
    const [useVenuePhoto, setUseVenuePhoto] = useState(true);
    const [venuePhotoFailed, setVenuePhotoFailed] = useState(false);
    const [venuePhotoAttempt, setVenuePhotoAttempt] = useState(0);
    const [venueImage, setVenueImage] = useState<string | null>(null);
    const [imageWarning, setImageWarning] = useState("");
    const qrRef = useRef<HTMLDivElement>(null);
    const [png, setPng] = useState("");
    const [ready, setReady] = useState(false);
    const [error, setError] = useState("");
    const [inverted, setInverted] = useState(false);
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [isSuburb, setIsSuburb] = useState(false);
    const [isVenue, setIsVenue] = useState(false);
    const captionLine = `upcoming gigs ${isSuburb ? "in" : isVenue ? "at" : "for"}`;
    const caption = `Scan the QR Code to see ${captionLine}\n${displayName || ""}`;
    const [locationPhotos, setLocationPhotos] = useState<LocationPhoto[]>([]);
    const [locationPhoto, setLocationPhoto] = useState<LocationPhoto | null>(null);
    const [locationStates, setLocationStates] = useState<string[]>([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationMessage, setLocationMessage] = useState("");
    const locationRequest = useRef<AbortController | null>(null);
    const loadLocationImagery = async (name: string, states: string[]) => {
        const controller = new AbortController();
        locationRequest.current?.abort(); locationRequest.current = controller;
        setLocationLoading(true); setLocationMessage("");
        const timeout = window.setTimeout(() => controller.abort(), 15000);
        try {
            const photos = await fetchLocationPhotos(name, states, controller.signal);
            if (controller.signal.aborted) return;
            setLocationPhotos(photos); setLocationPhoto(photos[0] || null);
            if (!photos.length) setLocationMessage("No suitable local photos found. You can keep using theme artwork.");
        } catch {
            if (locationRequest.current === controller) setLocationMessage("Local photos couldn’t load. Please try again.");
        } finally {
            window.clearTimeout(timeout);
            if (locationRequest.current === controller) { setLocationLoading(false); locationRequest.current = null; }
        }
    };
    const useLocationImagery = () => {
        if (locationPhoto) { setLocationPhoto(null); setLocationMessage(""); return; }
        if (locationPhotos.length) { setLocationPhoto(locationPhotos[0]); return; }
        void loadLocationImagery(displayName || "", locationStates);
    };
    const shuffleImage = () => {
        setUseVenuePhoto(false);
        if (locationPhoto) {
            const choices = locationPhotos.filter((photo) => photo.id !== locationPhoto.id);
            if (choices.length) setLocationPhoto(choices[Math.floor(Math.random() * choices.length)]);
        } else setArtwork((current) => nextPosterArtwork(theme, current));
    };
    const background = inverted ? "#000" : "#fff";
    const foreground = inverted ? "#fff" : "#000";

    useEffect(() => {
        let cancelled = false;
        const name = decodeURIComponent(new URL(targetUrl).pathname.slice(1));
        const slug = compactName(name);
        locationRequest.current?.abort(); locationRequest.current = null;
        setLocationPhoto(null); setLocationPhotos([]); setLocationStates([]);
        setLocationLoading(false); setLocationMessage("");
        setDisplayName(null);
        setVenueImage(null);
        setUseVenuePhoto(true);
        setIsVenue(false);
        setIsSuburb(false);
        axios.get("https://giglist.com.au/feed_national.php", { timeout: 10000 })
            .then(({ data }) => {
                if (!cancelled) {
                    const dates = normalizeGigText(data);
                    const profile = getTourProfile(dates, slug);
                    if (poster) setGigs(posterGigs(dates, slug, month));
                    if (poster && profile.isVenue) {
                        const photo = filterGigSearch(dates, slug, true).flatMap((date) => date.listings)
                            .filter((gig) => gig.name.replace(/&amp;/gi, "&") === profile.title)
                            .map((gig) => realVenueImage(gig.location_image_url)).find(Boolean);
                        setVenueImage(photo || null);
                        setUseVenuePhoto(true);
                    }
                    setIsVenue(profile.isVenue);
                    setIsSuburb(profile.isSuburb);
                    setArtwork("mountains");
                    if (profile.isSuburb) {
                        const states = Array.from(new Set(dates.flatMap((date) => date.listings)
                        .filter((gig) => compactName(gig.suburb || "") === compactName(profile.title))
                        .map((gig) => gig.state).filter(Boolean)));
                        setLocationStates(states);
                        if (poster) void loadLocationImagery(profile.title, states);
                    }
                    setDisplayName(profile.title);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    if (poster) setError("Gigs couldn’t load. Please reload this page to try again.");
                    else setDisplayName(name.replace(/[-_]/g, " "));
                }
            });
        return () => { cancelled = true; locationRequest.current?.abort(); locationRequest.current = null; };
    }, [targetUrl, poster, month]);

    useEffect(() => {
        let cancelled = false;
        let objectUrl = "";
        setPng("");
        setReady(false);
        setError("");
        setImageWarning("");
        setVenuePhotoFailed(false);
        if (!displayName) return;

        const generate = async () => {
            try {
                const fonts = await document.fonts.load('184px "carbontyperegular"');
                if (!fonts.length) throw new Error("Giglist font could not load");
                if (poster) {
                    const themeFont = posterFonts?.title || posterThemes.find((item) => item.id === theme)?.font || "Poster Condensed";
                    const loaded = await Promise.all([
                        document.fonts.load(`100px "${themeFont}"`),
                        document.fonts.load(`100px "${posterFonts?.listing || "Poster Grotesk"}"`),
                        document.fonts.load('400 40px "Poster Grotesk"'),
                        document.fonts.load('700 40px "Poster Grotesk"'),
                        document.fonts.load('60px "Poster Condensed"'),
                    ]);
                    if (loaded.some((faces) => !faces.length)) throw new Error("Poster font could not load");
                }
                if (cancelled) return;
                const svg = qrRef.current?.querySelector("svg");
                if (!svg) throw new Error("QR code unavailable");
                objectUrl = URL.createObjectURL(new Blob(
                    [new XMLSerializer().serializeToString(svg)],
                    { type: "image/svg+xml;charset=utf-8" },
                ));
                const image = new Image();
                await new Promise<void>((resolve, reject) => {
                    image.onload = () => resolve();
                    image.onerror = () => reject(new Error("QR image could not load"));
                    image.src = objectUrl;
                });
                if (cancelled) return;
                const canvas = document.createElement("canvas");
                canvas.width = 1600;
                canvas.height = 2000;
                const context = canvas.getContext("2d");
                if (!context) throw new Error("PNG export unavailable");
                if (poster) {
                    let photo: HTMLImageElement | null = null;
                    if (venueImage && useVenuePhoto) {
                        try {
                            photo = await loadPosterImage(venueImage);
                        } catch {
                            if (!cancelled) {
                                setVenuePhotoFailed(true);
                                setImageWarning("The venue photo couldn’t load. Showing theme artwork; use the venue photo button to retry.");
                            }
                        }
                    }
                    let localImage: HTMLImageElement | null = null;
                    if (!photo && locationPhoto) {
                        try { localImage = await loadPosterImage(locationPhoto.url); }
                        catch { if (!cancelled) setImageWarning("This local photo couldn’t load. Showing theme artwork; try Shuffle image for another photo."); }
                    }
                    const art = photo ? null : localImage || await loadPosterImage(posterArtwork[artwork]);
                    if (cancelled) return;
                    drawPoster(context, { theme, fonts: posterFonts || undefined, artwork: art, title: displayName, targetUrl, qr: image, photo, gigs, month, isVenue, isSuburb, photoCredit: localImage ? locationPhoto?.credit : undefined });
                } else {
                context.fillStyle = background;
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = foreground;
                context.textAlign = "center";
                context.font = '184px "carbontyperegular"';
                context.fillText("Giglist", 800, 275);

                // Render at the SVG's native size, with ample quiet space.
                const size = 1120;
                context.imageSmoothingEnabled = false;
                context.drawImage(image, (1600 - size) / 2, 430, size, size);
                context.font = '64px "carbontyperegular"';
                context.fillText("Scan the QR Code to see", 800, 1680, 1360);
                context.fillText(captionLine, 800, 1770, 1360);
                context.fillText(displayName, 800, 1870, 1360);
                }
                if (cancelled) return;
                setPng(canvas.toDataURL("image/png"));
            } catch {
                if (!cancelled) setError("We couldn’t generate the PNG. Please reload this page to try again.");
            } finally {
                if (objectUrl) URL.revokeObjectURL(objectUrl);
            }
        };
        generate();
        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [targetUrl, background, foreground, displayName, captionLine, poster, theme, artwork, inverted, venueImage, gigs, month, isVenue, isSuburb, locationPhoto, posterFonts, useVenuePhoto, venuePhotoAttempt]);

    return (
        <div className="qr-poster-page">
            <Helmet>
                <title>{poster ? "Giglist | Printable gig poster" : "Giglist | Printable QR code"}</title>
                <meta name="robots" content="noindex" />
                <body className={`qr-poster-body${inverted ? " qr-poster-inverted" : ""}${poster ? " gig-poster-body" : ""}`} />
            </Helmet>
            <div className="qr-poster-controls">
                <p>QR code links to <a href={targetUrl}>{targetUrl}</a></p>
                {poster && <p>{month === undefined ? "Upcoming gigs" : `Live music in ${posterMonthNames[month]}`} · {gigs.length} listings</p>}
                {poster && <label className="poster-theme-label">Poster theme
                    <select value={theme} onChange={(event) => {
                        const next = event.target.value; setTheme(next);
                        setArtwork(nextPosterArtwork(next, artwork));
                    }}>
                        {posterThemes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                </label>}
                {poster && <>
                    <button type="button" className="poster-random" onClick={() => {
                        const next = randomPosterTheme(theme); setTheme(next);
                        setArtwork(nextPosterArtwork(next, artwork));
                    }}>
                        <span aria-hidden="true">⤨</span> Random theme
                    </button>
                    <button type="button" className="poster-font-shuffle" onClick={() => {
                        const current = posterFonts || {title: posterThemes.find((item) => item.id === theme)!.font, listing: "Poster Grotesk" as const};
                        setPosterFonts(nextPosterFonts(current));
                    }}>Shuffle fonts</button>
                    <button type="button" className="poster-shuffle" disabled={!!locationPhoto && locationPhotos.length < 2} onClick={shuffleImage}>Shuffle image</button>
                    {venueImage && <button type="button" className="poster-venue-photo"
                        aria-pressed={useVenuePhoto && !venuePhotoFailed} onClick={() => {
                            setUseVenuePhoto(true);
                            setVenuePhotoAttempt((attempt) => attempt + 1);
                        }}>{useVenuePhoto && !venuePhotoFailed ? "Venue photo selected" : "Use venue photo"}</button>}
                    {isSuburb && <button type="button" className="poster-location" aria-pressed={!!locationPhoto}
                        disabled={locationLoading || !displayName} onClick={useLocationImagery}>
                        {locationLoading ? "Finding local photos…" : locationPhoto ? "Use theme artwork" : "Location imagery"}
                    </button>}
                    {locationMessage && <p role="status">{locationMessage}</p>}
                    {locationPhoto && <p className="poster-photo-credit">
                        {locationPhotos.length} local photos · <a href={locationPhoto.source} target="_blank" rel="noreferrer">{locationPhoto.title}</a>
                        {" — "}{locationPhoto.artist}{" · "}
                        {locationPhoto.licenseUrl ? <a href={locationPhoto.licenseUrl} target="_blank" rel="noreferrer">{locationPhoto.license}</a> : locationPhoto.license}
                    </p>}
                    <p className="poster-theme-description">{posterThemes.find((item) => item.id === theme)?.description}</p>
                </>}
                {png && <a className="qr-poster-button" href={png}
                    download={`giglist-${targetUrl.split("/").pop()}-${poster ? theme + "-poster" + (month === undefined ? "" : "-" + posterMonths[month]) : "qr"}.png`}>Download PNG</a>}
                <button type="button" disabled={!ready} onClick={() => window.print()}>Print</button>
                {!poster && <button type="button" aria-pressed={inverted}
                    onClick={() => setInverted((value) => !value)}>Invert colours</button>}
                {!png && !error && <p role="status">{poster ? "Preparing your poster…" : "Preparing your QR code…"}</p>}
                {imageWarning && <p role="status">{imageWarning}</p>}
                {error && <p role="alert">{error}</p>}
            </div>
            <div ref={qrRef} hidden aria-hidden="true">
                <QRCode value={targetUrl} level="M" size={1120}
                    bgColor={poster ? "#fff" : background} fgColor={poster ? "#000" : foreground} />
            </div>
            {png && <img className="qr-poster-image" src={png}
                onLoad={() => setReady(true)}
                alt={poster ? `${displayName}: ${month === undefined ? "Upcoming gigs" : "Live music in " + posterMonthNames[month]}. ${gigs.length} listings. Scan for gig details.` : `Giglist. QR code for ${targetUrl}. ${caption}`} />}
        </div>
    );
};
