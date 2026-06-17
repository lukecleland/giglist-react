import React from "react";
import { Helmet } from "react-helmet-async";
import { IFrame } from "../components/IFrame";

export const About = () => {
    return (
        <>
            <Helmet>
                <title>About Giglist | Live Music Gig Guide</title>
                <link rel="canonical" href="https://giglist.com.au/about" />
                <meta
                    name="description"
                    content="Learn about Giglist, the live music gig guide built by locals for the local music community."
                />
                <meta property="og:title" content="About Giglist" />
                <meta
                    property="og:description"
                    content="Learn about Giglist, the live music gig guide built by locals for the local music community."
                />
                <meta
                    property="og:url"
                    content="https://giglist.com.au/about"
                />
            </Helmet>
            <IFrame
                src="https://earthworm-koala-c2fs.squarespace.com/"
                className="iframe-parent"
                title="About"
            />
        </>
    );
};
