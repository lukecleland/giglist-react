import { useState } from "react";
import { TDate, TListing } from "../types/types";
import { GigAds } from "./GigAds";
import { ListingModal } from "./ListingModal";
import { isMobile } from "react-device-detect";

import { useContext } from "react";
import {
    CustomContext,
    CustomContextType,
} from "../components/GiglistProvider";

export const DateList = () => {
    const { giglist, gigAds } = useContext(CustomContext) as CustomContextType;
    const [daysToShow, setDaysToShow] = useState<number>(14);

    const getRandomInt = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const adStart = getRandomInt(0, 100);
    let numberOfAdsToShow = 28;

    const getCondition = (index: number) => {
        if (isMobile) {
            if (index < daysToShow) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    };

    const handleLoadMoreClick = () => {
        setDaysToShow(358);
    };

    const filterByDate = (date: TDate) => {
        return date.listings && date.listings.length > 0;
    };

    const searchMode = false;

    return (
        <>
            {giglist &&
                giglist.length &&
                giglist
                    .filter((d, index) => getCondition(index))
                    .map((date, index) => {
                        const adId = (index + adStart) % gigAds.length;

                        if (date.listings.length === 0) {
                            return;
                        }

                        return (
                            <ul className="day" key={index}>
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
                                    </span>
                                </div>
                                <Listings listings={date.listings} />

                                {date.listings.length > 20 && (
                                    <GigAds adId={adId} gigAds={gigAds} />
                                )}

                                {isMobile && index + 1 === daysToShow && (
                                    <div
                                        style={{
                                            height: 400,
                                            color: "white",
                                            fontFamily: "carbontyperegular",
                                            marginTop: "40px",
                                            textAlign: "center",
                                            width: "100%",
                                            fontSize: "16px",
                                        }}
                                        onClick={handleLoadMoreClick}
                                    >
                                        Load More Gigs...
                                    </div>
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

                    const gig = listing;

                    const event_url =
                        `https://giglist.com.au/gig-${gig.artist}-${gig.name}-${gig.date}`
                            .replace(/\s+/g, "-")
                            .toLowerCase();
                    return (
                        !duplicateListing && (
                            <div>
                                <a style={{ display: "none" }} href={event_url}>
                                    Event Link
                                </a>
                                <ListingModal listing={listing} />
                            </div>
                        )
                    );
                })}
        </>
    );
};
