import React from "react";
import { Helmet } from "react-helmet";
import { IFrame } from "../components/IFrame";

export const About = () => {
    return (
        <>
            <Helmet>
                <link rel="canonical" href="https://giglist.com.au/about" />
            </Helmet>
            <IFrame
                src="https://earthworm-koala-c2fs.squarespace.com/"
                className="iframe-parent"
                title="About"
            />
        </>
    );
};
