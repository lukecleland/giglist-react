import moment from 'moment';
import { Event } from 'schema-dts';
import { TListing } from '../types/types';
import { buildGigUrl } from './gigUrl';

export const eventImage = (gig: TListing): string | undefined => {
    const value = (gig.event_image_url || gig.artist_image_url || gig.location_image_url || '').trim();
    if (!value) return undefined;
    try {
        const url = new URL(value, 'https://giglist.com.au');
        return /^https?:$/.test(url.protocol) ? url.href : undefined;
    } catch { return undefined; }
};

export const eventStart = (gig: TListing): string | undefined => {
    const date = moment.utc(gig.date, 'YYYY-MM-DD', true);
    if (!date.isValid()) return undefined;
    const time = moment.utc((gig.start || '').trim().toUpperCase(), ['h:mmA', 'h:mm A', 'hA', 'h A', 'HH:mm', 'HH:mm:ss'], true);
    // Google infers the timezone from the physical venue when no offset is supplied.
    // Never use the visitor's timezone or the feed's incorrectly fixed Perth zone.
    return date.format('YYYY-MM-DD') + (time.isValid() ? `T${time.format('HH:mm:ss')}` : '');
};

export const buildEventSchema = (gig: TListing): Event | null => {
    const startDate = eventStart(gig);
    if (!startDate || !gig.artist || !gig.name || !gig.address || !gig.suburb) return null;
    const clean = (text: string) => text.replace(/&amp;/gi, '&').trim();
    const image = eventImage(gig);
    return {
        '@type': 'Event', url: buildGigUrl(gig), name: clean(gig.artist), startDate,
        description: `${clean(gig.artist)} at ${clean(gig.name)}`,
        ...(image ? { image } : {}),
        location: {
            '@type': 'Place', name: clean(gig.name),
            address: {
                '@type': 'PostalAddress', streetAddress: clean(gig.address),
                addressLocality: gig.suburb, addressRegion: gig.state,
                postalCode: gig.zip, addressCountry: 'AU',
            },
        },
        performer: { '@type': 'PerformingGroup', name: clean(gig.artist) },
    };
};
