import { paintPosterText, PosterTextEffect } from "../../utils/posterTextEffects";
export const listStyles = ['columns', 'festivalDays', 'festival', 'diamonds', 'circles', 'stars', 'stacked', 'twoColumn', 'threeColumn', 'dates', 'ruled', 'bands'] as const;
export type ListStyle = typeof listStyles[number];
export const listStyleNames: Record<ListStyle, string> = {
    columns: 'Vertical columns', festivalDays: 'Festival layout', festival: 'Festival lineup', diamonds: 'Festival · diamonds',
    circles: 'Festival · circles', stars: 'Festival · stars', stacked: 'Stacked bill',
    twoColumn: 'Two-column bill', threeColumn: 'Three-column bill', dates: 'Date sections',
    ruled: 'Ruled programme', bands: 'Alternating bands',
};
export const nextListStyle = (current: ListStyle, random = Math.random, seen: readonly ListStyle[] = []): ListStyle => {
    let choices = listStyles.filter(style => style !== current && !seen.includes(style));
    if (!choices.length) choices = listStyles.filter(style => style !== current);
    return choices[Math.floor(random() * choices.length)];
};
export type CloudEntry = { name: string; details: string; dateLabel?: string; dateKey?: string };
type Box = { x: number; y: number; width: number; height: number };
type CloudOptions = { area: Box; entries: CloudEntry[]; font: string; ink: string; accent: string; backdrop?: string; divider?: ListStyle; effect?: PosterTextEffect };
const fontString = (size: number, family: string) => `700 ${size}px "${family}", sans-serif`;
const wrap = (ctx: CanvasRenderingContext2D, text: string, width: number) => {
    const lines: string[] = [];
    let current = '';
    for (const word of text.split(/\s+/)) {
        if (current && ctx.measureText(current + ' ' + word).width > width) { lines.push(current); current = ''; }
        for (const char of (current ? ' ' : '') + word) {
            if (current && ctx.measureText(current + char).width > width) { lines.push(current); current = ''; }
            current += char;
        }
    }
    if (current) lines.push(current);
    return lines;
};

