import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { getTourProfile } from "../utils/tourProfile";
import { compactName } from "../utils/searchUrl";
import { normalizeGigText } from "../utils/normalizeGigText";
import "./QrPoster.scss";

export const QrPoster = ({ targetUrl }: { targetUrl: string }) => {
    const qrRef = useRef<HTMLDivElement>(null);
    const [png, setPng] = useState("");
    const [ready, setReady] = useState(false);
    const [error, setError] = useState("");
    const [inverted, setInverted] = useState(false);
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [isVenue, setIsVenue] = useState(false);
    const captionLine = `upcoming gigs ${isVenue ? "at" : "for"}`;
    const caption = `Scan the QR Code to see ${captionLine}\n${displayName || ""}`;
    const background = inverted ? "#000" : "#fff";
    const foreground = inverted ? "#fff" : "#000";

    useEffect(() => {
        let cancelled = false;
        const name = decodeURIComponent(new URL(targetUrl).pathname.slice(1));
        const slug = compactName(name);
        setDisplayName(null);
        axios.get("https://giglist.com.au/feed_national.php", { timeout: 10000 })
            .then(({ data }) => {
                if (!cancelled) {
                    const profile = getTourProfile(normalizeGigText(data), slug);
                    setIsVenue(profile.isVenue);
                    setDisplayName(profile.title);
                }
            })
            .catch(() => {
                if (!cancelled) setDisplayName(name.replace(/[-_]/g, " "));
            });
        return () => { cancelled = true; };
    }, [targetUrl]);

    useEffect(() => {
        let cancelled = false;
        let objectUrl = "";
        setPng("");
        setReady(false);
        setError("");
        if (!displayName) return;

        const generate = async () => {
            try {
                const fonts = await document.fonts.load('184px "carbontyperegular"');
                if (!fonts.length) throw new Error("Giglist font could not load");
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
    }, [targetUrl, background, foreground, displayName, captionLine]);

    return (
        <div className="qr-poster-page">
            <Helmet>
                <title>Giglist | Printable QR code</title>
                <meta name="robots" content="noindex" />
                <body className={`qr-poster-body${inverted ? " qr-poster-inverted" : ""}`} />
            </Helmet>
            <div className="qr-poster-controls">
                <p>QR code links to <a href={targetUrl}>{targetUrl}</a></p>
                {png && <a className="qr-poster-button" href={png}
                    download={`giglist-${targetUrl.split("/").pop()}-qr.png`}>Download PNG</a>}
                <button type="button" disabled={!ready} onClick={() => window.print()}>Print</button>
                <button type="button" aria-pressed={inverted}
                    onClick={() => setInverted((value) => !value)}>Invert colours</button>
                {!png && !error && <p role="status">Preparing your QR code…</p>}
                {error && <p role="alert">{error}</p>}
            </div>
            <div ref={qrRef} hidden aria-hidden="true">
                <QRCode value={targetUrl} level="M" size={1120}
                    bgColor={background} fgColor={foreground} />
            </div>
            {png && <img className="qr-poster-image" src={png}
                onLoad={() => setReady(true)}
                alt={`Giglist. QR code for ${targetUrl}. ${caption}`} />}
        </div>
    );
};
