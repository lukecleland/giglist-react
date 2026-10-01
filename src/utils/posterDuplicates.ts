import {TListing} from '../types/types';

const normalized = (value = '') => value.normalize('NFKC').replace(/&amp;/gi, '&').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim().toLocaleLowerCase('en-AU');
const timeKey = (value = '') => {
    const compact = normalized(value).replace(/[.\s]/g, '');
    const match = /^(\d{1,2})(?::(\d{2}))?(am|pm)?$/.exec(compact);
    if (!match) return compact;
    let hour = Number(match[1]);
    if (match[3]) hour = hour % 12 + (match[3] === 'pm' ? 12 : 0);
    return `${hour}:${match[2] || '00'}`;
};

export const uniquePosterGigs = (gigs: TListing[], artistsOnly = false): TListing[] => {
    const seen = new Set<string>();
    return gigs.filter(gig => {
        const artist = normalized(gig.artist);
        const parts = [(gig.date || '').slice(0,10), artist];
        // Detailed bills preserve different venues and performance times. Artist-only
        // festival bills show a name once per date, regardless of number of sets.
        if (!artistsOnly || !artist) parts.push(normalized(gig.name), normalized(gig.suburb), normalized(gig.state), normalized(gig.address), timeKey(gig.start));
        const key = JSON.stringify(parts);
        if (seen.has(key)) return false;
        seen.add(key); return true;
    });
};
