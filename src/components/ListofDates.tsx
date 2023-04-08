import { useState } from "react";
import { TDate, TListing } from "../types/types";
import { GigAd, GigAds } from "./GigAds";
import { ListingModal } from "./ListingModal";
import { isMobile } from "react-device-detect";

type Props = {
    giglist: TDate[];
    gigAds: GigAd[];
    searchMode: boolean;
    filterByDate: (date: TDate) => void;
};

export const DateList = ({
    giglist,
    gigAds,
    searchMode,
    filterByDate,
}: Props) => {
    const getRandomInt = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const daysToShowWindow = 28;

    const [daysToShow, setDaysToShow] = useState<number>(daysToShowWindow);
    const adStart = getRandomInt(0, 100);
    let numberOfAdsToShow = 28;

    if (isMobile) {
        numberOfAdsToShow = 28;
    }

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
        setDaysToShow(daysToShow + daysToShowWindow);
    };

    return (
        <>
            {giglist.length &&
                giglist
                    .filter((d, index) => getCondition(index))
                    .map((date, index) => {
                        const adId = (index + adStart) % gigAds.length;
                        return (
                            <ul className="day" key={index}>
                                <Listings
                                    listings={date.listings}
                                    filterByDate={filterByDate}
                                    date={date}
                                />

                                {!searchMode && index < numberOfAdsToShow && (
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

export const Listings = ({
    listings,
    filterByDate,
    date,
}: {
    listings: TListing[];
    filterByDate: (date: TDate) => void;
    date: TDate;
}) => {
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
                            <div className="date-event-wrapper">
                                <a style={{ display: "none" }} href={event_url}>
                                    Event Link
                                </a>
                                <ListingModal
                                    listing={listing}
                                    // filterByDate={filterByDate}
                                    // date={date}
                                />
                            </div>
                        )
                    );
                })}
        </>
    );
};
