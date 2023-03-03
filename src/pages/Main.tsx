import React from "react";
import { Helmet } from "react-helmet";
import { DateList } from "../components/DateList";
import { GigAd } from "../components/GigAds";
import { TDate, TGiglist } from "../types/types";

type Props = {
    giglist: TGiglist;
    gigAds: GigAd[];
    filterByDate: (date: TDate) => void;
    searchMode: boolean;
};

export const Main = ({ giglist, gigAds, filterByDate, searchMode }: Props) => {
    return (
        <>
            <Helmet></Helmet>
            <div className="side-scroll ">
                <section>
                    <DateList
                        giglist={giglist}
                        gigAds={gigAds}
                        filterByDate={filterByDate}
                        searchMode={searchMode}
                    />
                </section>
            </div>
        </>
    );
};
