import { TDate } from "../types/types";

// Show every ad in order before repeating, skipping dates without gigs.
export const buildGigAdRotation = (
    dates: TDate[],
    adCount: number,
): number[] => {
    let slot = 0;

    return dates.map((date) => {
        if (!adCount || !date.listings.length) return -1;

        return slot++ % adCount;
    });
};
