import { TGiglist, TListing } from "../types/types";

export type MapLocation = {
    key: string;
    position: { lat: number; lng: number };
    listings: TListing[];
};

export const getMapLocations = (dates: TGiglist, selectedDate: string): MapLocation[] => {
    const locations = new Map<string, MapLocation>();
    dates.forEach((date) => date.listings.forEach((listing) => {
        if (listing.date !== selectedDate || !listing.lat?.trim() || !listing.lng?.trim()) return;
        const lat = Number(listing.lat);
        const lng = Number(listing.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return;
        const key = `${lat},${lng}`;
        const location = locations.get(key) || { key, position: { lat, lng }, listings: [] };
        location.listings.push(listing);
        locations.set(key, location);
    }));
    return Array.from(locations.values());
};
