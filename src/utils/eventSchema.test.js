import { buildEventSchema, eventStart, eventImage } from './eventSchema';
const gig = { artist: 'Band &amp; Friends', name: 'Venue', date: '2026-10-24', start: '7:30PM', state: 'NSW', address: '1 Main St', suburb: 'Sydney', zip: '2000', location_image_url: '/venue.jpg' };
test('uses venue wall time, not the browser or feed timezone', () => {
    expect(eventStart({ ...gig, datestamp: { date: '2026-10-24 19:30:00', timezone: 'Australia/Perth' } })).toBe('2026-10-24T19:30:00');
    expect(eventStart({ ...gig, start: '00:00' })).toBe('2026-10-24T00:00:00');
    expect(eventStart({ ...gig, start: 'TBA' })).toBe('2026-10-24');
    expect(buildEventSchema({ ...gig, date: '2026-02-30' })).toBeNull();
});
test('does not invent ticket prices, duration, status or organiser', () => {
    const schema = buildEventSchema(gig);
    expect(schema.name).toBe('Band & Friends');
    for (const field of ['offers', 'endDate', 'organizer', 'eventStatus']) expect(schema).not.toHaveProperty(field);
    expect(schema.location.address.addressCountry).toBe('AU');
});
test('prefers event artwork then artist artwork, with venue fallback', () => {
    expect(eventImage({ ...gig, event_image_url: '/poster.jpg', artist_image_url: '/artist.jpg' })).toBe('https://giglist.com.au/poster.jpg');
    expect(eventImage({ ...gig, artist_image_url: '/artist.jpg' })).toBe('https://giglist.com.au/artist.jpg');
    expect(eventImage(gig)).toBe('https://giglist.com.au/venue.jpg');
    expect(eventImage({ ...gig, location_image_url: '' })).toBeUndefined();
    expect(eventImage({ ...gig, location_image_url: 'javascript:alert(1)' })).toBeUndefined();
});
