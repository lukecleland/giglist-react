import { getMapLocations } from "./mapLocations";

const gig = { id: 1, lat: "-31.95", lng: "115.86", date: "2026-10-01" };
test("groups co-located gigs and filters to the selected date", () => {
    const second = { ...gig, id: 2, lat: "-31.9500" };
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