// Measured festival typesetting, rather than free-floating cloud placement.
// Names stay intact; only supporting date/venue details wrap.
export const drawFestivalWordCloud = (ctx: CanvasRenderingContext2D, options: CloudOptions) => {
    const {entries} = options;
    const panel = options.area;
    const padding = options.backdrop ? 48 : 0;
    const area = {x: panel.x + padding, y: panel.y + padding,
        width: panel.width - padding * 2, height: panel.height - padding * 2};
    const style = options.divider || 'festival';
    const dateGroups = new Set(entries.map(entry => entry.dateKey || entry.dateLabel)).size;
    const columnCount = style === 'twoColumn' ? 2 : style === 'threeColumn' ? 3 : style === 'dates' && dateGroups > 8 ? (dateGroups > 24 ? 3 : 2) : 1;
    const sideBySide = style === 'ruled' || style === 'bands';
    const columnGap = 42;
    const columnWidth = (area.width - columnGap * (columnCount - 1)) / columnCount;
    const isSingle = ['stacked', 'ruled', 'bands', 'twoColumn', 'threeColumn'].includes(style);
    const pack = (size: number) => {
        const gap = size * .65;
        const perColumn = Math.ceil(entries.length / columnCount);
        return Array.from({length: columnCount}, (_, col) => {
            const source = columnCount > 1 ? entries.slice(col * perColumn, (col + 1) * perColumn) : entries;
            const rows: {items: {name: string; details: string[]; width: number; height: number; fontSize: number; detailSize: number; inkHeight: number}[]; width: number; height: number; label?: string}[] = [];
            let dateKey = '';
            for (const entry of source) {
                const name = entry.name.replace(/\s+/g, ' ').trim();
                let fontSize = size * 1.45 / Math.pow(1 + Array.from(name).length / 18, .35);
                ctx.font = fontString(fontSize, options.font);
                const naturalWidth = ctx.measureText(name).width;
                const nameLimit = columnWidth * (sideBySide ? .62 : 1);
                if (naturalWidth > nameLimit) fontSize *= nameLimit / naturalWidth;
                ctx.font = fontString(fontSize, options.font);
                const nameMetrics = ctx.measureText(name);
                const inkHeight = Number.isFinite(nameMetrics.actualBoundingBoxAscent) && Number.isFinite(nameMetrics.actualBoundingBoxDescent)
                    ? Math.max(.01, nameMetrics.actualBoundingBoxAscent + nameMetrics.actualBoundingBoxDescent) : fontSize * .85;
                const nameWidth = Math.min(columnWidth, nameMetrics.width);
                const detailSize = Math.min(size * .38, fontSize * .48);
                ctx.font = `${detailSize}px "Poster Grotesk", sans-serif`;
                const details = wrap(ctx, entry.details, sideBySide ? columnWidth * .32 : isSingle ? columnWidth : Math.min(columnWidth, Math.max(nameWidth, size * 8)));
                const width = isSingle ? columnWidth : Math.min(columnWidth, Math.max(nameWidth, ...details.map(line => ctx.measureText(line).width)));
                const item = {name, details, width, height: inkHeight + details.length * detailSize * 1.25, fontSize, detailSize, inkHeight};
                const newDate = (style === 'dates' || style === 'festivalDays') && (entry.dateKey || entry.dateLabel || '') !== dateKey;
                if (newDate) dateKey = entry.dateKey || entry.dateLabel || '';
                let row = rows[rows.length - 1];
                if (!row || isSingle || newDate || row.width + gap + width > columnWidth) {
                    row = {items: [], width: 0, height: 0, label: newDate ? entry.dateLabel : undefined};
                    rows.push(row);
                }
                row.width += (row.items.length ? gap : 0) + width;
                row.items.push(item); row.height = Math.max(row.height, item.height);
            }
            rows.forEach(row => { const titleHeight = Math.max(...row.items.map(item => item.inkHeight)); const detailHeight = Math.max(...row.items.map(item => item.details.length * item.detailSize * 1.25)); row.height = sideBySide ? Math.max(titleHeight, detailHeight) : titleHeight + detailHeight; });
            const dayBreaks = rows.slice(1).filter(row => row.label).length;
            // Reserve day spacing independently of fitted type. Only exceptionally
            // dense calendars reduce it, using available space and day count.
            const dayGap = Math.min(48, area.height * .25 / Math.max(1, dayBreaks));
            const rowGap = Math.min(24, area.height * .15 / Math.max(1, rows.length - 1));
            const labels = rows.filter(row => row.label);
            const labelGap = Math.min(18, area.height * .1 / Math.max(1, labels.length));
            ctx.font = fontString(size * .58, 'Poster Grotesk');
            const labelHeight = (text: string) => {
                const metrics = ctx.measureText(text.toUpperCase());
                return Number.isFinite(metrics.actualBoundingBoxAscent) && Number.isFinite(metrics.actualBoundingBoxDescent)
                    ? Math.max(.01, metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) : size * .58 * .85;
            };
            const labelHeights = rows.map(row => row.label ? labelHeight(row.label) : 0);
            const gapsHeight = rows.slice(1).reduce((sum, row) => sum + (row.label ? dayGap : rowGap), 0);
            return {rows, gap, rowGap, dayGap, labelGap, labelHeights, height: rows.reduce((sum, row, index) => sum + row.height + (row.label ? labelHeights[index] + labelGap : 0), 0) + gapsHeight};
        });
    };
    let low = .01, high = 300;
    for (let i = 0; i < 32; i++) {
        const mid = (low + high) / 2;
        if (pack(mid).every(column => column.height <= area.height)) low = mid; else high = mid;
    }
    const columns = pack(low);
    const bounds: Box[] = [];
    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    if (options.backdrop) {
        const {x, y, width, height} = panel;
        const radius = 18;
        ctx.fillStyle = options.backdrop;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arc(x + width - radius, y + radius, radius, -Math.PI / 2, 0);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2);
        ctx.lineTo(x + radius, y + height);
        ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
        ctx.lineTo(x, y + radius);
        ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
        ctx.closePath(); ctx.fill();
    }
    const separator = (cx: number, cy: number, radius: number) => {
        ctx.fillStyle = options.accent; ctx.beginPath();
        if (!['diamonds', 'stars'].includes(style)) ctx.arc(cx, cy, radius * .7, 0, Math.PI * 2);
        else {
            const points = style === 'stars' ? 10 : 4;
            for (let p = 0; p < points; p++) {
                const angle = -Math.PI / 2 + p * Math.PI * 2 / points;
                const r = style === 'stars' && p % 2 ? radius * .45 : radius;
                if (!p) ctx.moveTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
                else ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
            }
            ctx.closePath();
        }
        ctx.fill();
    };
    columns.forEach((column, col) => {
        const left = area.x + col * (columnWidth + columnGap);
        let y = area.y;
        column.rows.forEach((row, rowIndex) => {
            if (row.label) {
                ctx.textAlign = 'center';
                ctx.fillStyle = options.accent; ctx.font = fontString(low * .58, 'Poster Grotesk');
                const ascent = ctx.measureText(row.label.toUpperCase()).actualBoundingBoxAscent;
                ctx.fillText(row.label.toUpperCase(), left + columnWidth / 2, y + (Number.isFinite(ascent) ? ascent : 0));
                y += column.labelHeights[rowIndex] + column.labelGap;
            }
            if (style === 'bands' && rowIndex % 2 === 0) {
                ctx.save(); ctx.globalAlpha = .12; ctx.fillStyle = options.ink;
                ctx.fillRect(left, y - column.rowGap * .25, columnWidth, row.height + column.rowGap * .5); ctx.restore();
            }
            let x = left + (columnWidth - row.width) / 2;
            const titleHeight = Math.max(...row.items.map(item => item.inkHeight));
            row.items.forEach((item, index) => {
                const alignLeft = sideBySide || columnCount > 1;
                ctx.textAlign = alignLeft ? 'left' : 'center';
                const textX = alignLeft ? x : x + item.width / 2;
                ctx.fillStyle = options.ink; ctx.font = fontString(item.fontSize, options.font);
                const metrics = ctx.measureText(item.name);
                // Align visible letter centres, including fonts with different top bearings.
                const centre = Number.isFinite(metrics.actualBoundingBoxAscent) && Number.isFinite(metrics.actualBoundingBoxDescent)
                    ? (metrics.actualBoundingBoxDescent - metrics.actualBoundingBoxAscent) / 2
                    : item.inkHeight / 2;
                const textY = y + titleHeight / 2 - centre;
                paintPosterText(ctx, item.name, textX, textY, options.effect);
                ctx.fillStyle = options.accent; ctx.font = `${item.detailSize}px "Poster Grotesk", sans-serif`;
                let metaY = sideBySide ? y + (row.height - item.details.length * item.detailSize * 1.25) / 2 : y + titleHeight;
                const metaX = sideBySide ? x + columnWidth * .68 : textX;
                item.details.forEach(text => { ctx.fillText(text, metaX, metaY); metaY += item.detailSize * 1.25; });
                bounds.push({x, y, width: item.width, height: Math.max(row.height, metaY - y)});
                if (index < row.items.length - 1) separator(x + item.width + column.gap / 2, y + titleHeight / 2, column.gap * .17);
                x += item.width + column.gap;
            });
            if (style === 'ruled') { ctx.fillStyle = options.accent; ctx.fillRect(left, y + row.height + column.rowGap * .5, columnWidth, Math.max(1, low * .015)); }
            y += row.height + (column.rows[rowIndex + 1]?.label ? column.dayGap : column.rowGap);
        });
    });
    ctx.restore();
    return {bounds, fontSize: low};
};
