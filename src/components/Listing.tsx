import React from "react";
import { TListing } from "../types/types";
import { EventSchema } from "./EventSchema";

export const Listing = ({ listing }: { listing: TListing }) => {
    //const [fullListing, setFullListing] = useState<boolean>(false);
    const gig = listing;
    //const bg = `url(${gig.location_image_url})`;
    //const gigBackground = bg === "url()" ? `url('placeholder-gig.jpeg')` : bg;

    const event_url =
        `https://giglist.com.au/gig-${gig.artist}-${gig.name}-${gig.date}`
            .replace(/\s+/g, "-")
            .toLowerCase();

    let returnComponent = <div></div>;
    //if (!fullListing) {
    returnComponent = (
        <a
            href={event_url}
            style={{ position: "relative" }}
            onClick={(e) => e.preventDefault()}
        >
            {gig.id <= 3 && <EventSchema gig={gig} />}
            <li
                className="event-wrapper listing"
                //onMouseOver={() => setFullListing(false)}
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
        </a>
    );
    //}

    // if (fullListing) {
    //     returnComponent = (
    //         <div style={{ position: "relative" }}>
    //             <li
    //                 className="event-wrapper listing"
    //                 style={{
    //                     backgroundImage: gigBackground,
    //                     position: "absolute",
    //                     height: "140px",
    //                     zIndex: 99,
    //                 }}
    //                 onMouseOver={() => setFullListing(true)}
    //                 onMouseOut={() => setFullListing(false)}
    //             >
    //                 <div
    //                     className="event-title"
    //                     style={{
    //                         backgroundColor: "black",
    //                         color: "white",
    //                         fontWeight: "bold",
    //                     }}
    //                 >
    //                     {gig.artist.replace(/&amp;/g, "&")}
    //                 </div>
    //                 <div
    //                     className="event-venue"
    //                     style={{
    //                         backgroundColor: "black",
    //                         color: "white",
    //                         fontWeight: "bold",
    //                     }}
    //                 >
    //                     <div className="name">
    //                         {gig.name.replace(/&amp;/g, "&")}, {gig.suburb}
    //                     </div>
    //                     <div className="address">{gig.address}</div>
    //                 </div>
    //                 <div className="event-time">{gig.start}</div>
    //             </li>
    //         </div>
    //     );
    // }

    return returnComponent;
};
