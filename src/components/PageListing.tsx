import React, { ReactElement } from "react";
import QRCode from "react-qr-code";
import { TListing } from "../types/types";
import { Icon } from "semantic-ui-react";
import { EventSchema } from "./EventSchema";

// const apiKey = "AIzaSyDTkZauLKxFmJ3qW2jKsgjLvgt30kqJ3AM";
// const googlemapsurl = "https://maps.googleapis.com/maps/api/staticmap";

export const PageListing = ({
    listing,
}: {
    listing: TListing;
}): ReactElement => {
    const gig = listing;

    const event_url = `/gig/${gig.artist}/${gig.name}/${gig.date}`
        .replace(/\s+/g, "-")
        .toLowerCase();

    const bg = `url(${gig.location_image_url})`;
    const gigBackground = bg === "url()" ? `url('placeholder-gig.jpeg')` : bg;

    return (
        <>
            <EventSchema gig={gig} />
            <div
                className="page-modal-listing"
                style={{
                    backgroundImage: gigBackground,
                    backgroundColor: "none",
                    backgroundSize: "cover",
                    width: "100%",
                    minHeight: "500px",
                }}
            >
                <div
                    className="ui heading giglist-header"
                    style={{ background: "rgba(0,0,0,0.9)" }}
                >
                    {gig.artist} <span style={{ fontFamily: "arial" }}>@</span>{" "}
                    {gig.name.replace(/&amp;/g, "&")}
                    <Icon
                        style={{
                            cursor: "pointer",
                            position: "absolute",
                            right: 30,
                        }}
                        name="copy outline"
                        title={"Copy Link"}
                        onClick={() => navigator.clipboard.writeText(event_url)}
                    />
                </div>

                <div
                    style={{
                        background: "rgba(0,0,0,0.7)",
                        padding: "6px",
                        position: "absolute",
                        right: 22,
                        bottom: 50,
                    }}
                >
                    <QRCode level={"L"} size={100} value={event_url} />
                </div>

                {/* <img src={ gig.location_image_url } width="400" alt="" /> */}
                {/* <img style={ {position: 'absolute', right: 122, bottom: 50}} src={`${googlemapsurl}?size=100x100&key=${apiKey}&maptype=roadmap&center=${gig.lat},${gig.lng}&zoom=15&markers=color:blue`} alt="" /> */}

                <div
                    style={{
                        background: "rgba(0,0,0,0.8)",
                        borderTopRightRadius: "10px",
                        padding: "15px",
                        color: "white",
                        position: "absolute",
                        fontSize: "18px",
                        bottom: 50,
                        left: 22,
                        fontFamily: "carbontype",
                    }}
                >
                    {/* <p><a href={event_url}>Link to this event</a></p> */}

                    {/* <div>{ gig.artist.replace(/&amp;/g, '&') }</div> */}
                    <div style={{ fontFamily: "carbontyperegular" }}>
                        {gig.start}{" "}
                        {gig.date_formatted.toString().toUpperCase()}
                    </div>
                    <div
                        style={{
                            fontSize: "14px",
                            //textTransform: 'uppercase'
                        }}
                    >
                        <div style={{ fontFamily: "Merriweather" }}>
                            {gig.name.replace(/&amp;/g, "&")}, {gig.suburb}
                        </div>
                        <div style={{ fontFamily: "Merriweather" }}>
                            {gig.address}
                        </div>
                        <div style={{ float: "right" }}>
                            <Icon size="large" name="map" />
                            &nbsp;&nbsp;&nbsp;
                            <Icon size="large" name="share square" />
                            &nbsp;&nbsp;&nbsp;
                            <Icon size="large" name="facebook" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PageListing;
