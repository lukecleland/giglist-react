import React, { useState } from "react";
import { TListing } from "../types/types";

export const Listing = ({ listing }: { listing: TListing }) => {
    const [fullListing, setFullListing] = useState<boolean>(false);
    const gig = listing;
    const bg = `url(${gig.location_image_url})`;
    const gigBackground = bg === "url()" ? `url('placeholder-gig.jpeg')` : bg;

    let returnComponent = <div></div>;
    if (!fullListing) {
        returnComponent = (
            <div style={{ position: "relative" }}>
                <li
                    className="event-wrapper listing"
                    onMouseOver={() => setFullListing(true)}
                >
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
            </div>
        );
    }

    if (fullListing) {
        returnComponent = (
            <div style={{ position: "relative" }}>
                <li
                    className="event-wrapper listing"
                    style={{
                        backgroundImage: gigBackground,
                        position: "absolute",
                        height: "140px",
                        zIndex: 99,
                    }}
                    onMouseOver={() => setFullListing(true)}
                    onMouseOut={() => setFullListing(false)}
                >
                    <div
                        className="event-title"
                        style={{
                            backgroundColor: "black",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        {gig.artist.replace(/&amp;/g, "&")}
                    </div>
                    <div
                        className="event-venue"
                        style={{
                            backgroundColor: "black",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        <div className="name">
                            {gig.name.replace(/&amp;/g, "&")}, {gig.suburb}
                        </div>
                        <div className="address">{gig.address}</div>
                    </div>
                    <div className="event-time">{gig.start}</div>
                </li>
            </div>
        );
    }

    return returnComponent;
};
