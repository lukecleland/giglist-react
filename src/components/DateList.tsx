import { Fragment, useState, lazy, Suspense } from "react";
import { TDate, TListing } from "../types/types";
import { GigAd, GigAds } from "./GigAds";
import { ListingModal } from "./ListingModal";

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
    // lazy load the listings component
    const ListingsLazy = lazy(() => import("./DateListLazy"));

    return (
        <Suspense fallback={"Loading..."}>
            <ListingsLazy
                giglist={giglist}
                gigAds={gigAds}
                searchMode={searchMode}
                filterByDate={filterByDate}
            />
        </Suspense>
    );
};
