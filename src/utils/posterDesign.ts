import { uniquePosterGigs } from "./posterDuplicates";
import { paintPosterText, PosterTextEffect } from "./posterTextEffects";
import { drawFestivalWordCloud, ListStyle } from "../components/Poster/FestivalWordCloud";
import { TGiglist, TListing } from "../types/types";
import { filterGigSearch } from "./searchUrl";
import moment from "moment";

import { posterThemes, PosterTheme, PosterFonts } from "./posterThemes";
export { posterThemes, randomPosterTheme } from "./posterThemes";

export const realVenueImage = (value?: string): string | null => {
    if (!value) return null;
    try {
        const url = new URL(value, "https://giglist.com.au");
        if (!/^https?:$/.test(url.protocol) || /newlogogiglist|favicon|fallback|placeholder|no[-_]?image|default[-_]?image/i.test(url.pathname)) return null;
        return url.href;
    } catch { return null; }
};

export const posterMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const posterGigs = (dates: TGiglist, slug: string, month?: number): TListing[] =>
    uniquePosterGigs(filterGigSearch(dates, slug, true).flatMap((date) => date.listings))
        .filter((gig) => month === undefined || Number(gig.date.slice(5, 7)) === month + 1)
        .sort((a, b) => a.date.localeCompare(b.date));

const wrap = (ctx: CanvasRenderingContext2D, text: string, width: number): string[] => {
    const lines: string[] = [];
    let line = "";
    for (const word of text.split(/\s+/)) {
        if (line && ctx.measureText(`${line} ${word}`).width > width) { lines.push(line); line = ""; }
        // Break exceptionally long unspaced names rather than clipping them.
        for (const char of (line ? " " : "") + word) {
            if (line && ctx.measureText(line + char).width > width) { lines.push(line); line = ""; }
            line += char;
        }
    }
    if (line) lines.push(line);
    return lines;
};


type Box = { x: number; y: number; width: number; height: number };
type PosterOptions = {
    theme: string; title: string; targetUrl: string;
    qr: HTMLImageElement; photo: HTMLImageElement | null; artwork?: HTMLImageElement | null;
    fonts?: PosterFonts;
    header?: PosterHeader;
    listStyle?: ListStyle;
    periodLabel?: string;
    photoCredit?: string;
    gigs?: TListing[]; month?: number; isVenue?: boolean; isSuburb?: boolean;
};

const rect = (ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = color; ctx.fillRect(x, y, w, h);
};
const line = (ctx: CanvasRenderingContext2D, color: string, x: number, y: number, x2: number, y2: number, weight = 2) => {
    ctx.strokeStyle = color; ctx.lineWidth = weight; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
};
const font = (size: number, family: string, bold = false) => `${bold ? '700 ' : ''}${size}px "${family}", sans-serif`;

const fittedText = (ctx: CanvasRenderingContext2D, text: string, box: Box, family: string, maxSize: number, align: CanvasTextAlign = 'left', bold = false, verticallyCentered = false, effect: PosterTextEffect = 'plain') => {
    let size = maxSize, lines: string[] = [];
    for (let step = 0; step < 120; step++) {
        ctx.font = font(size, family, bold);
        lines = text.split('\n').flatMap((part) => wrap(ctx, part, box.width));
        if (lines.length * size * 1.08 <= box.height && lines.every((value) => ctx.measureText(value).width <= box.width)) break;
        size *= 0.94;
    }
    ctx.textAlign = align; ctx.textBaseline = 'top';
    const x = align === 'center' ? box.x + box.width / 2 : align === 'right' ? box.x + box.width : box.x;
    const textTop = box.y + (verticallyCentered ? (box.height - lines.length * size * 1.08) / 2 : 0);
    lines.forEach((value, i) => paintPosterText(ctx, value, x, textTop + i * size * 1.08, effect));
    ctx.textAlign = 'left';
    const lastLine = ctx.measureText(lines[lines.length - 1] || '');
    const visibleHeight = lastLine.actualBoundingBoxDescent ?? size * 0.85;
    return { size, bottom: textTop + Math.max(0, lines.length - 1) * size * 1.08 + visibleHeight };
};

