import { TListing } from "../types/types";

const GIGLIST_BASE_URL = "https://giglist.com.au";

export const slugifySegment = (value: string): string => {
    const normalized = (value || "")
        .replace(/&amp;/gi, "and")
        .replace(/&/g, " and ")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const slug = normalized
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");

    return slug || "gig";
};

export const buildGigPath = (
    gig: Pick<TListing, "artist" | "name" | "date">,
): string => {
    const artist = slugifySegment(gig.artist);
    const venue = slugifySegment(gig.name);
    const date = slugifySegment(gig.date);

    return `/gig-${artist}-${venue}-${date}`;
};

export const buildLegacyGigPath = (
    gig: Pick<TListing, "artist" | "name" | "date">,
): string => {
    return `/gig-${gig.artist}-${gig.name}-${gig.date}`
        .replace(/\s+/g, "-")
        .toLowerCase();
};

export const buildGigUrl = (
    gig: Pick<TListing, "artist" | "name" | "date">,
): string => {
    return `${GIGLIST_BASE_URL}${buildGigPath(gig)}`;
};
