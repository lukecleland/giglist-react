export type LocationPhoto = {
    id: number; url: string; title: string; artist: string;
    license: string; licenseUrl: string; source: string; credit: string;
};
const states: Record<string, string> = {
    WA: 'Western Australia', NSW: 'New South Wales', VIC: 'Victoria', QLD: 'Queensland',
    SA: 'South Australia', TAS: 'Tasmania', NT: 'Northern Territory', ACT: 'Australian Capital Territory',
};
const plainText = (html = '') => new DOMParser().parseFromString(html, 'text/html').body.textContent?.replace(/\s+/g, ' ').trim() || '';
const safeUrl = (value: string, host: string) => {
    try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === host ? url.href : ''; }
    catch { return ''; }
};

export const parseLocationPhotos = (data: any): LocationPhoto[] => Object.values(data.query?.pages || {})
    .sort((a: any, b: any) => (a.index || 0) - (b.index || 0))
    .flatMap((page: any) => {
        const info = page.imageinfo?.[0];
        const meta = info?.extmetadata || {};
        const title = plainText(page.title || '').replace(/^File:/, '');
        const license = plainText(meta.LicenseShortName?.value);
        // Only public domain/CC0 and attribution-only photos; exclude restrictive or unknown licenses.
        if (!info || !/^image\/(jpeg|png|webp)$/.test(info.mime) || info.width < 1000 || info.height < 700 ||
            !/^(Public domain|CC0|CC BY [\d.]+(?: [a-z]+)?)$/i.test(license) ||
            /\b(map|plan|diagram|logo|coat of arms|portrait|drawing|engraving|sketch|cyclopedia|cropped for|hatchback|sedan|wagon|motorcycle|registration plate)\b/i.test(title)) return [];
        const imageUrl = info.thumburl || info.url;
        const url = safeUrl(imageUrl, 'upload.wikimedia.org') || safeUrl(imageUrl, 'thumb.wikimedia.org');
        const artist = plainText(meta.Artist?.value);
        const licenseUrl = safeUrl((meta.LicenseUrl?.value || '').replace(/^http:/, 'https:'), 'creativecommons.org');
        if (!url || !artist || (/^CC BY /i.test(license) && !licenseUrl) || !Number.isSafeInteger(page.pageid)) return [];
        const source = `https://commons.wikimedia.org/?curid=${page.pageid}`;
        const credit = `Photo: ${artist} · ${license}${licenseUrl ? ' (' + licenseUrl.replace('https://', '') + ')' : ''} · commons.wikimedia.org/?curid=${page.pageid} · Cropped/colour adjusted`;
        return [{id: page.pageid, url, title, artist, license, licenseUrl, source, credit}];
    }).sort((a, b) => {
        const sceneScore = (title: string) =>
            (/panorama|skyline|aerial|harbour|harbor|waterfront|high street|town hall|beach|market|city centre|city center|town centre|town center/i.test(title) ? 3 : 0) +
            (/sunset|sunrise|night|square|park|landscape/i.test(title) ? 1 : 0) -
            (/\b(18\d\d|19[0-6]\d|historic|archive|slwa)\b/i.test(title) ? 3 : 0);
        return sceneScore(b.title) - sceneScore(a.title);
    });

const cache = new Map<string, LocationPhoto[]>();
export const fetchLocationPhotos = async (suburb: string, regions: string[], signal: AbortSignal): Promise<LocationPhoto[]> => {
    const clean = suburb.replace(/["\\]/g, ' ').trim();
    if (!clean) return [];
    const areaNames = Array.from(new Set(regions.map((region) => states[region.toUpperCase()] || region).filter(Boolean)));
    const key = JSON.stringify([clean.toLowerCase(), areaNames.sort()]);
    if (cache.has(key)) return cache.get(key)!;
    const results = await Promise.all((areaNames.length ? areaNames : ['Australia']).map(async (area) => {
        const params = new URLSearchParams({ action: 'query', format: 'json', origin: '*', generator: 'search',
            gsrsearch: `intitle:"${clean}" "${area.replace(/["\\]/g, ' ')}" filetype:bitmap`,
            gsrnamespace: '6', gsrlimit: '40', prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600' });
        const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {signal});
        if (!response.ok) throw new Error('Photo search unavailable');
        const data = await response.json();
        if (data.error) throw new Error('Photo search unavailable');
        return parseLocationPhotos(data);
    }));
    const photos = Array.from(new Map(results.flat().map((photo) => [photo.id, photo])).values()).slice(0, 30);
    if (photos.length) cache.set(key, photos);
    return photos;
};