const drawPhoto = (ctx: CanvasRenderingContext2D, photo: HTMLImageElement, box: Box) => {
    const scale = Math.max(box.width / photo.naturalWidth, box.height / photo.naturalHeight);
    const sw = box.width / scale, sh = box.height / scale;
    ctx.drawImage(photo, (photo.naturalWidth - sw) / 2, (photo.naturalHeight - sh) / 2, sw, sh, box.x, box.y, box.width, box.height);
};

type ListingArea = Box & { columns: number; ink: string; accent: string; backdrop?: string; shadow?: boolean };

const fade = (ctx: CanvasRenderingContext2D, y: number, height: number, stops: [number, string][]) => {
    const gradient = ctx.createLinearGradient(0, y, 0, y + height);
    stops.forEach(([at, colour]) => gradient.addColorStop(at, colour));
    ctx.fillStyle = gradient; ctx.fillRect(0, y, 1600, height);
};

export const posterHeaders = ['gradient', 'photo', 'smear', 'band', 'gradient-centered', 'photo-centered', 'smear-centered', 'band-centered'] as const;
export type PosterHeader = typeof posterHeaders[number];
export const nextPosterHeader = (current: PosterHeader, random = Math.random): PosterHeader => {
    const choices = posterHeaders.filter(value => value !== current);
    return choices[Math.floor(random() * choices.length)];
};

// Independent of layout: protect the artist, venue or suburb name on every poster.
const headerBackground = (ctx: CanvasRenderingContext2D, theme: PosterTheme, options: PosterOptions, box: Box) => {
    const style = (options.header || 'gradient').replace('-centered', '');
    const y = box.y - 40, height = box.height + 75;
    const rgb = theme.background.slice(1).match(/../g)!.map(value => parseInt(value, 16));
    const light = rgb[0] * .299 + rgb[1] * .587 + rgb[2] * .114 > 145;
    const field = light ? theme.ink : '#' + rgb.map(value => Math.round(value * .4).toString(16).padStart(2, '0')).join('');
    ctx.save();
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    if (style === 'smear') {
        for (let x = 0; x < 1600; x += 5) {
            const grain = Math.abs(Math.sin(x * 12.9898) * 43758.5453) % 1;
            rect(ctx, field, x, y + grain * 12, 6, height - grain * 24);
            rect(ctx, field + '60', x, y - 5 + grain * 10, 3, height + 10 - grain * 20);
        }
    } else if (style === 'band') {
        rect(ctx, field, 30, y, 1540, height);
        if (!options.header?.endsWith('-centered')) rect(ctx, theme.accent, 30, y, 8, height);
    } else {
        const photo = options.photo || options.artwork;
        if (style === 'photo' && photo) drawPhoto(ctx, photo, {x: 0, y, width: 1600, height});
        const wash = ctx.createLinearGradient(0, y, 1600, y + height);
        wash.addColorStop(0, field + (style === 'photo' ? 'cc' : 'ff'));
        wash.addColorStop(.6, field + (style === 'photo' ? 'b8' : 'ff'));
        wash.addColorStop(1, style === 'photo' ? field + 'cc' : '#' + theme.accent.slice(1).match(/../g)!.map(value => Math.round(parseInt(value, 16) * .45).toString(16).padStart(2, '0')).join(''));
        ctx.fillStyle = wash; ctx.fillRect(0, y, 1600, height);
    }
    ctx.restore();
    return light ? theme.background : theme.ink;
};

