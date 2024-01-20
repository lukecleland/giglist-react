import { Event } from "schema-dts";
import { helmetJsonLdProp, jsonLdScriptProps } from "react-schemaorg";
import { TListing } from "../types/types";
import { Helmet } from "react-helmet-async";
import moment from "moment";

export const EventSchema = ({ gig }: { gig: TListing }) => {
    return (
        <Helmet>
            <script
                {...helmetJsonLdProp<Event>({
                    "@context": "https://schema.org",
                    "@type": "Event",
                    name: gig.artist,
                    startDate: moment(gig.datestamp.date).format(
                        "YYYY-MM-DD HH:mm:ss +0800"
                    ),
                    endDate: moment(gig.datestamp.date)
                        .add(1, "hours")
                        .format("YYYY-MM-DD HH:mm:ss +0800"),
                    eventStatus: "https://schema.org/EventScheduled",
                    eventAttendanceMode:
                        "https://schema.org/OfflineEventAttendanceMode",
                    description: gig.artist + " @" + gig.name,
                    organizer: {
                        "@type": "Organization",
                        name: gig.name,
                        url: gig.location_url || "",
                    },
                    image: gig.location_image_url || "",
                    location: {
                        "@type": "Place",
                        url: gig.location_url || "",
                        name: gig.name,
                        address: {
                            "@type": "PostalAddress",
                            streetAddress: gig.address,
                            addressLocality: gig.suburb,
                            addressRegion: gig.state,
                            postalCode: gig.zip,
                            addressCountry: "AU",
                        },
                    },
                    performer: {
                        "@type": "PerformingGroup",
                        name: gig.artist,
                    },
                    offers: {
                        "@type": "Offer",
                        name: "TICKET",
                        price: "0",
                        priceCurrency: "AUD",
                        // validFrom:
                        //     moment().format("YYYY-MM-DD HH:mm:ss") + ".000000",
                        url: gig.location_url || "",
                        availability: "https://schema.org/InStock",
                    },
                })}
            />
        </Helmet>
    );
};
