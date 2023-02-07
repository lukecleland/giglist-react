import { Helmet } from "react-helmet";

export const Head = () => {
    return (
        <Helmet>
            <base href="/" />
            <title>Giglist. Gigs in a List</title>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <meta name="theme-color" content="#000000" />
            <meta itemProp="name" content="Gigs. In a list. Giglist." />
            <meta
                itemProp="description"
                content="WA’s largest live music gig guide. Driven by the music community, created and maintained by locals. Features include easy search & gig map. Submit a gig to Giglist."
            />
            <meta
                name="description"
                content="WA’s largest live music gig guide. Driven by the music community, created and maintained by locals. Features include easy search & gig map. Submit a gig to Giglist."
            />

            <link
                rel="shortcut icon"
                type="image/x-icon"
                href="https://giglist.com.au/wp-content/uploads/2018/08/favicon-1.ico"
            />

            <link
                rel="stylesheet"
                href="https://use.fontawesome.com/releases/v5.1.0/css/all.css"
                integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt"
                crossOrigin="anonymous"
            />

            <meta
                property="og:title"
                content="Giglist. Perth Live Music Gig Guide"
            />
            <meta property="og:site_name" content="Giglist" />
            <meta property="og:url" content="https://giglist.com.au" />
            <meta
                property="og:description"
                content="Gigs in a list. Giglist."
            />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="assets/logo_web.png" />

            <title>Giglist</title>
        </Helmet>
    );
};