// Every composition reserves its own image, title and date regions.
const composition = (ctx: CanvasRenderingContext2D, theme: PosterTheme, options: PosterOptions): ListingArea => {
    const { id, background: bg, ink, accent } = theme;
    const photo = options.photo || options.artwork;
    const dense = (!!options.listStyle && options.listStyle !== 'columns') || (options.gigs?.length || 0) > 20;
    const month = options.periodLabel || (options.month === undefined ? 'LIVE MUSIC' : `LIVE MUSIC IN ${posterMonthNames[options.month].toUpperCase()}`);
    let titleBox = { x: 100, y: 105, width: 1400, height: 285 };
    const centered = options.header?.endsWith('-centered');
    let titleInk = ink, titleSize = 265, align: CanvasTextAlign = 'left';
    let labelBox = { x: 100, y: 405, width: 1400, height: 50 };
    let area: ListingArea = {x: 100, y: 1190, width: 1400, height: 520, columns: 2, ink, accent};
    const photoAt = (box: Box, filter = 'none') => {
        if (!photo) return;
        ctx.save(); ctx.filter = filter; drawPhoto(ctx, photo, box); ctx.restore();
    };
    if (theme.layout) {
        const alt = !!theme.alternate;
        const mono = ['rail', 'ticket', 'collage', 'masthead'].includes(theme.layout);
        const filter = mono ? 'grayscale(1) contrast(1.15)' : 'saturate(0.75)';
        align = alt ? 'right' : 'left';
        titleBox = {x: 90, y: 90, width: 1420, height: 290};
        titleSize = theme.font === 'Poster Condensed' ? 290 : 220;
        area = {x: 90, y: 1060, width: 1420, height: 650, columns: 2, ink, accent};
        if (dense) {
            photoAt({x: 0, y: 0, width: 1600, height: 1930}, filter);
            // Retain the image across the entire bill, with theme-specific text protection.
            rect(ctx, bg + (mono ? '70' : '99'), 0, 0, 1600, 1930);
            const inset = theme.layout === 'frame' || theme.layout === 'ticket' ? 100 : 65;
            if (['masthead', 'collage', 'rail', 'split'].includes(theme.layout)) {
                rect(ctx, bg + 'f5', 35, 35, 1530, 245);
                if (!centered) rect(ctx, accent, alt ? 1525 : 35, 35, 40, 245);
            } else {
                rect(ctx, bg + 'df', inset - 20, 45, 1640 - inset * 2, 245);
                line(ctx, accent, inset, 285, 1600 - inset, 285, theme.layout === 'cover' ? 1 : 4);
            }
            titleBox = {x: inset, y: 75, width: 1600 - inset * 2, height: 150};
            if (centered) align = 'center';
            const headerInk = headerBackground(ctx, theme, options, titleBox);
            ctx.fillStyle = headerInk;
            const heading = fittedText(ctx, theme.font === 'Poster Condensed' ? options.title.toUpperCase() : options.title, titleBox, theme.font, 170, align, false, false, options.fonts?.headerEffect);
            ctx.fillStyle = headerInk;
            fittedText(ctx, month, {x: inset, y: heading.bottom + 20, width: titleBox.width, height: 50}, 'Poster Grotesk', 32, align, true);
            return {x: inset, y: 300, width: 1600 - inset * 2, height: 1410, columns: 3, ink, accent, backdrop: bg + (alt ? 'e8' : 'da')};
        }
        switch (theme.layout) {
            case 'sleeve':
                photoAt({x: alt ? 0 : 90, y: 460, width: alt ? 1600 : 1420, height: 600}, filter);
                line(ctx, accent, 90, 1110, 1510, 1110, 2);
                area.y = 1160; area.height = 550;
                break;
            case 'window':
                rect(ctx, accent, alt ? 835 : 70, 460, 695, 1250);
                photoAt({x: alt ? 855 : 90, y: 480, width: 655, height: 1210}, filter);
                area = {x: alt ? 90 : 825, y: 490, width: 685, height: 1220, columns: 1, ink, accent};
                break;
            case 'frame':
                photoAt({x: 45, y: 45, width: 1510, height: 1685}, filter);
                rect(ctx, bg + 'a6', 45, 45, 1510, 1685);
                rect(ctx, bg + 'dd', 100, 100, 1400, 550);
                ctx.strokeStyle = accent; ctx.lineWidth = 2;
                ctx.strokeRect(65, 65, 1470, 1645); ctx.strokeRect(78, 78, 1444, 1619);
                titleBox = {x: 130, y: alt ? 145 : 180, width: 1340, height: 360};
                align = alt ? 'left' : 'center';
                area = {x: 130, y: 740, width: 1340, height: 930, columns: 2, ink, accent, backdrop: bg + 'de'};
                break;
            case 'masthead':
                rect(ctx, ink, 0, 0, 1600, 440);
                titleInk = bg; titleBox.y = 75;
                photoAt({x: 90, y: 490, width: 1420, height: alt ? 360 : 500}, filter);
                area.y = alt ? 950 : 1090; area.height = 1710 - area.y;
                line(ctx, accent, 90, area.y - 40, 1510, area.y - 40, alt ? 14 : 2);
                break;
            case 'horizon':
                photoAt({x: 0, y: alt ? 0 : 460, width: 1600, height: alt ? 780 : 520}, filter);
                if (alt) {
                    rect(ctx, bg + 'b8', 0, 0, 1600, 780);
                    titleBox.y = 115; titleBox.height = 360;
                    area.y = 890; area.height = 820;
                } else { align = 'center'; area.y = 1070; area.height = 640; }
                break;
            case 'split':
                photoAt({x: alt ? 0 : 780, y: 0, width: 820, height: 1710}, filter);
                rect(ctx, bg + '40', alt ? 0 : 780, 0, 820, 1710);
                rect(ctx, bg, 0, 60, 1600, 400);
                area = {x: alt ? 880 : 90, y: 540, width: 630, height: 1170, columns: 1, ink, accent};
                break;
            case 'rail':
                photoAt({x: 0, y: 0, width: 1600, height: 1930}, filter);
                rect(ctx, bg + 'dd', 0, 0, 1600, 1930);
                if (!centered) rect(ctx, accent, alt ? 1500 : 0, 0, 100, 1730);
                titleBox = {x: alt ? 90 : 160, y: 100, width: 1340, height: 430};
                area = {x: titleBox.x, y: 700, width: 1340, height: 1010, columns: 2, ink, accent};
                line(ctx, accent, area.x, 640, area.x + area.width, 640, 8);
                break;
            case 'ticket':
                photoAt({x: 80, y: 70, width: 1440, height: 1640}, filter);
                rect(ctx, bg + 'e8', 80, 70, 1440, 1640);
                titleBox = {x: 145, y: 130, width: 1310, height: 350};
                area = {x: 145, y: 650, width: 1310, height: 990, columns: 2, ink, accent};
                ctx.strokeStyle = accent; ctx.lineWidth = alt ? 2 : 5; ctx.strokeRect(90, 80, 1420, 1620);
                for (let y = 120; y < 1670; y += 36) {
                    rect(ctx, accent, 102, y, 13, 7); rect(ctx, accent, 1485, y, 13, 7);
                }
                line(ctx, accent, 145, 580, 1455, 580, 3);
                break;
            case 'cover':
                photoAt({x: 0, y: 0, width: 1600, height: 1930}, filter);
                fade(ctx, 0, 1930, [[0, bg + 'bb'], [.3, bg + '66'], [.52, bg + 'e6'], [1, bg]]);
                titleBox = {x: 90, y: alt ? 130 : 280, width: 1420, height: 390};
                titleSize = alt ? 225 : 320; align = alt ? 'left' : 'center';
                area.y = alt ? 890 : 1040; area.height = 1710 - area.y;
                break;
            case 'collage':
                photoAt({x: 70, y: 430, width: alt ? 1000 : 720, height: 510}, filter);
                photoAt({x: alt ? 1110 : 830, y: 470, width: alt ? 420 : 700, height: 470}, 'grayscale(1) contrast(1.7)');
                rect(ctx, accent, alt ? 40 : 1440, 400, 85, 150);
                titleBox.y = 80;
                area.y = 1030; area.height = 680;
                line(ctx, ink, 90, 985, 1510, 985, 3);
                break;
        }
        if (centered) align = 'center';
        const subtitleInk = headerBackground(ctx, theme, options, titleBox);
        ctx.fillStyle = subtitleInk;
        const heading = fittedText(ctx, theme.font === 'Poster Condensed' ? options.title.toUpperCase() : options.title, titleBox, theme.font, titleSize, align, false, true, options.fonts?.headerEffect);
        ctx.fillStyle = subtitleInk;
        fittedText(ctx, month, {x: titleBox.x, y: heading.bottom + 22, width: titleBox.width, height: 50}, 'Poster Grotesk', 32, align, true);
        return area;
    }
    if (dense) {
        // Dense lineups retain the theme's full-page imagery, not a thumbnail layout.
        photoAt({x: 0, y: 0, width: 1600, height: 1930}, id === 'redroom' || id === 'xerox' ? 'grayscale(1) contrast(1.3)' : 'saturate(0.85)');
        let backdrop: string | undefined;
        let shadow = false;
        let headingInk = ink, headingAccent = accent;
        switch (id) {
            case 'nocturne':
                fade(ctx, 0, 1930, [[0, 'rgba(4,18,19,0.56)'], [0.3, 'rgba(4,18,19,0.65)'], [0.8, 'rgba(4,18,19,0.59)'], [1, 'rgba(4,18,19,0.78)']]);
                shadow = true;
                break;
            case 'wildflower':
                rect(ctx, 'rgba(238,233,220,0.18)', 0, 0, 1600, 1930);
                rect(ctx, 'rgba(248,241,220,0.90)', 40, 30, 1520, 260);
                backdrop = 'rgba(248,241,220,0.86)';
                break;
            case 'xerox':
                rect(ctx, 'rgba(0,0,0,0.24)', 0, 0, 1600, 1930);
                rect(ctx, 'rgba(0,0,0,0.83)', 40, 30, 1520, 260);
                headingInk = '#fff7df'; headingAccent = '#ebf26c';
                backdrop = 'rgba(245,242,228,0.91)';
                break;
            case 'solar':
                rect(ctx, 'rgba(166,48,15,0.22)', 0, 0, 1600, 1930);
                rect(ctx, 'rgba(249,177,106,0.92)', 40, 30, 1520, 260);
                backdrop = 'rgba(255,222,170,0.86)';
                break;
            case 'bluehour':
                fade(ctx, 0, 1930, [[0, 'rgba(14,20,60,0.54)'], [0.4, 'rgba(14,20,60,0.68)'], [0.8, 'rgba(14,20,60,0.60)'], [1, 'rgba(14,20,60,0.82)']]);
                shadow = true;
                break;
            case 'redroom':
                ctx.save(); ctx.globalCompositeOperation = 'multiply';
                rect(ctx, '#d74437', 0, 0, 1600, 1930); ctx.restore();
                rect(ctx, 'rgba(25,0,0,0.28)', 0, 0, 1600, 1930);
                backdrop = 'rgba(41,5,4,0.68)';
                shadow = true;
                break;
        }
        ctx.save();
        if (shadow) { ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3; }
        headingInk = headerBackground(ctx, theme, options, {x: 65, y: 70, width: 1470, height: 165});
        headingAccent = headingInk;
        ctx.fillStyle = headingInk;
        const title = theme.font === 'Poster Condensed' ? options.title.toUpperCase() : options.title;
        const align = centered || id === 'solar' || id === 'wildflower' ? 'center' : 'left';
        const heading = fittedText(ctx, title, {x: 65, y: 70, width: 1470, height: 165}, theme.font, 180, align, false, false, options.fonts?.headerEffect);
        ctx.fillStyle = headingAccent;
        fittedText(ctx, month, {x: 65, y: heading.bottom + 22, width: 1470, height: 55}, 'Poster Grotesk', 34, align, true);
        ctx.restore();
        return {x: 65, y: 290, width: 1470, height: 1420, columns: 3, ink, accent, backdrop, shadow};
    }
    switch (id) {
        case 'nocturne':
            photoAt({x: 0, y: 0, width: 1600, height: 1930}, 'saturate(0.6)');
            fade(ctx, 0, 1930, [[0, 'rgba(5,15,16,0.72)'], [0.29, 'rgba(5,15,16,0.05)'], [0.50, 'rgba(5,15,16,0.85)'], [0.68, bg], [1, bg]]);
            titleBox = {x: 100, y: 110, width: 1400, height: 435}; titleSize = 370;
            labelBox.y = 905; area.y = 1000; area.height = 710;
            break;
        case 'wildflower':
            titleBox = {x: 100, y: 115, width: 1400, height: 380}; titleSize = 230;
            photoAt({x: 800, y: 565, width: 730, height: 1135});
            area = {x: 100, y: 620, width: 620, height: 1090, columns: 1, ink, accent};
            line(ctx, ink, 100, 65, 1500, 65, 2);
            break;
        case 'xerox':
            photoAt({x: 0, y: 0, width: 1600, height: 1050}, 'grayscale(1) contrast(1.6)');
            fade(ctx, 0, 1050, [[0, 'rgba(0,0,0,0.83)'], [0.46, 'rgba(0,0,0,0.3)'], [1, 'rgba(0,0,0,0)']]);
            titleInk = '#f7f1df'; titleSize = 350; titleBox.height = 400;

            labelBox = {x: 130, y: 551, width: 1330, height: 45};
            rect(ctx, bg, 0, 1050, 1600, 880);
            for (let x = 0; x < 1600; x += 17) rect(ctx, bg, x, 1040 + Math.sin(x * 0.21) * 8, 18, 20);
            area.y = 1130; area.height = 580;
            break;
        case 'solar':
            titleSize = 320; align = 'center';
            photoAt({x: 80, y: 485, width: 1440, height: 570}, 'saturate(0.65) sepia(0.18)');
            labelBox.y = 1100; area.y = 1190;
            break;
        case 'bluehour':
            photoAt({x: 0, y: 0, width: 1600, height: 1930});
            rect(ctx, 'rgba(12,25,61,0.25)', 0, 0, 1600, 1930);
            fade(ctx, 0, 1930, [[0, 'rgba(10,22,52,0.1)'], [0.27, 'rgba(10,22,52,0.15)'], [0.48, 'rgba(10,22,52,0.94)'], [0.63, bg], [1, bg]]);
            titleBox = {x: 100, y: 510, width: 1400, height: 400}; titleSize = 235;
            labelBox.y = 945; area.y = 1050; area.height = 660;
            break;
        case 'redroom':
            photoAt({x: 775, y: 0, width: 825, height: 1710}, 'grayscale(1) contrast(1.2)');
            rect(ctx, 'rgba(0,0,0,0.5)', 775, 0, 825, 1710);
            titleBox = {x: 100, y: 120, width: 1380, height: 430}; titleSize = 340;
            labelBox = {x: 100, y: 630, width: 620, height: 70};
            area = {x: 100, y: 650, width: 610, height: 1060, columns: 1, ink, accent};
            break;
    }
    if (centered) align = 'center';
    titleInk = headerBackground(ctx, theme, options, titleBox);
    ctx.fillStyle = titleInk;
    const title = theme.font === 'Poster Condensed' ? options.title.toUpperCase() : options.title;
    const heading = fittedText(ctx, title, titleBox, theme.font, titleSize, align, false, true, options.fonts?.headerEffect);
    labelBox = {x: titleBox.x, y: heading.bottom + 22, width: titleBox.width, height: 55};
    ctx.fillStyle = titleInk;
    fittedText(ctx, month, labelBox, 'Poster Grotesk', 34, align, true);
    return area;
};

