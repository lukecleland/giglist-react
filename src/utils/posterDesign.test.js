import { posterThemes, realVenueImage, drawPoster, posterGigs, randomPosterTheme } from './posterDesign';

test.each([undefined, '', '/newLogoGiglist.png', 'https://giglist.com.au/favicon.png', '/placeholder.jpg', 'javascript:alert(1)'])("excludes fallback or invalid venue image %s", (value) => {
    expect(realVenueImage(value)).toBeNull();
});
test('accepts real venue photos and resolves relative URLs', () => {
    expect(realVenueImage('/venues/windsor.jpg')).toBe('https://giglist.com.au/venues/windsor.jpg');
});
test.each(posterThemes.map((theme) => theme.id))('renders %s with a venue photo and readable QR quiet zone', (theme) => {
    const ctx = Object.fromEntries(['fillRect', 'strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'fillText', 'drawImage', 'save', 'restore', 'translate', 'rotate', 'ellipse', 'closePath'].map((name) => [name, jest.fn()]));
    ctx.createLinearGradient = () => ({ addColorStop: jest.fn() });
    ctx.measureText = (value) => ({ width: value.length * 30 });
    const photo = { naturalWidth: 1200, naturalHeight: 800 };
    const qr = {};
    drawPoster(ctx, {theme, title: 'Windsor Hotel', targetUrl: 'https://giglist.com.au/windsorhotel', photo, artwork: {naturalWidth: 1000, naturalHeight: 1000}, qr});
    expect(ctx.drawImage.mock.calls[0][0]).toBe(photo);
    expect(ctx.drawImage).toHaveBeenLastCalledWith(qr, 1360, 1745, 140, 140);
    expect(ctx.fillRect).toHaveBeenCalledWith(1340, 1725, 180, 180);
    expect(ctx.fillText.mock.calls.map(([text]) => text).join(' ').toLowerCase()).toContain('windsor');
});


test('month selection includes every matching gig and sorts dates', () => {
    const gigs = Array.from({length: 75}, (_, id) => ({id, artist: 'Band', name: 'Venue', suburb: 'Perth', date: `2027-03-${String(28 - id % 28).padStart(2, '0')}`}));
    gigs.push({...gigs[0], id: 100, date: '2027-04-01'});
    const result = posterGigs([{listings: gigs}], 'perth', 2);
    expect(result).toHaveLength(75);
    expect(result[0].date).toBe('2027-03-01');
    expect(posterGigs([{listings: gigs}], 'perth')).toHaveLength(76);
    expect(posterGigs([{listings: gigs}], 'perth', 0)).toHaveLength(0);
});

test('dense suburb posters render every gig inside the listing area', () => {
    const ctx = Object.fromEntries(['fillRect', 'strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'fillText', 'drawImage', 'save', 'restore', 'translate', 'rotate', 'ellipse', 'closePath'].map((name) => [name, jest.fn()]));
    ctx.createLinearGradient = () => ({ addColorStop: jest.fn() });
    ctx.measureText = (text) => ({width: text.length * Number(/([\d.]+)px/.exec(ctx.font)?.[1] || 30) * 0.5});
    const gigs = Array.from({length: 200}, (_, id) => ({artist: `Band ${id}`, name: 'Venue', suburb: 'Perth', start: '8pm', date: '2027-03-01'}));
    drawPoster(ctx, {theme: 'nocturne', title: 'Perth', targetUrl: 'https://giglist.com.au/perth', qr: {}, photo: null, gigs, month: 2, isSuburb: true});
    const names = ctx.fillText.mock.calls.filter(([text]) => /^Band \d+$/.test(text));
    expect(names).toHaveLength(200);
    expect(names.every(([,x,y]) => x >= 65 && x < 1535 && y >= 285 && y < 1710)).toBe(true);
    expect(ctx.fillText.mock.calls.some(([text]) => text === 'LIVE MUSIC IN MARCH')).toBe(true);
});


test('random selection never repeats the current theme and reaches every alternative', () => {
    for (const current of posterThemes) {
        const selected = new Set(Array.from({length: posterThemes.length - 1}, (_, i) => randomPosterTheme(current.id, () => (i + 0.5) / (posterThemes.length - 1))));
        expect(selected.has(current.id)).toBe(false);
        expect(selected.size).toBe(posterThemes.length - 1);
    }
});

test.each(posterThemes.map((theme) => theme.id))('%s fits all 200 long listings without overlapping the QR footer', (theme) => {
    const ctx = Object.fromEntries(['fillRect', 'strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'fillText', 'drawImage', 'save', 'restore', 'translate', 'rotate', 'ellipse', 'closePath'].map((name) => [name, jest.fn()]));
    ctx.createLinearGradient = () => ({ addColorStop: jest.fn() });
    ctx.measureText = (text) => ({ width: text.length * Number(/([\d.]+)px/.exec(ctx.font)?.[1] || 30) * 0.5 });
    const gigs = Array.from({length: 200}, (_, id) => ({ artist: `Artist ${id} and the extremely long supporting band name`, name: 'A venue with a long name', suburb: 'South Perth', start: '8pm', date: '2027-03-01' }));
    const result = drawPoster(ctx, {theme, title: 'A very long suburb and venue title with multiple words', targetUrl: 'https://giglist.com.au/southperth', qr: {}, photo: {naturalWidth: 1200, naturalHeight: 800}, gigs, month: 2, isSuburb: true});
    expect(result.rows).toHaveLength(200);
    expect(result.rows.every((box) => box.y >= result.listingArea.y && box.y + box.height <= result.listingArea.y + result.listingArea.height + 0.01 && box.x >= result.listingArea.x && box.x + box.width <= result.listingArea.x + result.listingArea.width + 0.01)).toBe(true);
});


test.each(posterThemes.map((theme) => theme.id))('%s keeps artwork full-page behind dense listings', (theme) => {
    const ctx = Object.fromEntries(['fillRect', 'strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'fillText', 'drawImage', 'save', 'restore', 'translate', 'rotate', 'ellipse', 'closePath'].map((name) => [name, jest.fn()]));
    ctx.createLinearGradient = () => ({ addColorStop: jest.fn() });
    ctx.measureText = (text) => ({width: text.length * 15});
    const artwork = {naturalWidth: 1600, naturalHeight: 2000};
    const gigs = Array.from({length: 92}, () => ({artist: 'Band', name: 'Venue', date: '2026-10-01', start: '8pm'}));
    drawPoster(ctx, {theme, title: 'Fremantle', targetUrl: 'https://giglist.com.au/fremantle', qr: {}, photo: null, artwork, gigs, month: 9, isSuburb: true});
    const imageCall = ctx.drawImage.mock.calls.find(([image]) => image === artwork);
    expect(imageCall.slice(-4)).toEqual([0, 0, 1600, 1930]);
});
