import React from "react";
import { TListing } from "../types/types";
import { EventSchema } from "./EventSchema";

export const Listing = ({ listing }: { listing: TListing }) => {
    const gig = listing;
    const cname =
        gig.answer === "Yes"
            ? "event-wrapper listing sponsored"
            : gig.answer === "patreon_artist"
            ? "event-wrapper listing patreon"
            : "event-wrapper listing";

    return (
        <>
            {gig.id <= 300 && <EventSchema gig={gig} />}
            <li className={cname}>
                <div className="event-title">
                    {gig.artist.replace(/&amp;/g, "&")}
                </div>
                <div className="event-venue">
                    <div className="name">
                        {gig.name.replace(/&amp;/g, "&")}, {gig.suburb}
                    </div>
                    <div className="address">{gig.address}</div>
                </div>
                <div className="event-time">{gig.start}</div>
            </li>
        </>
    );
};
