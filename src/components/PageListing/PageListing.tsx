import React, { ReactElement } from "react";
import QRCode from "react-qr-code";
import { TListing } from "../../types/types";
import { Icon } from "semantic-ui-react";
import { EventSchema } from "../EventSchema";
import { Helmet } from "react-helmet";
import { google } from "calendar-link";
import { EmailShareButton, FacebookShareButton } from "react-share";
import moment from "moment";
import "./PageListing.scss";

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

    const event_url =
        `https://giglist.com.au/gig-${gig.artist}-${gig.name}-${gig.date}`
            .replace(/\s+/g, "-")
            .toLowerCase();

    const bg = `url(${gig.location_image_url})`;
    const gigBackground = bg === "url()" ? `url('./placeholder-gig.jpeg')` : bg;

    // Set event as an object
    const event = {
        title: gig.artist + " @" + gig.name,
        description: gig.artist + " @" + gig.name,
        start: moment(gig.datestamp.date).format("YYYY-MM-DD HH:mm:ss +0800"),
        end: moment(gig.datestamp.date)
            .add(1, "hours")
            .format("YYYY-MM-DD HH:mm:ss +0800"),
    };

    return (
        <>
            <Helmet>
                <link rel="canonical" href={event_url} />
                <meta property="og:site_name" content="Giglist" />
                <meta property="og:url" content={event_url} />
                <meta property="og:description" content={event.title} />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={gig.location_image_url} />
            </Helmet>
            <EventSchema gig={gig} />

            <div
                className="page-modal-listing"
                style={{ backgroundImage: gigBackground }}
            >
                <div className="ui heading giglist-header modal-content-header">
                    <a
                        href={gig.artist_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textTransform: "uppercase" }}
                    >
                        {gig.artist}
                    </a>{" "}
                    <span style={{ fontFamily: "arial" }}>@</span>{" "}
                    <a href={gig.location_url} target="_blank" rel="noreferrer">
                        {gig.name.replace(/&amp;/g, "&")}
                    </a>
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

                <div className={"modal-qr-code"}>
                    <QRCode
                        level={"L"}
                        size={130}
                        value={event_url}
                        bgColor="#fff"
                        fgColor="#000"
                    />
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

                <div className={"modal-content"}>
                    <div
                        style={{
                            fontFamily:
                                "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
                            letterSpacing: "0.5px",
                            backgroundColor: "black",
                            float: "left",
                            display: "inline-block",
                            borderTopRightRadius: "6px",
                            padding: "20px",
                        }}
                    >
                        {moment(gig.datestamp.date).format("dddd, MMMM Do, ")}

                        {gig.start.toLowerCase()}

                        <div>{gig.name.replace(/&amp;/g, "&")}</div>
                        <div className="address">
                            {gig.address} {gig.suburb}
                        </div>
                        <div className="address" style={{ marginTop: 10 }}>
                            <a href={gig.artist_url} target="_blank">
                                Artist/Event Link{" "}
                            </a>{" "}
                            |&nbsp;
                            <a href={gig.location_url} target="_blank">
                                Venue Link{" "}
                            </a>
                        </div>
                        <div style={{ float: "right" }}>
                            {/* <a href={event_url} target="_blank">
                                Share Link
                            </a> */}
                            {/* <a
                                title="Add to Google Calendar"
                                target="_blank"
                                rel="noreferrer"
                                href={google(event)}
                            >
                                <Icon name="google" />
                            </a> */}
                            {/* <EmailShareButton url={event_url}>
                                <Icon name="mail" /> 
                            </EmailShareButton>*/}
                            <FacebookShareButton url={event_url}>
                                <Icon name="facebook" />
                            </FacebookShareButton>

                            {/* <Icon size="large" name="map" />
                            &nbsp;&nbsp;&nbsp;
                            <Icon size="large" name="share square" />
                            &nbsp;&nbsp;&nbsp;
                            <Icon size="large" name="facebook" /> */}
                        </div>
                    </div>
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
