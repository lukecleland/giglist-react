import { compactName, filterGigSearch, nameForSearchSlug, searchSlugFromPath } from "./searchUrl";

const dates = [{ datestring: "Today", datetime: "2026-09-30", listings: [
    { artist: "Clayton Bulger", name: "Windsor Hotel", suburb: "Perth" },
    { artist: "Clayton Bulger, Support Act", name: "Other Venue", suburb: "Windsor Hotel" },
    { artist: "Other Artist", name: "Windsor Hotel", suburb: "Sydney" },
] }];

test("artist URL fills the original name and includes multi-artist gigs", () => {
    const slug = searchSlugFromPath("/claytonbulger");
    expect(nameForSearchSlug(dates, slug)).toBe("Clayton Bulger");
    expect(filterGigSearch(dates, slug, true)[0].listings).toEqual(dates[0].listings.slice(0, 2));
});

test("venue URLs match venues without also matching suburbs", () => {
    const slug = searchSlugFromPath("/WindsorHotel/");
    expect(nameForSearchSlug(dates, slug)).toBe("Windsor Hotel");
    expect(filterGigSearch(dates, slug, true)[0].listings).toEqual([dates[0].listings[0], dates[0].listings[2]]);
});

test.each(["/", "/search", "/about", "/GIGMAP/", "/location", "/gig-artist-venue-date", "/a/b", "/%ZZ"])("preserves existing paths: %s", (path) => {
    expect(searchSlugFromPath(path)).toBe("");
});

test("handles accents, punctuation, URL escapes and optional separators", () => {
    expect(compactName("Macëy &amp; O’Connor")).toBe("maceyoconnor");
    expect(searchSlugFromPath("/Mac%C3%ABy")).toBe("macey");
    expect(searchSlugFromPath("/clayton-bulger")).toBe("claytonbulger");
    expect(searchSlugFromPath("/clayton_bulger")).toBe("claytonbulger");
});

test("absent names return no results and empty feeds can resolve after loading", () => {
    expect(nameForSearchSlug([], "claytonbulger")).toBe("claytonbulger");
    expect(filterGigSearch(dates, "unknownartist", true)[0].listings).toEqual([]);
    expect(nameForSearchSlug(dates, "claytonbulger")).toBe("Clayton Bulger");
});

test("regular search still matches suburbs, clearing restores all gigs, and feed stays intact", () => {
    expect(filterGigSearch(dates, "Perth")[0].listings).toHaveLength(1);
    expect(filterGigSearch(dates, "")).toBe(dates);
    expect(filterGigSearch(dates, "C")).toBe(dates);
    expect(dates[0].listings).toHaveLength(3);
});


test("suburb URLs use the original name and only include that suburb", () => {
    const suburbs = [{ listings: [
        { artist: "Band", name: "Local Hotel", suburb: "South Perth" },
        { artist: "Band", name: "Elsewhere", suburb: "Perth" },
        { artist: "South Perth Tribute", name: "Elsewhere", suburb: "Sydney" },
    ] }];
    expect(nameForSearchSlug(suburbs, "southperth")).toBe("South Perth");
    expect(filterGigSearch(suburbs, "southperth", true)[0].listings).toEqual([suburbs[0].listings[0]]);
});
