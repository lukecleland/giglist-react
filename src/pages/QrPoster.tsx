import { artworkLabel } from '../utils/artworkLabel';
import moment from 'moment';
import { ToolFrame } from './ToolFrame';
import { PosterUpload, readPosterUpload } from '../utils/posterUpload';
import { ShuffleControl } from '../components/Poster/ShuffleControl';
import { upcomingWeekend, weekendGigs } from "../utils/posterWeekend";
import { ListStyle, listStyleNames, listStyles } from "../components/Poster/FestivalWordCloud";
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

export const QrPoster = ({ targetUrl, poster = false, month: initialMonth }: { targetUrl: string; poster?: boolean; month?: number }) => {
    const [bannerUpload, setBannerUpload] = useState<PosterUpload | null>(null);
    const [backgroundUpload, setBackgroundUpload] = useState<PosterUpload | null>(null);
    const [useCustomBackground, setUseCustomBackground] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadErrors, setUploadErrors] = useState({banner: '', background: ''});
    const uploadVersion = useRef(0);
    useEffect(() => () => { uploadVersion.current++; }, []);
    const upload = async (file: File | undefined, kind: 'banner' | 'background') => {
        if (!file) return;
        const version = ++uploadVersion.current;
        setUploading(true); setUploadErrors(errors => ({...errors, [kind]: ''}));
        try {
            const result = await readPosterUpload(file);
            if (version !== uploadVersion.current) return;
            if (kind === 'banner') { setBannerUpload(result); setHeader('custom'); }
            else { setBackgroundUpload(result); setUseCustomBackground(true); setUseVenuePhoto(false); }
        } catch (error) {
            if (version === uploadVersion.current) setUploadErrors(errors => ({...errors, [kind]: error instanceof Error ? error.message : 'Image could not load.'}));
        } finally { if (version === uploadVersion.current) setUploading(false); }
    };
    const [months] = useState(() => Array.from({length:12}, (_,index) => {
        const date = moment().startOf('month').add(index,'months');
        return {value:date.format('YYYY-MM'),label:date.format('MMMM YYYY'),month:date.month()};
    }));
    const [selectedMonth, setSelectedMonth] = useState(() => months.find(item=>item.month===initialMonth)?.value);
    const month = selectedMonth ? Number(selectedMonth.slice(5,7))-1 : undefined;
    const [dateRange, setDateRange] = useState<{start:string;end:string} | null>(null);
    const [rangeStart, setRangeStart] = useState('');
    const [rangeEnd, setRangeEnd] = useState('');
    const validRange = moment(rangeStart, 'YYYY-MM-DD', true).isValid() && moment(rangeEnd, 'YYYY-MM-DD', true).isValid() && rangeStart <= rangeEnd;
    const [allGigs, setGigs] = useState<TListing[]>([]);
    const [weekendOnly, setWeekendOnly] = useState(false);
    const [weekend, setWeekend] = useState(() => upcomingWeekend());
    useEffect(() => {
        const activeRange = weekendOnly ? weekend : dateRange;
        setRangeStart(activeRange?.start || (selectedMonth ? moment(selectedMonth, 'YYYY-MM').startOf('month').format('YYYY-MM-DD') : ''));
        setRangeEnd(activeRange?.end || (selectedMonth ? moment(selectedMonth, 'YYYY-MM').endOf('month').format('YYYY-MM-DD') : ''));
    }, [weekendOnly, weekend, dateRange, selectedMonth]);
    const gigs = useMemo(() => weekendOnly ? weekendGigs(allGigs, weekend) : allGigs.filter(gig => dateRange ? gig.date.slice(0,10) >= dateRange.start && gig.date.slice(0,10) <= dateRange.end : !selectedMonth || gig.date.slice(0,7) === selectedMonth), [allGigs, weekendOnly, weekend, selectedMonth, dateRange]);
    const periodLabel = weekendOnly ? weekend.label : dateRange ? `LIVE MUSIC · ${moment(dateRange.start).format('D MMM YYYY')}–${moment(dateRange.end).format('D MMM YYYY')}` : selectedMonth ? `LIVE MUSIC IN ${moment(selectedMonth, 'YYYY-MM').format('MMMM YYYY').toUpperCase()}` : undefined;
    const [rendering, setRendering] = useState(false);
    const [listingBackground, setListingBackground] = useState(true);
    const [invertFonts, setInvertFonts] = useState(false);
    const [listStyle, setListStyle] = useState<ListStyle>("columns");
    const seenListStyles = useRef<ListStyle[]>(['columns']);
    const shuffleListStyle = () => {
        let choices = availableListStyles.filter(style => style !== selectedListStyle && !seenListStyles.current.includes(style));
        if (!choices.length) {
            seenListStyles.current = [selectedListStyle];
            choices = availableListStyles.filter(style => style !== selectedListStyle);
        }
        const next = choices[Math.floor(Math.random() * choices.length)];
        seenListStyles.current.push(next);
        setListStyle(next);
    };
    const [headerCaps, setHeaderCaps] = useState<boolean | undefined>(undefined);
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
    const [feedError, setFeedError] = useState("");
    const [feedRetry, setFeedRetry] = useState(0);
    const [inverted, setInverted] = useState(false);
    const [configOpen, setConfigOpen] = useState(false);
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [isSuburb, setIsSuburb] = useState(false);
    const [isVenue, setIsVenue] = useState(false);
    const isArtistPoster = !isSuburb && !isVenue;
    const availableListStyles = isArtistPoster ? listStyles.filter(style => style !== 'festivalDays') : listStyles;
    const selectedListStyle = weekendOnly && !isArtistPoster ? 'festivalDays' : isArtistPoster && listStyle === 'festivalDays' ? 'columns' : listStyle;
    const caption = "Scan the QR Code to see upcoming gigs on Giglist";
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
        setUseCustomBackground(false);
        if (locationPhotos.length) { setLocationPhoto(locationPhotos[0]); return; }
        void loadLocationImagery(displayName || "", locationStates);
    };
    const shuffleImage = () => {
        setUseCustomBackground(false);
        setUseVenuePhoto(false);
        if (locationPhoto) {
            const choices = locationPhotos.filter((photo) => photo.id !== locationPhoto.id);
            if (choices.length) setLocationPhoto(choices[Math.floor(Math.random() * choices.length)]);
        } else setArtwork((current) => nextPosterArtwork(theme, current));
    };
    const chooseTheme = (value: string) => { setTheme(value); };
    const chooseHeader = (value: string) => { setHeader(value as PosterHeader); };
    const chooseFont = (value: string) => {
        const next = {...currentPosterFonts(), listing: value as PosterFonts['listing']};
        setPosterFonts({...next, title: next.listing});
    };
    const imageOptions = [
        ...(backgroundUpload ? [{value: "custom", label: artworkLabel(backgroundUpload.name)}] : []),
        ...(venueImage ? [{value: 'venue', label: 'Venue Photo'}] : []),
        ...locationPhotos.map(photo => ({value: 'local:' + photo.id, label: artworkLabel(photo.title)})),
        ...Object.keys(posterArtwork).map(key => ({value: key, label: artworkLabel(key)})),
    ];
    const imageValue = useCustomBackground && backgroundUpload ? "custom" : useVenuePhoto && venueImage && !venuePhotoFailed ? 'venue' : locationPhoto ? 'local:' + locationPhoto.id : artwork;
    const chooseImage = (value: string) => {
        setUseCustomBackground(value === "custom");
        setUseVenuePhoto(value === 'venue');
        locationRequest.current?.abort(); locationRequest.current = null; setLocationLoading(false);
        if (value === 'custom') { setLocationPhoto(null); return; }
        setLocationPhoto(value.startsWith('local:') ? locationPhotos.find(photo => 'local:' + photo.id === value) || null : null);
        if (value === 'venue') setVenuePhotoAttempt(attempt => attempt + 1);
        else if (!value.startsWith('local:')) setArtwork(value);
    };
    const background = inverted ? "#000" : "#fff";
    const foreground = inverted ? "#fff" : "#000";

    useEffect(() => {
        let cancelled = false;
        let feedReceived = false;
        const name = decodeURIComponent(new URL(targetUrl).pathname.slice(1));
        const slug = compactName(name);
        locationRequest.current?.abort(); locationRequest.current = null;
        setLocationPhoto(null); setLocationPhotos([]); setLocationStates([]);
        setLocationLoading(false); setLocationMessage("");
        setFeedError("");
        setPng("");
        setActiveShuffle(null);
        setDisplayName(null);
        setVenueImage(null);
        setUseVenuePhoto(true);
        setIsVenue(false);
        setIsSuburb(false);
        axios.get("https://giglist.com.au/feed_national.php", { timeout: 10000 })
            .then(({ data }) => {
                feedReceived = true;
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
            .catch((failure) => {
                if (!cancelled) {
                    console.error(feedReceived ? 'Giglist: poster feed processing failed' : 'Giglist: poster feed request failed', failure);
                    if (poster) {
                        const detail = failure instanceof Error ? failure.message : 'Unknown error';
                        setFeedError(feedReceived
                            ? `The feed loaded, but the poster couldn’t read its data: ${detail}`
                            : failure?.response?.status
                                ? `The poster’s feed request returned HTTP ${failure.response.status}. Please try again.`
                                : failure?.code === 'ECONNABORTED'
                                    ? 'The poster’s feed request timed out. Please try again.'
                                    : `The browser couldn’t load the poster feed: ${detail}`);
                    }
                    else setDisplayName(name.replace(/[-_]/g, " "));
                }
            });
        return () => { cancelled = true; locationRequest.current?.abort(); locationRequest.current = null; };
    }, [targetUrl, poster, feedRetry]);

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
                    if (loaded.some((faces) => !faces.length)) throw new Error("Poster Font could not load");
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
                    if (useCustomBackground && backgroundUpload) photo = backgroundUpload.image;
                    else if (venueImage && useVenuePhoto) {
                        try {
                            photo = await loadPosterImage(venueImage);
                        } catch {
                            if (!cancelled) {
                                setVenuePhotoFailed(true);
                                setImageWarning("The venue photo couldn’t load. Showing theme artwork; check Use Venue Photo again to retry.");
                            }
                        }
                    }
                    let localImage: HTMLImageElement | null = null;
                    if (!photo && locationPhoto) {
                        try { localImage = await loadPosterImage(locationPhoto.url); }
                        catch { if (!cancelled) setImageWarning("This local photo couldn’t load. Showing theme artwork; try Shuffle Background for another photo."); }
                    }
                    const art = photo ? null : localImage || await loadPosterImage(posterArtwork[artwork]);
                    if (cancelled) return;
                    drawPoster(context, { theme, listingBackground, invertFonts, header, headerCaps, customBanner: header === "custom" ? bannerUpload?.image : undefined, customPalette: (header === "custom" ? bannerUpload?.palette : undefined) || (useCustomBackground ? backgroundUpload?.palette : undefined), listStyle: selectedListStyle, periodLabel, fonts: posterFonts || undefined, artwork: art, title: displayName, targetUrl, qr: image, photo, gigs, month, isVenue, isSuburb, photoCredit: localImage ? locationPhoto?.credit : undefined });
                } else {
                const heading = displayName;
                let nameSize = 184;
                context.font = `${nameSize}px "carbontyperegular"`;
                while (context.measureText(heading).width > 1360 && nameSize > 112) {
                    nameSize -= 2;
                    context.font = `${nameSize}px "carbontyperegular"`;
                }
                const headingLines: string[] = [];
                let line = '';
                for (const word of heading.split(/\s+/)) {
                    if (line && context.measureText(`${line} ${word}`).width > 1360) {
                        headingLines.push(line); line = '';
                    }
                    // Break unusually long unspaced names without shrinking their letters.
                    for (const character of (line ? ' ' : '') + word) {
                        if (line && context.measureText(line + character).width > 1360) {
                            headingLines.push(line); line = '';
                        }
                        line += character;
                    }
                }
                if (line) headingLines.push(line);
                const headingRows = headingLines.map((text,index)=>({text,y:205+index*nameSize*1.25}));
                const headingBottom = Math.max(...headingRows.map(({text,y})=>y+(context.measureText(text).actualBoundingBoxDescent ?? nameSize*.2)));
                const originalSize = useCustomBackground && backgroundUpload ? 896 : 1120;
                const quietSpace = 64;
                const qrY = headingLines.length > 1 ? Math.max(990-originalSize/2,headingBottom+30+40+quietSpace) : 990-originalSize/2;
                const size = Math.min(originalSize,Math.max(384,990+originalSize/2-qrY));
                const qrX = (canvas.width-size)/2;
                const footerShift = Math.max(0,qrY+size-1550);
                // Extremely long names can extend the page once the QR reaches its minimum.
                canvas.height = 2000+Math.ceil(footerShift);
                context.fillStyle = background;
                context.fillRect(0, 0, canvas.width, canvas.height);
                if (useCustomBackground && backgroundUpload) {
                    const photo = backgroundUpload.image;
                    const scale = Math.max(canvas.width / photo.naturalWidth, canvas.height / photo.naturalHeight);
                    context.drawImage(photo, (canvas.width - photo.naturalWidth * scale) / 2, (canvas.height - photo.naturalHeight * scale) / 2, photo.naturalWidth * scale, photo.naturalHeight * scale);
                    // Preserve the QR's clear border independently of text-panel padding.
                    context.fillStyle = background;
                    context.fillRect(qrX - quietSpace, qrY - quietSpace, size + quietSpace * 2, size + quietSpace * 2);
                }
                context.fillStyle = foreground;
                context.textAlign = "center";
                const drawTextPanel = (lines: {text: string; y: number}[], fontSize: number) => {
                    // Measure the visible letters, rather than padding a fixed oversized rectangle.
                    const padding = 30;
                    const bounds = lines.map(({text, y}) => {
                        const metrics = context.measureText(text);
                        return {
                            left: 800 - (metrics.actualBoundingBoxLeft ?? metrics.width / 2),
                            right: 800 + (metrics.actualBoundingBoxRight ?? metrics.width / 2),
                            top: y - (metrics.actualBoundingBoxAscent ?? fontSize * .8),
                            bottom: y + (metrics.actualBoundingBoxDescent ?? fontSize * .2),
                        };
                    });
                    if (useCustomBackground && backgroundUpload) {
                        const left = Math.min(...bounds.map(box => box.left));
                        const right = Math.max(...bounds.map(box => box.right));
                        const top = Math.min(...bounds.map(box => box.top));
                        const bottom = Math.max(...bounds.map(box => box.bottom));
                        context.fillStyle = background;
                        context.fillRect(left - padding, top - padding, right - left + padding * 2, bottom - top + padding * 2);
                    }
                    context.fillStyle = foreground;
                    lines.forEach(({text, y}) => context.fillText(text, 800, y, 1360));
                };
                context.font = `${nameSize}px "carbontyperegular"`;
                drawTextPanel(headingRows, nameSize);

                // Render at the SVG's native size, with ample quiet space.
                context.imageSmoothingEnabled = false;
                context.drawImage(image, qrX, qrY, size, size);
                context.font = '64px "carbontyperegular"';
                drawTextPanel([{text: "Scan the QR Code to see", y: 1730+footerShift}, {text: "upcoming gigs on Giglist", y: 1830+footerShift}], 64);
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
    }, [listingBackground, invertFonts, bannerUpload, backgroundUpload, useCustomBackground, targetUrl, background, foreground, displayName, poster, theme, header, headerCaps, selectedListStyle, weekendOnly, periodLabel, artwork, inverted, venueImage, gigs, month, isVenue, isSuburb, locationPhoto, posterFonts, useVenuePhoto, venuePhotoAttempt]);

    const backgroundUploadControls = <>
                    <div className="poster-upload-row">
                        <label className="poster-upload-button">Upload Background<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload Background" aria-invalid={!!uploadErrors.background} aria-describedby={uploadErrors.background ? "background-upload-error" : undefined} onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; void upload(file, 'background'); }} /></label>
                        {backgroundUpload && <button type="button" aria-label="Remove Custom Background" onClick={() => { setBackgroundUpload(null); setUseCustomBackground(false); }}>Remove</button>}
                    </div>
                    {uploadErrors.background && <p id="background-upload-error" className="poster-upload-error" role="alert">{uploadErrors.background}</p>}
    </>;

    return (
        <ToolFrame title={poster ? "Create Poster" : "Create QR Code"} url={targetUrl}>
        <div className={`qr-poster-page poster-editor${poster ? " poster-print-editor" : " qr-code-editor"}`}>
            <Helmet>
                <title>{poster ? "Giglist | Printable gig poster" : "Giglist | Printable QR code"}</title>
                <meta name="robots" content="noindex" />
                <body className={`qr-poster-body${inverted ? " qr-poster-inverted" : ""}${poster ? " gig-poster-body" : ""}`} />
            </Helmet>
            <aside className="qr-poster-controls" aria-busy={rendering || uploading || !!activeShuffle || locationLoading}>
                {poster && (rendering || uploading || !!activeShuffle || locationLoading) && <div className="poster-panel-loading" role="status" aria-label="Updating poster">
                    <span className="poster-button-spinner" aria-hidden="true" />
                </div>}
                <fieldset className="poster-controls-fieldset" disabled={uploading || (poster && (rendering || !!activeShuffle || locationLoading))}>
                <div className="poster-panel-heading"><h2>{poster ? "Poster Settings" : "QR Code Settings"}</h2>
                    <button type="button" className="poster-panel-toggle" aria-expanded={configOpen} aria-controls="poster-settings-content"
                        onClick={() => setConfigOpen(value => !value)}>{configOpen ? "Close" : "Configure"}</button>
                </div>
                <div id="poster-settings-content" className={`poster-controls-content${configOpen ? " is-open" : ""}`}>
                <p>QR code links to <a href={targetUrl}>{targetUrl}</a></p>
                {poster && <p>{periodLabel || (month === undefined ? "Upcoming gigs" : `Live music in ${posterMonthNames[month]}`)} · {gigs.length} listings</p>}




                {poster && <>
                    <ShuffleControl label="Poster Theme" value={theme} options={posterThemes.map(item => ({value: item.id, label: item.name}))} onChange={chooseTheme}>
                    <button type="button" className="poster-random" {...shuffleProps("Shuffle Theme")} onClick={() => {
                        setActiveShuffle("Shuffle Theme");
                        const next = randomPosterTheme(theme); setTheme(next);
                    }}>
                        {shuffleLabel("Shuffle Theme")}
                    </button>
                    </ShuffleControl>
                    <label className="poster-theme-label">Month
                        <select aria-label="Poster month" value={dateRange ? 'custom' : selectedMonth ?? 'all'} onChange={event=>{setSelectedMonth(event.target.value==='all'?undefined:event.target.value);setDateRange(null);setWeekendOnly(false);}}>
                            <option value="all">All dates</option>
                            {months.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}
                            {dateRange&&<option value="custom" disabled>Custom Date Range</option>}
                        </select>
                    </label>
                    <div className="poster-date-range">
                        <label>From<input type="date" aria-label="Poster start date" value={rangeStart} onChange={event=>setRangeStart(event.target.value)} /></label>
                        <label>To<input type="date" aria-label="Poster end date" value={rangeEnd} min={rangeStart || undefined} onChange={event=>setRangeEnd(event.target.value)} /></label>
                        <button type="button" disabled={!validRange} onClick={()=>{setDateRange({start:rangeStart,end:rangeEnd});setSelectedMonth(undefined);setWeekendOnly(false);}}>Apply Date Range</button>
                        {rangeStart&&rangeEnd&&rangeStart>rangeEnd&&<p role="alert">End date must be on or after the start date.</p>}
                    </div>
                    <label className="poster-weekend-toggle"><input type="checkbox" checked={weekendOnly} onChange={event => { setWeekend(upcomingWeekend()); setWeekendOnly(event.target.checked); }} /> Upcoming Weekend (Fri–Sun)</label>
                    <ShuffleControl label="Header Artwork" value={header} options={[...posterHeaders.map(value => ({value, label: artworkLabel(posterHeaderNames[value])})), ...(bannerUpload ? [{value: "custom", label: artworkLabel(bannerUpload.name)}] : [])]} onChange={chooseHeader}>
                    <button type="button" className="poster-header-shuffle" {...shuffleProps("Shuffle Header")} title={`Current header: ${header}`} onClick={() => { setActiveShuffle("Shuffle Header"); const next = nextPosterHeader(header); setHeader(next); setHeaderCaps(!(headerCaps ?? (currentPosterFonts().title === "Poster Condensed"))); }}>{shuffleLabel("Shuffle Header")}</button>
                    </ShuffleControl>
                    <div className="poster-upload-row">
                        <label className="poster-upload-button">Upload Banner<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload Banner" aria-invalid={!!uploadErrors.banner} aria-describedby={uploadErrors.banner ? "banner-upload-error" : undefined} onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; void upload(file, 'banner'); }} /></label>
                        {bannerUpload && <button type="button" aria-label="Remove Custom Banner" onClick={() => { setBannerUpload(null); if (header === 'custom') setHeader('gradient'); }}>Remove</button>}
                    </div>
                    {uploadErrors.banner && <p id="banner-upload-error" className="poster-upload-error" role="alert">{uploadErrors.banner}</p>}
                    <ShuffleControl label="Poster Font" afterSelect={<button type="button" className="poster-invert-fonts" aria-pressed={invertFonts} onClick={()=>setInvertFonts(value=>!value)}>Invert Fonts</button>} value={currentPosterFonts().listing} options={posterFontFamilies.map(value => ({value, label: value}))} onChange={chooseFont}>
                    <button type="button" className="poster-font-shuffle" {...shuffleProps("Shuffle Fonts")} onClick={() => {
                        setActiveShuffle("Shuffle Fonts");
                        const next = nextListingFonts(currentPosterFonts());
                        setPosterFonts({...next, title: next.listing});
                    }}>{shuffleLabel("Shuffle Fonts")}</button>
                    </ShuffleControl>
                    <ShuffleControl label="Background" value={imageValue} options={imageOptions} onChange={chooseImage}>
                    <button type="button" className="poster-shuffle" {...shuffleProps("Shuffle Background")} disabled={!!activeShuffle || (!!locationPhoto && locationPhotos.length < 2)} onClick={() => { setActiveShuffle("Shuffle Background"); shuffleImage(); }}>{shuffleLabel("Shuffle Background")}</button>
                    </ShuffleControl>
                    {backgroundUploadControls}
                    {venueImage && <label className="poster-weekend-toggle poster-venue-photo"><input type="checkbox" checked={imageValue==='venue'} onChange={event=>chooseImage(event.target.checked?'venue':artwork)} /> Use Venue Photo</label>}
                    {isSuburb && !locationPhoto && <button type="button" className="poster-location" aria-pressed={!!locationPhoto}
                        disabled={locationLoading || !displayName} onClick={useLocationImagery}>
                        {locationLoading ? "Finding Local Photos…" : "Location Imagery"}
                    </button>}
                    {locationMessage && <p role="status">{locationMessage}</p>}
                    <ShuffleControl label="List Style" value={selectedListStyle}
                        options={availableListStyles.map(value => ({value, label: listStyleNames[value]}))} disabled={weekendOnly && !isArtistPoster}
                        onChange={value => {setListStyle(value as ListStyle); seenListStyles.current = [value as ListStyle];}}>
                        <button type="button" className="poster-list-style" disabled={weekendOnly && !isArtistPoster} onClick={() => {shuffleListStyle();}}>Shuffle List Style</button>
                    </ShuffleControl>
                    <label className="poster-weekend-toggle"><input type="checkbox" checked={listingBackground} onChange={event=>setListingBackground(event.target.checked)} /> Listing Background</label>
                    <div className="poster-randomise-label">Randomise</div>
                    <button type="button" className="poster-shuffle-everything" {...shuffleProps("Shuffle All Styles")} onClick={() => {
                        setActiveShuffle("Shuffle All Styles");
                        const nextHeader = nextPosterHeader(header);
                        setHeader(nextHeader);
                        setHeaderCaps(Math.random() < 0.5);
                        shuffleListStyle();
                        const next = randomPosterTheme(theme);
                        const currentFonts = currentPosterFonts();
                        setTheme(next);
                        const fonts = nextListingFonts(currentFonts);
                        setPosterFonts({...fonts, title: fonts.listing});
                    }}>{shuffleLabel("Shuffle All Styles")}</button>
                    <div className="poster-settings-gap" aria-hidden="true" />
                </>}
                {!poster && backgroundUploadControls}
                {!poster && <label className="poster-theme-label">Colours
                    <select aria-label="QR colours" value={inverted ? "light" : "dark"} onChange={event => setInverted(event.target.value === "light")}><option value="dark">Black on white</option><option value="light">White on black</option></select>
                </label>}
                {!poster && <button type="button" aria-pressed={inverted} onClick={() => setInverted(value => !value)}>Invert Colours</button>}
                <div className="poster-export-actions">
                {png && !rendering && !uploading && <a className="qr-poster-button" href={png}
                    download={`giglist-${targetUrl.split("/").pop()}-${poster ? theme + "-poster" + (weekendOnly ? "-weekend-" + weekend.start : "") + (weekendOnly ? "" : dateRange ? "-" + dateRange.start + "-to-" + dateRange.end : month === undefined ? "" : "-" + posterMonths[month] + "-" + selectedMonth!.slice(0,4)) : "qr"}.png`}>Download PNG</a>}
                <button type="button" disabled={!ready || uploading || rendering} onClick={() => window.print()}>Print</button>
                </div>
                {!png && !error && <p role="status">{poster ? "Preparing your poster…" : "Preparing your QR code…"}</p>}
                {uploading && <p role="status">Preparing background image…</p>}
                {imageWarning && <p role="status">{imageWarning}</p>}
                {error && <p role="alert">{error}</p>}
                {!poster && <p className="qr-config-footnote">Giglist can make mistakes, please check the QR Code before sharing</p>}
                </div>
                </fieldset>
            </aside>
            <div ref={qrRef} hidden aria-hidden="true">
                <QRCode value={targetUrl} level="M" size={!poster && useCustomBackground && backgroundUpload ? 896 : 1120}
                    bgColor={poster ? "#fff" : background} fgColor={poster ? "#000" : foreground} />
            </div>
            {poster && !png && <div className="poster-preview-status">
                <p role={feedError || error ? 'alert' : 'status'}>{feedError || error || 'Loading poster…'}</p>
                {(feedError || error) && <button type="button" onClick={()=>setFeedRetry(value=>value+1)}>Retry</button>}
            </div>}
            {png && <img className="qr-poster-image" src={png}
                onLoad={() => setReady(true)}
                alt={poster ? `${displayName}: ${periodLabel || (month === undefined ? "Upcoming gigs" : "Live music in " + posterMonthNames[month])}. ${gigs.length} listings. Scan QR code for gig details.` : `${displayName}. QR code for ${targetUrl}. ${caption}`} />}
        </div>
        </ToolFrame>
    );
};
