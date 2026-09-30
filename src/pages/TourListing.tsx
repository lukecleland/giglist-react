import { useContext, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import moment from "moment";
import { CustomContext } from "../components/GiglistProvider";
import { ListingModal } from "../components/ListingModal";
import { filterGigSearch } from "../utils/searchUrl";
import { getTourProfile } from "../utils/tourProfile";
import "./TourListing.scss";

export const TourListing = ({ slug }: { slug: string }) => {
    const { nationalGiglist } = useContext(CustomContext);
    const profile = useMemo(() => getTourProfile(nationalGiglist, slug), [nationalGiglist, slug]);
    const listings = useMemo(() => filterGigSearch(nationalGiglist, slug, true)
        .flatMap((date) => date.listings)
        .sort((a, b) => a.date.localeCompare(b.date)), [nationalGiglist, slug]);
    const title = `${profile.title} — Upcoming Gigs | Giglist`;
    const canonical = `https://giglist.com.au/${encodeURIComponent(slug)}`;
    const description = `See upcoming gigs ${profile.isSuburb ? "in" : profile.isVenue ? "at" : "by"} ${profile.title} on Giglist.`;

    return <div className="tour-page">
        <Helmet>
            <title>{title}</title>
            <link rel="canonical" href={canonical} />
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonical} />
        </Helmet>
        <header className="tour-heading">
            <h1>{profile.title}</h1>
            {profile.addresses.map((address) => <p className="tour-address" key={address}>{address}</p>)}
            <h2>Upcoming Gigs</h2>
        </header>
        {listings.length > 0 ? <ul className="tour-dates">
            {listings.map((gig, index) => <li key={`${gig.id}-${index}`}>
                <ListingModal listing={gig}>
                    <div className="tour-row">
                        <time className="tour-date" dateTime={gig.date}>
                            <span className="tour-month">{moment(gig.date).format("ddd · MMM")}</span>
                            <strong>{moment(gig.date).format("D")}</strong>
                            <span className="tour-year">{moment(gig.date).format("YYYY")}</span>
                        </time>
                        <div className="tour-gig">
                            <h3>{((profile.isVenue || profile.isSuburb) ? gig.artist : gig.name).replace(/&amp;/gi, "&")}</h3>
                            <p>{(profile.isVenue || profile.isSuburb) ? gig.name.replace(/&amp;/gi, "&") : [gig.suburb, gig.state].filter(Boolean).join(", ")}</p>
                        </div>
                        <div className="tour-time">{gig.start}</div>
                        <span className="tour-details">VIEW GIG</span>
                    </div>
                </ListingModal>
            </li>)}
        </ul> : <p className="tour-empty">No upcoming gigs found for this artist, venue or suburb.</p>}
    </div>;
};
