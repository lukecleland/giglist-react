import React from "react";
import { Helmet } from "react-helmet-async";
import { IFrame } from "../components/IFrame";

export const Submit = () => {
    return (
        <>
            <Helmet>
                <title>Submit a Gig | Giglist</title>
                <link rel="canonical" href="https://giglist.com.au/submit" />
                <meta
                    name="description"
                    content="Submit your live music event to Giglist and help local audiences discover your show."
                />
                <meta property="og:title" content="Submit a Gig | Giglist" />
                <meta
                    property="og:description"
                    content="Submit your live music event to Giglist and help local audiences discover your show."
                />
                <meta
                    property="og:url"
                    content="https://giglist.com.au/submit"
                />
            </Helmet>
            <IFrame
                src="https://giglist.com.au/submit-no-menu.php"
                className="iframe-parent"
                title="Submit"
            />
        </>
    );
};
