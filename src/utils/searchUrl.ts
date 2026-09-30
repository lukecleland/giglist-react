import { TGiglist } from "../types/types";

export const compactName = (value: string): string => value
    .replace(/&amp;/gi, "&")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const reserved = new Set([
    "search", "location", "gigmap", "qr", "submit", "about", "supporters", "gigtools",
    "locations", "locationimagecollage", "geolocation", "store", "editor",
    "redirect", "today", "notfound",
]);

export const searchSlugFromPath = (pathname: string): string => {
    const match = /^\/([^/]+)\/?$/.exec(pathname);
    if (!match) return "";
    let slug: string;
    try { slug = decodeURIComponent(match[1]).toLowerCase(); }
    catch { return ""; }
    if (reserved.has(slug) || slug.startsWith("gig-")) return "";
    return compactName(slug);
};

export const nameForSearchSlug = (dates: TGiglist, slug: string): string => {
    for (const date of dates) {
        for (const gig of date.listings) {
            for (const name of [gig.artist, gig.name]) {
                if (compactName(name) === slug) return name.replace(/&amp;/gi, "&");
            }
        }
    }
    return slug;
};

export const filterGigSearch = (dates: TGiglist, query: string, fromUrl = false): TGiglist => {
    const needle = fromUrl ? compactName(query) : query.toLowerCase();
    if (!needle || (!fromUrl && needle.length < 2)) return dates;
    return dates.map((date) => ({
        ...date,
        listings: date.listings.filter((gig) =>
            (fromUrl ? [gig.artist, gig.name] : [gig.artist, gig.name, gig.suburb])
                .some((name) => (fromUrl ? compactName(name) : name.toLowerCase()).includes(needle)),
        ),
    }));
};
