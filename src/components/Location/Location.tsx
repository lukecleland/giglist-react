import React, { useState, ChangeEvent, useEffect, FocusEvent } from "react";
import { Button } from "semantic-ui-react";
import postcodeData from "../output";
import { useContext } from "react";
import { CustomContext, CustomContextType } from "../GiglistProvider";
import "./Location.scss";

interface PostcodeInfo {
    postcode: number;
    lat: number;
    long: number;
}

export const Location = () => {
    const [postcode, setPostcode] = useState<string>("0000");
    const [lat, setLat] = useState<number | null>(null);
    const [long, setLong] = useState<number | null>(null);
    const [disabled, setDisabled] = useState<boolean>(true);
    const { allTimeCount } = useContext(CustomContext) as CustomContextType;

    const handlePostcodeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputPostcode = e.target.value;
        setPostcode(inputPostcode);

        const postcodeInfo: PostcodeInfo | undefined = postcodeData.find(
            (row: PostcodeInfo) => row.postcode === parseInt(inputPostcode)
        );

        if (postcodeInfo) {
            setLat(postcodeInfo.lat);
            setLong(postcodeInfo.long);
            setDisabled(false);
        } else {
            setLat(null);
            setLong(null);
            setDisabled(true);
        }
    };

    const handlePostcodeFocus = (e: FocusEvent<HTMLInputElement>) => {
        setPostcode("");
    };

    useEffect(() => {
        const location = window.localStorage.getItem("location");

        if (location) {
            const locationObj = JSON.parse(location);
            setPostcode(locationObj.postcode);
            setLat(locationObj.lat);
            setLong(locationObj.long);
            setDisabled(false);
        }
    }, []);

    return (
        <div className="location-outer-content">
            <div className="location-inner-content">
                <h1>
                    Welcome to Giglist. Live music gigs, in a list. <br />
                    Let us know where you are...
                </h1>
                <h2>
                    or to see every listed gig in Australia{" "}
                    <a
                        href="/"
                        style={{ textDecoration: "underline" }}
                        onClick={() => {
                            const nationalLocation = postcodeData.find(
                                (row: PostcodeInfo) => row.postcode === 0,
                            );
                            window.localStorage.setItem(
                                "location",
                                JSON.stringify({ ...nationalLocation, postcode: "0000" }),
                            );
                        }}
                    >
                        click here
                    </a>
                </h2>

                <div className="ui form">
                    <div className="field">
                        <label>Postcode</label>
                        <input
                            type="text"
                            value={postcode}
                            onChange={handlePostcodeChange}
                            onFocus={handlePostcodeFocus}
                        />

                        {lat === null && long === null ? (
                            <p>Invalid postcode</p>
                        ) : (
                            <></>
                        )}
                    </div>
                    <Button
                        className="ui button"
                        disabled={disabled}
                        onClick={() => {
                            window.localStorage.setItem(
                                "location",
                                JSON.stringify({
                                    postcode,
                                    lat,
                                    long,
                                })
                            );
                            window.location.href = "/";
                        }}
                    >
                        Update
                    </Button>

                    <p>
                        You can change this at any time. <br />
                        This information is stored in your browser cache.
                        <br />
                        We do not store your location data.
                    </p>

                    <p style={{ fontSize: "22px" }}>
                        {allTimeCount && allTimeCount.count} gigs listed since
                        2017. <br />
                    </p>
                </div>
            </div>
        </div>
    );
};