// Small deterministic ink flecks give exports a print surface, without re-randomising on render.
const paperGrain = (ctx: CanvasRenderingContext2D) => {
    ctx.save(); ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.055;
    let seed = 731;
    const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 6200; i++) {
        const x = random() * 1600, y = random() * 1720, size = 0.8 + random() * 2.3;
        ctx.fillRect(x, y, size, size);
    }
    ctx.restore();
};

type GigRow = { name: string[]; meta: string[]; height: number };
const listingLayout = (ctx: CanvasRenderingContext2D, gigs: TListing[], options: PosterOptions, width: number, height: number, preferredColumns: number) => {
    const candidates = (gigs.length < 3 ? [1] : preferredColumns === 1 ? [1] : gigs.length > 40 ? [2, 3, 4] : [1, 2, 3]).map((columns) => {
        const columnWidth = (width - (columns - 1) * 52) / columns;
        let size = gigs.length <= 2 ? 100 : 84;
        let rows: GigRow[] = [];
        const perColumn = Math.ceil(gigs.length / columns);
        for (;;) {
            const measuredSize = size;
            rows = gigs.map((gig) => {
                const nameWidth = columnWidth - 10;
                ctx.font = font(measuredSize, options.fonts?.listing || 'Poster Grotesk', options.fonts?.listing !== 'Poster Serif');
                const name = wrap(ctx, (options.isVenue || options.isSuburb ? gig.artist : gig.name).replace(/&amp;/gi, '&'), Math.max(1, nameWidth));
                const place = options.isSuburb ? gig.name : options.isVenue ? '' : [gig.suburb, gig.state].filter(Boolean).join(', ');
                const date = moment(gig.date).format('ddd D MMM YYYY');
                const parts = [date, gig.start, place];
                ctx.font = font(measuredSize * 0.63, 'Poster Grotesk');
                const meta = wrap(ctx, parts.filter(Boolean).join(' · ').replace(/&amp;/gi, '&'), Math.max(1, nameWidth));
                return { name, meta, height: measuredSize * (name.length * 1.13 + meta.length * 0.8 + 0.64) };
            });
            const measuredRows = rows;
            const tallest = Math.max(0, ...Array.from({length: columns}, (_, c) => measuredRows.slice(c * perColumn, (c + 1) * perColumn).reduce((sum, r) => sum + r.height, 0)));
            if (tallest <= height) break;
            size *= 0.98;
        }
        return { columns, columnWidth, size, rows, perColumn };
    });
    // Prefer fewer columns when their text is almost as large.
    return candidates.reduce((best, item) => item.size * (1 - (item.columns - 1) * 0.045) > best.size * (1 - (best.columns - 1) * 0.045) ? item : best);
};

