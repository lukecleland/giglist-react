import React from "react";
import { Helmet } from "react-helmet";
import { IFrame } from "../components/IFrame";

export const Submit = () => {
    return (
        <>
            <Helmet>
                <link rel="canonical" href="https://giglist.com.au/submit" />
            </Helmet>
            <IFrame
                src="https://giglist.com.au/submit-no-menu.php"
                className="iframe-parent"
                title="Submit"
            />
        </>
    );
};
