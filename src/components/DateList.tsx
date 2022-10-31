import { Fragment } from "react";
import { TDate, TListing } from "../types/types";
import { GigAds } from "./GigAds";
import { ListingModal } from "./ListingModal";
import { isMobile } from "react-device-detect";

type Props = {
    giglist: TDate[];
    searchMode: boolean;
    filterByDate: (date: TDate) => void;
};

export const DateList = ({ giglist, searchMode, filterByDate }: Props) => {
    /**
     * a function that returns a random integer between min (included) and max (included)
     */
    const getRandomInt = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const adStart = getRandomInt(0, 100);

    let numberOfAdsToShow = 28;

    if (isMobile) {
        numberOfAdsToShow = 0;
    }

    return (
        <>
            {giglist.length &&
                giglist.map((date, index) => {
                    const adId = (index + adStart) % 6;
                    return (
                        <ul className="day" key={index}>
                            {/* <a
                                    href="/"
                                    style={{
                                        position: "relative",
                                        fontFamily: "carbontyperegular",
                                        color: "white",
                                        fontSize: "48px",
                                        marginLeft: "12px",
                                        paddingTop: "200px",
                                        // backgroundColor: "black",
                                    }}
                                >
                                    <br />
                                    <br />
                                    Giglist
                                    <img
                                    style={{
                                        paddingTop: "20px",
                                        marginLeft: "0px",
                                    }}
                                    className="main-logo"
                                    src={require("../styles/assets/newLogoGiglist.png")}
                                    alt="Giglist"
                                />
                                </a> */}
                            <div
                                className="date"
                                onClick={() => {
                                    filterByDate(date);
                                }}
                            >
                                <span
                                    style={{
                                        letterSpacing: "-0.2rem",
                                    }}
                                >
                                    {date.datestring}
                                    {/* <span style={{ fontSize: "12px" }}>
                                            {moment(date.datetime).year()}
                                        </span> */}
                                </span>
                            </div>
                            <Listings listings={date.listings} />

                            {!searchMode && index < numberOfAdsToShow && (
                                <GigAds adId={adId} />
                            )}
                        </ul>
                    );
                })}
        </>
    );
};

export const Listings = ({ listings }: { listings: TListing[] }) => {
    return (
        <>
            {!!listings.length &&
                listings.map((listing: TListing, index: number) => {
                    const duplicateListing =
                        index > 1 &&
                        listing.artist === listings[index - 1].artist &&
                        listing.date_formatted ===
                            listings[index - 1].date_formatted;
                    return (
                        !duplicateListing && (
                            <Fragment key={index}>
                                <ListingModal listing={listing} />
                            </Fragment>
                        )
                    );
                })}
        </>
    );
};