export const drawPoster = (ctx: CanvasRenderingContext2D, options: PosterOptions) => {
    const selectedTheme = posterThemes.find((item) => item.id === options.theme) || posterThemes[0];
    const theme = {...selectedTheme, font: options.fonts?.title || selectedTheme.font};
    const bg = theme.background;
    const ink = theme.ink;
    const gigs = uniquePosterGigs(options.gigs || [], options.listStyle === 'festivalDays');
    ctx.save(); ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    rect(ctx, bg, 0, 0, 1600, 2000);
    const area = composition(ctx, theme, options);
    paperGrain(ctx);
    const layout = listingLayout(ctx, gigs, options, area.width, area.height, area.columns);
    const rowBounds: Box[] = [];
    if (!gigs.length) {
        ctx.fillStyle = ink;
        fittedText(ctx, options.periodLabel ? 'No gigs listed for this weekend.' : options.month === undefined ? 'No upcoming gigs listed.' : `No gigs listed in ${posterMonthNames[options.month]}.`, { x: area.x, y: area.y, width: area.width, height: 180 }, 'Poster Grotesk', 44);
    }
    if (options.listStyle && options.listStyle !== 'columns' && gigs.length) {
        const cloud = drawFestivalWordCloud(ctx, {
            area, effect: options.fonts?.effect, divider: options.listStyle, font: options.fonts?.listing || theme.font, ink: area.ink, accent: area.accent,
            backdrop: area.backdrop || bg + 'bb',
            entries: gigs.map(gig => ({
                dateKey: gig.date, dateLabel: moment(gig.date).format(options.listStyle === 'festivalDays' ? 'dddd D MMM YYYY' : 'ddd D MMM YYYY'),
                name: (options.listStyle === 'festivalDays' ? gig.artist.toUpperCase() : options.isVenue || options.isSuburb ? gig.artist : gig.name).replace(/&amp;/gi, '&'),
                details: options.listStyle === 'festivalDays' ? '' : [options.listStyle === 'dates' ? '' : moment(gig.date).format('ddd D MMM YYYY'), gig.start,
                    options.isSuburb ? gig.name : options.isVenue ? '' : [gig.suburb, gig.state].filter(Boolean).join(', ')].filter(Boolean).join(' · ').replace(/&amp;/gi, '&'),
            })),
        });
        rowBounds.push(...cloud.bounds);
        layout.size = cloud.fontSize;
        layout.columns = 1;
    } else for (let c = 0; c < layout.columns; c++) {
        const x = area.x + c * (layout.columnWidth + 52);
        let y = area.y;
        if (area.backdrop) rect(ctx, area.backdrop, x - 12, area.y - 14, layout.columnWidth + 24, area.height + 28);
        ctx.save();
        if (area.shadow) { ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 4; ctx.shadowOffsetY = 2; }
        layout.rows.slice(c * layout.perColumn, (c + 1) * layout.perColumn).forEach((row) => {
            const { size } = layout;
            ctx.fillStyle = area.ink;
            ctx.textAlign = 'left';
            let textY = y;
            ctx.font = font(size, options.fonts?.listing || 'Poster Grotesk', options.fonts?.listing !== 'Poster Serif');
            row.name.forEach((value) => { paintPosterText(ctx, value, x, textY, options.fonts?.effect); textY += size * 1.13; });
            ctx.fillStyle = area.accent;
            ctx.font = font(size * 0.63, 'Poster Grotesk');
            row.meta.forEach((value) => { ctx.fillText(value, x, textY); textY += size * 0.8; });
            rowBounds.push({ x, y, width: layout.columnWidth, height: row.height });
            y += row.height;
        });
        ctx.restore();
    }
    // The QR straddles the footer edge, clear of the listing region above.
    rect(ctx, '#000', 0, 1830, 1600, 170);
    rect(ctx, '#fff', 80, 1767, 180, 180);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(options.qr, 100, 1787, 140, 140);
    ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = '#fff';
    fittedText(ctx, 'Scan QR code for gig details & updates', { x: 300, y: 1872, width: 1000, height: 40 }, 'Poster Grotesk', 29, 'left', true);
    ctx.fillStyle = '#bfbfbf';
    fittedText(ctx, options.targetUrl.replace('https://', ''), { x: 300, y: 1908, width: 1000, height: 42 }, 'Poster Grotesk', 24);
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff'; ctx.font = '38px "carbontyperegular"';
    ctx.fillText('Giglist', 1560, 1947);
    if (options.photoCredit) {
        ctx.fillStyle = '#aaa';
        fittedText(ctx, options.photoCredit, {x: 80, y: 1958, width: 1080, height: 34}, 'Poster Grotesk', 14);
    }
    ctx.restore();
    return { rows: rowBounds, fontSize: layout.size, columns: layout.columns, listingArea: area };
};
