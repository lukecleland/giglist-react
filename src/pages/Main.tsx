import { Helmet } from "react-helmet-async";
import { DateList } from "../components/DateList";

export const Main = () => {
    return (
        <>
            <Helmet>
                <title>Giglist | Live Music Gig Guide Australia</title>
                <link rel="canonical" href="https://giglist.com.au/" />
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
                <meta property="og:url" content="https://giglist.com.au/" />
            </Helmet>
            <div className="side-scroll">
                <section>
                    <DateList />
                </section>
            </div>
        </>
    );
};
