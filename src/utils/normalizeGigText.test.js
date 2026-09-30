import { normalizeGigText, repairGigText } from "./normalizeGigText";

test.each([
    ["MacÃƒÂ«y", "Macëy"],
    ["WhatÃ¢Â€Â™s New Pussycat?", "What’s New Pussycat?"],
    ["A Ã¢Â€Â“ B", "A – B"],
    ["Jazz TupÃƒÂ\u00ad Trio", "Jazz Tupí Trio"],
    ["BeyoncÃ© / Café / 東京 / 🎸", "Beyoncé / Café / 東京 / 🎸"],
    ["FranÃ§ois", "François"],
    ["ðŸŽ¸", "🎸"],
    ["Macëy, Motörhead, O’Connor & AC/DC", "Macëy, Motörhead, O’Connor & AC/DC"],
    ["Ã / Â / â / � / 100%", "Ã / Â / â / � / 100%"],
    ["\u00ed\u00a0\u0080", "\u00ed\u00a0\u0080"],
    ["", ""],
])("repairs legacy encoding without damaging Unicode: %s", (input, expected) => {
    expect(repairGigText(input)).toBe(expected);
    expect(repairGigText(expected)).toBe(expected);
});

test("normalizes display fields without mutating feed data or URLs", () => {
    const gig = { artist: "MacÃƒÂ«y", name: "CafÃ©", suburb: "Ã‰vora",
        address: "FranÃ§ois St", artist_url: "https://example.com/Ã©", id: 42 };
    const feed = [{ datestring: "Today", listings: [gig] }];
    const normalized = normalizeGigText(feed);
    expect(normalized[0].listings[0]).toEqual({ ...gig, artist: "Macëy",
        name: "Café", suburb: "Évora", address: "François St" });
    expect(feed[0].listings[0]).toBe(gig);
    expect(gig.artist).toBe("MacÃƒÂ«y");
});
