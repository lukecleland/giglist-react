import { Helmet } from "react-helmet-async";
import { DateList } from "../components/DateList";
import { useLocation } from "react-router-dom";
import { searchSlugFromPath } from "../utils/searchUrl";
import { TourListing } from "./TourListing";

export const Main = () => {
    const { pathname } = useLocation();
    const isSearchPage = /^\/search\/?$/.test(pathname);
    const slug = searchSlugFromPath(pathname);
    if (slug) return <TourListing slug={slug} />;
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
                    <DateList />
                </section>
            </div>
        </>
    );
};
