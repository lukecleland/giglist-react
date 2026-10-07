import { TGiglist, TListing } from "../types/types";
import moment from "moment";

const normalizedText = (value: string) => (value || "").replace(/&amp;/gi, "&").trim().replace(/\s+/g, " ").toLowerCase();
const eventKey = (listing: TListing) => {
    const time = moment((listing.start || "").replace(/\s/g, "").toUpperCase(), ["h:mmA", "hA", "HH:mm", "HH:mm:ss"], true);
    return JSON.stringify([
        listing.date, normalizedText(listing.artist), normalizedText(listing.name),
        normalizedText(listing.address), time.isValid() ? time.format("HH:mm") : normalizedText(listing.start),
    ]);
};

export type MapLocation = {
    key: string;
    position: { lat: number; lng: number };
    listings: TListing[];
};

export const getMapLocations = (dates: TGiglist, selectedDate: string): MapLocation[] => {
    const locations = new Map<string, MapLocation>();
    const seen = new Map<string, TListing>();
    dates.forEach((date) => date.listings.forEach((listing) => {
        if (listing.date !== selectedDate || !listing.lat?.trim() || !listing.lng?.trim()) return;
        const lat = Number(listing.lat);
        const lng = Number(listing.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return;
        const key = `${lat},${lng}`;
        const identity = `${key}:${eventKey(listing)}`;
        const existing = seen.get(identity);
        if (existing) {
            // Duplicate feed rows can have different IDs or incomplete metadata.
            for (const field of ["location_image_url", "artist_url", "location_url"] as const) {
                if (!existing[field]?.trim() && listing[field]?.trim()) existing[field] = listing[field];
            }
            return;
        }
        const location = locations.get(key) || { key, position: { lat, lng }, listings: [] };
        const copy = { ...listing };
        seen.set(identity, copy);
        location.listings.push(copy);
        locations.set(key, location);
    }));
    return Array.from(locations.values());
};
