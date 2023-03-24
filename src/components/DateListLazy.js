import { Fragment, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { TDate, TListing } from "../types/types";
import { GigAd, GigAds } from "./GigAds";
import { ListingModal } from "./ListingModal";

// type Props = {
//     giglist: TDate[];
//     gigAds: GigAd[];
//     searchMode: boolean;
//     filterByDate: (date: TDate) => void;
// };

const DateListLazy = ({ giglist, gigAds, searchMode, filterByDate }) => {
    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const [daysToShow, setDaysToShow] = useState(365);
    const adStart = getRandomInt(0, 100);
    let numberOfAdsToShow = 28;

    const getCondition = (index) => {
        if (isMobile) {
            if (index < daysToShow) {
                return true;
            } else {
                return false;
            }
        }
        return true;
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

                                {!searchMode && index < numberOfAdsToShow && (
                                    <GigAds adId={adId} gigAds={gigAds} />
                                )}
                            </ul>
                        );
                    })}
        </>
    );
};

const Listings = ({ listings }) => {
    return (
        <>
            {!!listings.length &&
                listings.map((listing, index) => {
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
                            <Fragment key={index}>
                                <a style={{ display: "none" }} href={event_url}>
                                    Event Link
                                </a>
                                <ListingModal listing={listing} />
                            </Fragment>
                        )
                    );
                })}
        </>
    );
};

export default DateListLazy;
