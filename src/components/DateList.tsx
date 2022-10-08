import { Fragment } from "react";
import { TDate, TListing } from "../types/types";
import { ListingModal } from "./ListingModal";

type Props = {
    giglist: TDate[];
};

export const DateList = ({ giglist }: Props) => {
    return (
        <>
            {giglist.length &&
                giglist.map((date, index) => {
                    return (
                        <ul className="day" key={index}>
                            <div className="date">
                                <span>{date.datestring}</span>
                            </div>
                            <Listings listings={date.listings} />
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
