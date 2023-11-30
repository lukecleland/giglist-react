import React, { useState, ChangeEvent, useEffect } from "react";
import { Dropdown, Button, Popup } from "semantic-ui-react";
import postcodeData from "./output";

const raddii = [50, 20, 10, 5, 1];

const radiusOptions = raddii.map((radius) => ({
    key: radius,
    text: `${radius}km`,
    value: radius,
}));

interface PostcodeInfo {
    postcode: number;
    lat: number;
    long: number;
}

export const Location = () => {
    const [postcode, setPostcode] = useState<string>("6000");
    const [lat, setLat] = useState<number | null>(null);
    const [long, setLong] = useState<number | null>(null);
    const [radius, setRadius] = useState<number>(radiusOptions[0].value);
    const [disabled, setDisabled] = useState<boolean>(true);

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

    useEffect(() => {
        const location = window.localStorage.getItem("location");

        if (location) {
            const locationObj = JSON.parse(location);
            setPostcode(locationObj.postcode);
            setLat(locationObj.lat);
            setLong(locationObj.long);
            setRadius(100);
            setDisabled(false);
        }
    }, []);

    return (
        <div className="location-outer-content">
            <div className="location-inner-content">
                <h1>Set Your Giglist Location</h1>
                <p>
                    You can change this at any time, also we just add it to your
                    browser. We don't track it
                </p>

                <div className="ui form">
                    <div className="field">
                        <label>Postcode</label>
                        <input
                            type="text"
                            value={postcode}
                            onChange={handlePostcodeChange}
                        />

                        {lat === null && long === null ? (
                            <p>Invalid postcode</p>
                        ) : (
                            <></>
                        )}
                    </div>
                    {/* <div className="field">
                        <label>Range</label>
                        <Dropdown
                            className="ui inverted dropdown radius-dropdown"
                            options={radiusOptions}
                            defaultValue={radiusOptions[0].value}
                        />
                    </div> */}
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
                                    radius,
                                })
                            );
                            window.location.href = "/";
                        }}
                    >
                        Update
                    </Button>
                </div>
            </div>
        </div>
    );
};
