import { getMapLocations } from "./mapLocations";

const gig = { id: 1, lat: "-31.95", lng: "115.86", date: "2026-10-01", artist: "First Act", name: "Venue", address: "1 Main Street", start: "7:30PM" };
test("groups co-located gigs and filters to the selected date", () => {
    const second = { ...gig, id: 2, artist: "Second Act", lat: "-31.9500" };
    const feed = [{ listings: [gig, second, { ...gig, date: "2026-10-02" }, { ...gig, id: 3, lng: "115.90" }] }];
    const locations = getMapLocations(feed, gig.date);
    expect(locations).toHaveLength(2);
    expect(locations[0].listings).toEqual([gig, second]);
    expect(locations[1].position).toEqual({ lat: -31.95, lng: 115.9 });
    expect(feed[0].listings).toHaveLength(4);
});
test.each(["", " ", "bad", "-31x", "91", "Infinity"])("ignores invalid latitude %s", (lat) => {
    expect(getMapLocations([{ listings: [{ ...gig, lat }] }], gig.date)).toEqual([]);
});
test("ignores out-of-range longitude and handles empty results", () => {
    expect(getMapLocations([{ listings: [{ ...gig, lng: "181" }] }], gig.date)).toEqual([]);
    expect(getMapLocations([], gig.date)).toEqual([]);
    expect(getMapLocations([{ listings: [gig] }], "2026-10-03")).toEqual([]);
});

test("deduplicates events across feed groups and keeps the available venue photo", () => {
    const first = { ...gig, artist: 'Guy Sebastian', location_image_url: '' };
    const duplicate = { ...first, id: 99, artist: ' GUY  SEBASTIAN ', start: '19:30:00', location_image_url: 'https://example.com/venue.jpg' };
    const locations = getMapLocations([{ listings: [first] }, { listings: [duplicate] }], gig.date);
    expect(locations[0].listings).toHaveLength(1);
    expect(locations[0].listings[0].location_image_url).toBe(duplicate.location_image_url);
    expect(first.location_image_url).toBe('');
});

test("keeps separate show times and venues at the same coordinates", () => {
    const later = { ...gig, id: 2, start: '9:30PM' };
    const otherVenue = { ...gig, id: 3, name: 'Other Venue' };
    expect(getMapLocations([{ listings: [gig, later, otherVenue] }], gig.date)[0].listings).toHaveLength(3);
});

test("normalizes encoded ampersands and time spacing", () => {
    const first = { ...gig, artist: 'A &amp; B' };
    const duplicate = { ...gig, id: 2, artist: 'A & B', start: '7:30 PM' };
    expect(getMapLocations([{ listings: [first, duplicate] }], gig.date)[0].listings).toHaveLength(1);
});
