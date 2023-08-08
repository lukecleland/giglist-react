import React from "react";
import { Dropdown, Button, Popup } from "semantic-ui-react";

const radiusOptions = [
    { key: "1", text: "1km", value: "1" },
    { key: "2", text: "2km", value: "2" },
    { key: "3", text: "3km", value: "3" },
    { key: "4", text: "4km", value: "4" },
    { key: "5", text: "5km", value: "5" },
];

export const Location = () => {
    return (
        <div className="location-outer-content">
            <div className="location-inner-content">
                <h1>
                    Tell us where you want to see gigs
                    <Popup
                        content="This information is saved locally to your browser for
                        your convenience using localStorage, not cookies.
                        We do not have access to track your location by completing this
                        step."
                        trigger={<sup>*</sup>}
                    />
                </h1>

                <div className="ui form">
                    <div className="field">
                        <label>Postcode</label>
                        <input type="text" maxLength={4} />
                    </div>
                    <div className="field">
                        <label>Range</label>
                        <Dropdown
                            className="ui inverted dropdown radius-dropdown"
                            options={radiusOptions}
                            defaultValue={radiusOptions[0].value}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
