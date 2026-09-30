import { Helmet } from "react-helmet-async";
import { DateList } from "../components/DateList";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { CustomContext } from "../components/GiglistProvider";
import { searchSlugFromPath } from "../utils/searchUrl";

export const Main = () => {
    const { giglist, giglistFull } = useContext(CustomContext);
    const { pathname } = useLocation();
    const isSearchPage = /^\/search\/?$/.test(pathname);
    const slug = searchSlugFromPath(pathname);
    const noMatches = slug && giglistFull.length > 0 &&
        !giglist.some((date) => date.listings.length > 0);
    return (
        <>
            <Helmet>
                <title>{isSearchPage ? "Search | Giglist" : "Giglist | Live Music Gig Guide Australia"}</title>
                <link rel="canonical" href={`https://giglist.com.au/${isSearchPage ? "search" : ""}`} />
                <meta
                    name="description"
                    content="Discover live music gigs across Australia. Browse upcoming shows by date, search by artist or venue, and find gigs near you."
                />
                <meta
                    property="og:title"
                    content="Giglist | Live Music Gig Guide"
                />
                <meta
                    property="og:description"
                    content="Discover live music gigs across Australia. Browse upcoming shows by date, search by artist or venue, and find gigs near you."
                />
                <meta property="og:url" content={`https://giglist.com.au/${isSearchPage ? "search" : ""}`} />
            </Helmet>
            <div className="side-scroll">
                <section>
                    {noMatches && <p style={{ padding: "2rem" }}>
                        No gigs match your search in the current location.
                        {" "}<a href="/location">Change location</a> or edit your search.
                    </p>}
                    <DateList />
                </section>
            </div>
        </>
    );
};
