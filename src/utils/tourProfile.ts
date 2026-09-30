import { TGiglist } from "../types/types";
import { compactName, suburbForSearchSlug } from "./searchUrl";

export const getTourProfile = (dates: TGiglist, slug: string) => {
    const suburb = suburbForSearchSlug(dates, slug);
    if (suburb) return { title: suburb.replace(/&amp;/gi, "&"), isVenue: false, isSuburb: true, addresses: [] as string[] };
    const gigs = dates.flatMap((date) => date.listings);
    const exactVenues = gigs.filter((gig) => compactName(gig.name) === slug);
    const artist = gigs.find((gig) => compactName(gig.artist) === slug) ||
        (!exactVenues.length ? gigs.find((gig) => compactName(gig.artist).includes(slug)) : undefined);
    const venues = exactVenues.length ? exactVenues : gigs.filter((gig) => compactName(gig.name).includes(slug));
    const isVenue = !artist && venues.length > 0;
    const addresses = isVenue ? Array.from(new Set(venues.map((gig) =>
        [gig.address, [gig.suburb, gig.state, gig.zip].filter(Boolean).join(" ")]
            .filter(Boolean).join(", ").replace(/&amp;/gi, "&"),
    ).filter(Boolean))) : [];
    const title = (artist?.artist || venues[0]?.name || slug).replace(/&amp;/gi, "&");
    return { title, isVenue, isSuburb: false, addresses };
};
