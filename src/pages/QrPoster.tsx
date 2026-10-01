import { ShuffleControl } from '../components/Poster/ShuffleControl';
import { upcomingWeekend, weekendGigs } from "../utils/posterWeekend";
import { ListStyle, nextListStyle, listStyleNames, listStyles } from "../components/Poster/FestivalWordCloud";
import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { getTourProfile } from "../utils/tourProfile";
import { compactName } from "../utils/searchUrl";
import { normalizeGigText } from "../utils/normalizeGigText";
import "./QrPoster.scss";
import { drawPoster, posterHeaders, posterHeaderNames, nextPosterHeader, PosterHeader, posterThemes, realVenueImage, posterGigs, posterMonthNames, randomPosterTheme } from "../utils/posterDesign";
import { posterArtwork, loadPosterImage } from "../utils/posterArtwork";
import { fetchLocationPhotos, LocationPhoto } from "../utils/locationPhotos";
import { posterFontFamilies, nextPosterArtwork, nextListingFonts, PosterFonts } from "../utils/posterThemes";
import { TListing } from "../types/types";
import { posterMonths } from "../utils/qrUrl";
import { filterGigSearch } from "../utils/searchUrl";

export const QrPoster = ({ targetUrl, poster = false, month }: { targetUrl: string; poster?: boolean; month?: number }) => {
    const [allGigs, setGigs] = useState<TListing[]>([]);
    const [weekendOnly, setWeekendOnly] = useState(false);
    const [weekend, setWeekend] = useState(() => upcomingWeekend());
    const gigs = useMemo(() => weekendOnly ? weekendGigs(allGigs, weekend) : allGigs.filter(gig => month === undefined || Number(gig.date.slice(5,7)) === month + 1), [allGigs, weekendOnly, weekend, month]);
    const periodLabel = weekendOnly ? weekend.label : undefined;
    const [rendering, setRendering] = useState(false);
    const [listStyle, setListStyle] = useState<ListStyle>("columns");
    const seenListStyles = useRef<ListStyle[]>(['columns']);
    const shuffleListStyle = () => {
        if (seenListStyles.current.length >= listStyles.length) seenListStyles.current = [listStyle];
        const next = nextListStyle(listStyle, Math.random, seenListStyles.current);
        seenListStyles.current.push(next);
        setListStyle(next);
    };
    const [header, setHeader] = useState<PosterHeader>("gradient");
    const [theme, setTheme] = useState("nocturne");
    const [fontSettings, setPosterFonts] = useState<PosterFonts | null>(null);
    const posterFonts = useMemo<PosterFonts | null>(() => {
        const title = fontSettings?.title || posterThemes.find(item => item.id === theme)!.font;
        return {...fontSettings, title, listing: title};
    }, [fontSettings, theme]);
    const currentPosterFonts = (): PosterFonts => {
        const title = posterThemes.find(item => item.id === theme)!.font;
        return posterFonts || {title, listing: weekendOnly || listStyle !== 'columns' ? title : 'Poster Grotesk'};
    };
    const [artwork, setArtwork] = useState("mountains");
    const [useVenuePhoto, setUseVenuePhoto] = useState(true);
    const [venuePhotoFailed, setVenuePhotoFailed] = useState(false);
    const [venuePhotoAttempt, setVenuePhotoAttempt] = useState(0);
    const [venueImage, setVenueImage] = useState<string | null>(null);
    const [imageWarning, setImageWarning] = useState("");
    const qrRef = useRef<HTMLDivElement>(null);
    const [png, setPng] = useState("");
    const [activeShuffle, setActiveShuffle] = useState<string | null>(null);
    const shuffleLabel = (label: string) => label;
    const shuffleProps = (label: string) => ({
        "aria-label": label, "aria-busy": activeShuffle === label, disabled: !!activeShuffle,
    });
    const [ready, setReady] = useState(false);
    const [error, setError] = useState("");
    const [inverted, setInverted] = useState(false);
    const [configOpen, setConfigOpen] = useState(false);
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
    const chooseTheme = (value: string) => { setTheme(value); setArtwork(nextPosterArtwork(value, artwork)); };
    const chooseHeader = (value: string) => { setHeader(value as PosterHeader); };
    const chooseFont = (value: string) => {
        const next = {...currentPosterFonts(), listing: value as PosterFonts['listing']};
        setPosterFonts({...next, title: next.listing});
    };
    const imageOptions = [
        ...(venueImage ? [{value: 'venue', label: 'Venue photo'}] : []),
        ...locationPhotos.map(photo => ({value: 'local:' + photo.id, label: photo.title})),
        ...Object.keys(posterArtwork).map(key => ({value: key, label: key.replace(/([a-z])([A-Z])/g, '$1 $2')})),
    ];
    const imageValue = useVenuePhoto && venueImage && !venuePhotoFailed ? 'venue' : locationPhoto ? 'local:' + locationPhoto.id : artwork;
    const chooseImage = (value: string) => {
        locationRequest.current?.abort(); locationRequest.current = null; setLocationLoading(false);
        setUseVenuePhoto(value === 'venue');
        setLocationPhoto(value.startsWith('local:') ? locationPhotos.find(photo => 'local:' + photo.id === value) || null : null);
        if (value === 'venue') setVenuePhotoAttempt(attempt => attempt + 1);
        else if (!value.startsWith('local:')) setArtwork(value);
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
        setPng("");
        setActiveShuffle(null);
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
                    if (poster) setGigs(posterGigs(dates, slug));
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
        setReady(false);
        setError("");
        setImageWarning("");
        setVenuePhotoFailed(false);
        if (!displayName) { setRendering(false); return; }
        setRendering(true);

        const generate = async () => {
            try {
                const fonts = await document.fonts.load('184px "carbontyperegular"');
                if (!fonts.length) throw new Error("Giglist font could not load");
                if (poster) {
                    const themeFont = posterFonts?.title || posterThemes.find((item) => item.id === theme)?.font || "Poster Condensed";
                    const loaded = await Promise.all([
                        document.fonts.load(`100px "${themeFont}"`),
                        document.fonts.load(`700 100px "${posterFonts?.listing || themeFont}"`),
                        document.fonts.load(`${posterFonts?.listing === "Poster Serif" ? 400 : 700} 100px "${posterFonts?.listing || "Poster Grotesk"}"`),
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
                    drawPoster(context, { theme, header, listStyle: weekendOnly ? "festivalDays" : listStyle, periodLabel, fonts: posterFonts || undefined, artwork: art, title: displayName, targetUrl, qr: image, photo, gigs, month, isVenue, isSuburb, photoCredit: localImage ? locationPhoto?.credit : undefined });
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
                const nextPng = canvas.toDataURL("image/png");
                // Decode the replacement before swapping out the visible poster.
                const preview = new Image();
                await new Promise<void>((resolve, reject) => {
                    preview.onload = () => resolve();
                    preview.onerror = () => reject(new Error("Poster preview could not load"));
                    preview.src = nextPng;
                });
                if (cancelled) return;
                setPng(nextPng);
                setReady(true);
            } catch {
                if (!cancelled) setError("We couldn’t generate the PNG. Please reload this page to try again.");
            } finally {
                if (!cancelled) { setActiveShuffle(null); setRendering(false); }
                if (objectUrl) URL.revokeObjectURL(objectUrl);
            }
        };
        generate();
        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [targetUrl, background, foreground, displayName, captionLine, poster, theme, header, listStyle, weekendOnly, periodLabel, artwork, inverted, venueImage, gigs, month, isVenue, isSuburb, locationPhoto, posterFonts, useVenuePhoto, venuePhotoAttempt]);

    return (
        <div className={`qr-poster-page${poster ? " poster-editor" : ""}`}>
            <Helmet>
                <title>{poster ? "Giglist | Printable gig poster" : "Giglist | Printable QR code"}</title>
                <meta name="robots" content="noindex" />
                <body className={`qr-poster-body${inverted ? " qr-poster-inverted" : ""}${poster ? " gig-poster-body" : ""}`} />
            </Helmet>
            <aside className="qr-poster-controls" aria-busy={poster && (rendering || !!activeShuffle || locationLoading)}>
                {poster && (rendering || !!activeShuffle || locationLoading) && <div className="poster-panel-loading" role="status" aria-label="Updating poster">
                    <span className="poster-button-spinner" aria-hidden="true" />
                </div>}
                <fieldset className="poster-controls-fieldset" disabled={poster && (rendering || !!activeShuffle || locationLoading)}>
                {poster && <div className="poster-panel-heading"><h2>Poster settings</h2>
                    <button type="button" className="poster-panel-toggle" aria-expanded={configOpen} aria-controls="poster-settings-content"
                        onClick={() => setConfigOpen(value => !value)}>{configOpen ? "Close" : "Configure"}</button>
                </div>}
                <div id={poster ? "poster-settings-content" : undefined} className={`poster-controls-content${configOpen ? " is-open" : ""}`}>
                <p>QR code links to <a href={targetUrl}>{targetUrl}</a></p>
                {poster && <p>{periodLabel || (month === undefined ? "Upcoming gigs" : `Live music in ${posterMonthNames[month]}`)} · {gigs.length} listings</p>}


                {poster && <label className="poster-weekend-toggle"><input type="checkbox" checked={weekendOnly} onChange={event => { setWeekend(upcomingWeekend()); setWeekendOnly(event.target.checked); }} /> Upcoming weekend (Fri–Sun)</label>}


                {poster && <>
                    <ShuffleControl label="Poster theme" value={theme} options={posterThemes.map(item => ({value: item.id, label: item.name}))} onChange={chooseTheme}>
                    <button type="button" className="poster-random" {...shuffleProps("Shuffle theme")} onClick={() => {
                        setActiveShuffle("Shuffle theme");
                        const next = randomPosterTheme(theme); setTheme(next);
                        setArtwork(nextPosterArtwork(next, artwork));
                    }}>
                        {shuffleLabel("Shuffle theme")}
                    </button>
                    </ShuffleControl>
                    <ShuffleControl label="Header artwork" value={header} options={posterHeaders.map(value => ({value, label: posterHeaderNames[value]}))} onChange={chooseHeader}>
                    <button type="button" className="poster-header-shuffle" {...shuffleProps("Shuffle header")} title={`Current header: ${header}`} onClick={() => { setActiveShuffle("Shuffle header"); const next = nextPosterHeader(header); setHeader(next); }}>{shuffleLabel("Shuffle header")}</button>
                    </ShuffleControl>
                    <ShuffleControl label="Poster font" value={currentPosterFonts().listing} options={posterFontFamilies.map(value => ({value, label: value}))} onChange={chooseFont}>
                    <button type="button" className="poster-font-shuffle" {...shuffleProps("Shuffle fonts")} onClick={() => {
                        setActiveShuffle("Shuffle fonts");
                        const next = nextListingFonts(currentPosterFonts());
                        setPosterFonts({...next, title: next.listing});
                    }}>{shuffleLabel("Shuffle fonts")}</button>
                    </ShuffleControl>
                    <ShuffleControl label="Image" value={imageValue} options={imageOptions} onChange={chooseImage}>
                    <button type="button" className="poster-shuffle" {...shuffleProps("Shuffle image")} disabled={!!activeShuffle || (!!locationPhoto && locationPhotos.length < 2)} onClick={() => { setActiveShuffle("Shuffle image"); shuffleImage(); }}>{shuffleLabel("Shuffle image")}</button>
                    </ShuffleControl>
                    {venueImage && <button type="button" className="poster-venue-photo"
                        aria-pressed={useVenuePhoto && !venuePhotoFailed} onClick={() => {
                            setUseVenuePhoto(true);
                            setVenuePhotoAttempt((attempt) => attempt + 1);
                        }}>{useVenuePhoto && !venuePhotoFailed ? "Venue photo selected" : "Use venue photo"}</button>}
                    {isSuburb && !locationPhoto && <button type="button" className="poster-location" aria-pressed={!!locationPhoto}
                        disabled={locationLoading || !displayName} onClick={useLocationImagery}>
                        {locationLoading ? "Finding local photos…" : "Location imagery"}
                    </button>}
                    {locationMessage && <p role="status">{locationMessage}</p>}
                    <ShuffleControl label="List style" value={weekendOnly ? 'festivalDays' : listStyle}
                        options={listStyles.map(value => ({value, label: listStyleNames[value]}))} disabled={weekendOnly}
                        onChange={value => {setListStyle(value as ListStyle); seenListStyles.current = [value as ListStyle];}}>
                        <button type="button" className="poster-list-style" disabled={weekendOnly} onClick={() => {shuffleListStyle();}}>Shuffle list style</button>
                    </ShuffleControl>
                    <div className="poster-randomise-label">Randomise</div>
                    <button type="button" className="poster-shuffle-everything" {...shuffleProps("Shuffle everything")} onClick={() => {
                        setActiveShuffle("Shuffle everything");
                        const nextHeader = nextPosterHeader(header);
                        setHeader(nextHeader);
                        shuffleListStyle();
                        const next = randomPosterTheme(theme);
                        const currentFonts = currentPosterFonts();
                        setTheme(next);
                        const fonts = nextListingFonts(currentFonts);
                        setPosterFonts({...fonts, title: fonts.listing});
                        setArtwork(nextPosterArtwork(next, artwork));
                        setUseVenuePhoto(false);
                        locationRequest.current?.abort();
                        locationRequest.current = null;
                        setLocationLoading(false);
                        setLocationPhoto(null);
                        setLocationMessage("");
                    }}>{shuffleLabel("Shuffle everything")}</button>
                    <div className="poster-settings-gap" aria-hidden="true" />
                </>}
                <div className="poster-export-actions">
                {png && <a className="qr-poster-button" href={png}
                    download={`giglist-${targetUrl.split("/").pop()}-${poster ? theme + "-poster" + (weekendOnly ? "-weekend-" + weekend.start : "") + (weekendOnly || month === undefined ? "" : "-" + posterMonths[month]) : "qr"}.png`}>Download PNG</a>}
                <button type="button" disabled={!ready} onClick={() => window.print()}>Print</button>
                {!poster && <button type="button" aria-pressed={inverted}
                    onClick={() => setInverted((value) => !value)}>Invert colours</button>}
                </div>
                {!png && !error && <p role="status">{poster ? "Preparing your poster…" : "Preparing your QR code…"}</p>}
                {imageWarning && <p role="status">{imageWarning}</p>}
                {error && <p role="alert">{error}</p>}
                </div>
                </fieldset>
            </aside>
            <div ref={qrRef} hidden aria-hidden="true">
                <QRCode value={targetUrl} level="M" size={1120}
                    bgColor={poster ? "#fff" : background} fgColor={poster ? "#000" : foreground} />
            </div>
            {png && <img className="qr-poster-image" src={png}
                onLoad={() => setReady(true)}
                alt={poster ? `${displayName}: ${periodLabel || (month === undefined ? "Upcoming gigs" : "Live music in " + posterMonthNames[month])}. ${gigs.length} listings. Scan QR code for gig details.` : `Giglist. QR code for ${targetUrl}. ${caption}`} />}
        </div>
    );
};
