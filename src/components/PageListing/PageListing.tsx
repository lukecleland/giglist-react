import React, { ReactElement } from "react";
import QRCode from "react-qr-code";
import { TListing } from "../../types/types";
import { Icon } from "semantic-ui-react";
import { EventSchema } from "../EventSchema";
import { Helmet } from "react-helmet-async";

import moment from "moment";
import "./PageListing.scss";
import { ShareGig } from "../ShareGig";
import { AddToCalendar } from "../AddToCalendar";
import { buildGigUrl } from "../../utils/gigUrl";

// // Then fetch the link
// google(event); // https://calendar.google.com/calendar/render...
// outlook(event); // https://outlook.live.com/owa/...
// office365(event); // https://outlook.office.com/owa/...
// yahoo(event); // https://calendar.yahoo.com/?v=60&title=...
// ics(event); // standard ICS file based on https://icalendar.org
// // const apiKey = "AIzaSyDTkZauLKxFmJ3qW2jKsgjLvgt30kqJ3AM";
// // const googlemapsurl = "https://maps.googleapis.com/maps/api/staticmap";

export const PageListing = ({
    listing,
}: {
    listing: TListing;
}): ReactElement => {
    const gig = listing;

    const event_url = buildGigUrl(gig);

    const eventImage = new URL(gig.location_image_url || "/placeholder-gig.jpeg", "https://giglist.com.au").href;
    const gigBackground = `url(${eventImage})`;
    const eventTitle = `${gig.artist} @ ${gig.name}`.replace(/&amp;/g, "&");
    const eventDescription = `${moment(gig.date).format("dddd, D MMMM YYYY")} at ${gig.start}. ${gig.name}, ${gig.address}, ${gig.suburb}, ${gig.state || ""}`.replace(/&amp;/g, "&");

    const externalUrl = (value: string) => {
        const text = (value || "").trim();
        if (!text || /^(n\/?a|none|null|undefined|-)$/.test(text.toLowerCase())) return "";
        try {
            const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
            return ["http:", "https:"].includes(url.protocol) && url.hostname.includes(".") ? url.href : "";
        } catch { return ""; }
    };
    const artistUrl = externalUrl(gig.artist_url);
    const venueUrl = externalUrl(gig.location_url);
    const lat = Number(gig.lat), lng = Number(gig.lng);
    const destination = gig.lat && gig.lng && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && (lat !== 0 || lng !== 0)
        ? `${lat},${lng}` : `${gig.name}, ${gig.address}, ${gig.suburb}, ${gig.state}`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

    return (
        <>
            <Helmet>
                <title>{`${eventTitle} | Giglist`}</title>
                <link rel="canonical" href={event_url} />
                <meta name="description" content={eventDescription} />
                <meta property="og:title" content={eventTitle} />
                <meta property="og:site_name" content="Giglist" />
                <meta property="og:url" content={event_url} />
                <meta property="og:description" content={eventDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={eventImage} />
                <meta property="og:image:alt" content={eventTitle} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={eventTitle} />
                <meta name="twitter:description" content={eventDescription} />
                <meta name="twitter:image" content={eventImage} />
            </Helmet>
            <EventSchema gig={gig} />

            <div
                className="page-modal-listing"
                style={{ backgroundImage: gigBackground }}
            >
                <div className="ui heading giglist-header modal-content-header">
                    <span className="listing-artist-heading" style={{ textTransform: "uppercase" }}>{gig.artist.replace(/&amp;/g, "&")}</span>{" "}
                    <span style={{ fontFamily: "arial" }}>@</span>{" "}
                    <span>{gig.name.replace(/&amp;/g, "&")}</span>
                    {/* <Icon
                        style={{
                            cursor: "pointer",
                            position: "absolute",
                            right: 30,
                        }}
                        name="copy outline"
                        title={"Copy Link"}
                        onClick={() => navigator.clipboard.writeText(event_url)}
                    /> */}
                </div>

                {/* <img src={ gig.location_image_url } width="400" alt="" /> */}
                {/* <img style={ {position: 'absolute', right: 122, bottom: 50}} src={`${googlemapsurl}?size=100x100&key=${apiKey}
                    &maptype=roadmap&center=${gig.lat},${gig.lng}&zoom=15&markers=color:blue`} alt="" /> */}

                <li
                    className="event-wrapper listing"
                    style={{
                        display: "none",
                        marginLeft: "12px",
                        listStyle: "none",
                    }}
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

                <div className="listing-footer-area">
                    <footer className="listing-poster-footer">
                        <a className="listing-footer-qr" href={event_url} aria-label="Open gig details">
                            <QRCode level="L" size={88} value={event_url} bgColor="#fff" fgColor="#000" />
                        </a>
                        <div className="listing-footer-details">
                            <div className="listing-footer-venue">{gig.name.replace(/&amp;/g, "&")}</div>
                            <div>{[gig.address, gig.suburb, gig.state].filter(Boolean).join(", ")}</div>
                            <div>{moment(gig.date).format("ddd, D MMM YYYY")} · {gig.start}</div>
                        </div>
                        <div className="listing-actions">
                            <a className="listing-action" href={directionsUrl} target="_blank" rel="noopener noreferrer">Directions<Icon name="location arrow" /></a>
                            <AddToCalendar listing={gig} className="listing-action" />
                            {artistUrl && <a className="listing-action" href={artistUrl} target="_blank" rel="noopener noreferrer">Artist/Event<Icon name="music" /></a>}
                            {venueUrl && <a className="listing-action" href={venueUrl} target="_blank" rel="noopener noreferrer">Venue<Icon name="map marker alternate" /></a>}
                            <ShareGig listing={gig} className="listing-action" />
                        </div>
                    </footer>
                </div>
                {/* <div className={"mini-map"}>
                    <img
                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${gig.lat},${gig.lng}&zoom=10&size=135x135&key=AIzaSyDTkZauLKxFmJ3qW2jKsgjLvgt30kqJ3AM`}
                    />
                </div> */}
            </div>
        </>
    );
};
