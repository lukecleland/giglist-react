import React, { useContext, useEffect } from "react";
import { TGiglist, GigAd, TAllTimeCount } from "../types/types";
import axios from "axios";
import { CustomContext, CustomContextType } from "./GiglistProvider";
import { post } from "jquery";

const filterByLocationFromStorage = (giglist: TGiglist) => {
    const location = window.localStorage.getItem("location");

    if (location) {
        const locationObj = JSON.parse(location);
        const lat = parseFloat(locationObj.lat);
        const long = parseFloat(locationObj.long);
        const kms = parseInt(locationObj.radius);
        const distance = (1 / 60) * 0.621371 * kms;
        const postcode = parseInt(locationObj.postcode);

        if (postcode === 0) {
            return giglist;
        }

        return giglist.filter(
            (date, index) =>
                (giglist[index].listings = date.listings.filter((gig) => {
                    return (
                        parseFloat(gig.lat) < lat + distance &&
                        parseFloat(gig.lat) > lat - distance &&
                        parseFloat(gig.lng) < long + distance &&
                        parseFloat(gig.lng) > long - distance
                    );
                }))
        );
    } else {
        return giglist;
    }
};

const getPostcode = () => {
    const location = window.localStorage.getItem("location");
    let postcode = 0;
    if (location) {
        const locationObj = JSON.parse(location);
        postcode = parseInt(locationObj.postcode);
    }
    return postcode;
};

const Data = () => {
    console.log("Data component");

    const { setGiglist, setGigAds, setGiglistFull, setAllTimeCount } =
        useContext(CustomContext) as CustomContextType;

    const feedLink = "https://giglist.com.au/feed_national.php";

    useEffect(() => {
        // Fetch GIGADS from an API and update the state
        axios
            .get(
                "https://api.baserow.io/api/database/rows/table/108866/?user_field_names=true",
                {
                    headers: {
                        Authorization: "Token oBtxXLOu03SJmaB8O8TNh3c8M6dbMobB",
                    },
                }
            )
            .then((response) => {
                const validAds: GigAd[] = response.data.results
                    .filter((ad: GigAd) => ad.Active)
                    .filter((ad: GigAd) => {
                        const postcodeFirstChar = getPostcode().toString()[0];
                        const postPrefixes = ad.Postcode_Prefixes.split(",");
                        if (
                            postPrefixes.includes(postcodeFirstChar) ||
                            postPrefixes.includes("0")
                        ) {
                            return true;
                        }
                    });
                setGigAds(validAds);
            })
            .catch((error) => {
                console.error("Error fetching gig ads:", error);
            });

        // Fetch giglist data from the national API and update the context
        axios
            .get(feedLink)
            .then((response) => {
                if (setGiglist) {
                    const filteredGiglist = filterByLocationFromStorage(
                        response.data as TGiglist
                    );
                    setGiglist(filteredGiglist as TGiglist);
                    setGiglistFull(filteredGiglist as TGiglist);
                }
            })
            .catch((error) => {
                console.error("Error fetching giglist data:", error);
            });

        axios
            .get("https://giglist.com.au/feed_all_time_count.php")
            .then((response) => {
                if (setAllTimeCount) {
                    setAllTimeCount(response.data as TAllTimeCount);
                }
            })
            .catch((error) => {
                console.error("Error fetching giglist data:", error);
            });
    }, [setGiglist, setGigAds]);

    return null;
};

export { Data };
