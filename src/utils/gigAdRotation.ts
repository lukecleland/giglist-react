import { TDate } from "../types/types";

// Show every ad in order before repeating, skipping dates without gigs.
export const buildGigAdRotation = (
    dates: TDate[],
    adCount: number,
    maxAds: number = Infinity,
): number[] => {
    let slot = 0;

    return dates.map((date) => {
        if (!adCount || !date.listings.length || slot >= maxAds) return -1;

        return slot++ % adCount;
    });
};
