import { getTourProfile } from "./tourProfile";

test("recognizes a venue even when the URL omits The", () => {
    const gig = { artist: "Live Band", name: "The Windsor Hotel", address: "112 Mill Point Road", suburb: "South Perth" };
    expect(getTourProfile([{ listings: [gig, gig] }], "windsorhotel")).toEqual({
        title: "The Windsor Hotel", isVenue: true, isSuburb: false, addresses: ["112 Mill Point Road, South Perth"],
    });
});

test("an exact venue match takes priority over an artist substring", () => {
    const gigs = [{ artist: "Windsor Hotel Tribute", name: "Windsor Hotel", address: "Main Street", suburb: "Perth" }];
    expect(getTourProfile([{ listings: gigs }], "windsorhotel").isVenue).toBe(true);
});


test("exact suburbs take priority over partial venue names and have no address", () => {
    const gigs = [{ artist: "Live Band", name: "South Perth Hotel", address: "Main Street", suburb: "South Perth" }];
    expect(getTourProfile([{ listings: gigs }], "southperth")).toEqual({
        title: "South Perth", isVenue: false, isSuburb: true, addresses: [],
    });
});
