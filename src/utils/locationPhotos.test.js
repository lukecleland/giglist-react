import {parseLocationPhotos, fetchLocationPhotos} from './locationPhotos';
const page = (id = 1, overrides = {}) => ({pageid: id, title: 'File:Suburb High Street.jpg', index: id, imageinfo: [{
    mime: 'image/jpeg', width: 2400, height: 1800, thumburl: 'https://upload.wikimedia.org/example.jpg',
    extmetadata: {Artist: {value: '<a href="https://example.com">Jane &amp; Jo</a>'}, LicenseShortName: {value: 'CC BY 4.0'}, LicenseUrl: {value: 'https://creativecommons.org/licenses/by/4.0/'}}, ...overrides,
}]});
const data = (...pages) => ({query: {pages: Object.fromEntries(pages.map(p => [p.pageid, p]))}});

test('accepts exportable credited photos and converts metadata to plain text', () => {
    const [photo] = parseLocationPhotos(data(page()));
    expect(photo.artist).toBe('Jane & Jo');
    expect(photo.credit).toContain('creativecommons.org/licenses/by/4.0/');
    expect(photo.credit).toContain('commons.wikimedia.org/?curid=1');
    expect(photo.credit).toContain('Cropped/colour adjusted');
});
test('rejects unknown licenses, share-alike, undersized, non-raster and untrusted URLs', () => {
    expect(parseLocationPhotos(data(
        page(1, {extmetadata: {}}), page(2, {width: 500}), page(3, {mime: 'image/svg+xml'}),
        page(4, {thumburl: 'https://evil.example/photo.jpg'}),
        page(5, {extmetadata: {...page().imageinfo[0].extmetadata, LicenseShortName: {value: 'CC BY-SA 4.0'}}}),
    ))).toEqual([]);
});
test('any suburb uses its state, caches results, and passes cancellation to fetch', async () => {
    const original = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({ok: true, json: async () => data(page())});
    try {
        const signal = new AbortController().signal;
        await fetchLocationPhotos('Brunswick', ['VIC'], signal);
        const [url, options] = global.fetch.mock.calls[0];
        expect(new URL(url).searchParams.get('gsrsearch')).toContain('intitle:"Brunswick" "Victoria"');
        expect(options.signal).toBe(signal);
        await fetchLocationPhotos('Brunswick', ['VIC'], signal);
        expect(global.fetch).toHaveBeenCalledTimes(1);
        await fetchLocationPhotos('Newtown', ['NSW'], signal);
        expect(global.fetch).toHaveBeenCalledTimes(2);
    } finally { global.fetch = original; }
});
test('failed searches can be retried', async () => {
    const original = global.fetch;
    global.fetch = jest.fn().mockResolvedValueOnce({ok: false}).mockResolvedValueOnce({ok: true, json: async () => data(page())});
    try {
        const signal = new AbortController().signal;
        await expect(fetchLocationPhotos('Richmond', ['VIC'], signal)).rejects.toThrow();
        await expect(fetchLocationPhotos('Richmond', ['VIC'], signal)).resolves.toHaveLength(1);
    } finally { global.fetch = original; }
});

test('supports Commons thumbnail host', () => {
    expect(parseLocationPhotos(data(page(99, {thumburl: 'https://thumb.wikimedia.org/example.jpg'})))).toHaveLength(1);
});
