import { Event } from "schema-dts";
import { jsonLdScriptProps } from "react-schemaorg";
import { TListing } from "../types/types";
import { Helmet } from "react-helmet";

export const EventSchema = ({ gig }: { gig: TListing }) => {
    return (
        <Helmet>
            <script
                {...jsonLdScriptProps<Event>({
                    "@context": "https://schema.org",
                    "@type": "Event",
                    name: gig.artist,
                    startDate: gig.datestamp.date + "",
                    endDate: gig.datestamp.date + "",
                    eventStatus: "https://schema.org/EventScheduled",
                    eventAttendanceMode:
                        "https://schema.org/OnlineEventAttendanceMode",
                    description: gig.name,
                    organizer: {
                        "@type": "Organization",
                        name: gig.name,
                        url: gig.location_url,
                    },
                    image: gig.location_image_url,
                    location: {
                        "@type": "Place",
                        url: gig.location_url,
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
                        validFrom: gig.datestamp.date + "",
                        url: gig.location_url,
                        availability: "https://schema.org/InStock",
                    },
                })}
            />
        </Helmet>
    );
};
