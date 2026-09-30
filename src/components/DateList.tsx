import { useMemo, useState } from "react";
import { TDate, TListing } from "../types/types";
import { GigAds } from "./GigAds";
import { ListingModal } from "./ListingModal";
import { isMobile } from "react-device-detect";

import { useContext } from "react";
import {
    CustomContext,
    CustomContextType,
} from "../components/GiglistProvider";
import { buildGigUrl } from "../utils/gigUrl";
import { buildGigAdRotation } from "../utils/gigAdRotation";

export const DateList = () => {
    const { giglist, gigAds, isSearching } = useContext(CustomContext) as CustomContextType;
    const [daysToShow, setDaysToShow] = useState<number>(14);

    const adRotation = useMemo(
        () => {
            if (isSearching) {
                const lastResult = giglist.map((date) => date.listings.length > 0).lastIndexOf(true);
                return giglist.map((_, index) => gigAds.length > 0 && index === lastResult ? 0 : -1);
            }
            return buildGigAdRotation(giglist, gigAds.length);
        },
        [giglist, gigAds, isSearching],
    );

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

    return (
        <>
            {giglist &&
                giglist.length &&
                giglist
                    //.filter((d, index) => getCondition(index))
                    .map((date, index) => {
                        if (date.listings.length < 1) {
                            return;
                        }

                        const adId = adRotation[index];

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
                                {adId >= 0 && (
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

                    const event_url = buildGigUrl(gig);
                    return (
                        !duplicateListing && (
                            <div key={`${listing.id}-${index}`}>
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
