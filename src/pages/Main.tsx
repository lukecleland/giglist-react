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
                <meta property="og:image" content="https://giglist.com.au/giglist-live-music.jpg" />
                <meta property="og:image:alt" content="A live music crowd beneath concert stage lights" />
                <meta name="twitter:image" content="https://giglist.com.au/giglist-live-music.jpg" />
                <meta name="twitter:image:alt" content="A live music crowd beneath concert stage lights" />
                {!isSearchPage && (
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebPage",
                            "@id": "https://giglist.com.au/#webpage",
                            url: "https://giglist.com.au/",
                            name: "Giglist | Live Music Gig Guide Australia",
                            primaryImageOfPage: {
                                "@type": "ImageObject",
                                url: "https://giglist.com.au/giglist-live-music.jpg",
                                width: 1600,
                                height: 1067,
                            },
                        })}
                    </script>
                )}
            </Helmet>
            <div className="side-scroll">
                <section>
                    <DateList />
                </section>
            </div>
        </>
    );
};
