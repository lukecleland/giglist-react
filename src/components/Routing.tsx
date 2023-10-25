import React, { Fragment, ReactElement } from "react";
import { Route } from "react-router";
import { Navigate } from "react-router-dom";
import { Routes } from "react-router-dom";
import { TDate, TGiglist } from "../types/types";
import { DateList } from "./DateList";
import { GigAd } from "./GigAds";
import { LocationGraphic } from "./LocationGraphic";
import PageListing from "./PageListing";
import { WordCloud } from "./WordCloud";
import Geolocation from "./Geolocation";
import { Main } from "../pages/Main";
import { GigMap } from "../pages/GigMap";
import { Submit } from "../pages/Submit";
import { Supporters } from "./Supporters";
import { Location } from "./Location";

export const Routing = ({
    giglist,
    gigAds,
    searchMode,
    filterByDate,
}: {
    giglist: TGiglist;
    gigAds: GigAd[];
    searchMode: boolean;
    filterByDate: (date: TDate) => void;
}) => {
    const routes =
        !!giglist &&
        giglist.length &&
        giglist
            .map(
                (date, i) =>
                    date.listings &&
                    date.listings.length &&
                    date.listings.map((gig, j) => {
                        const gigurl =
                            `/gig-${gig.artist}-${gig.name}-${gig.date}`
                                .replace(/\s+/g, "-")
                                .toLowerCase();
                        const el: ReactElement = <PageListing listing={gig} />;
                        return <Route path={gigurl} element={el} key={i * j} />;
                    })
            )
            .flat();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Main
                        giglist={giglist}
                        gigAds={gigAds}
                        filterByDate={filterByDate}
                        searchMode={searchMode}
                    />
                }
            />
            <Route path="/location" element={<Location />} />
            <Route path="/gigmap" element={<GigMap />} />
            <Route path="/qr" element={<Navigate to="/" />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/supporters" element={<Supporters />} />
            <Route
                path="/gigtools"
                element={
                    <div className="gigtools">
                        <script>
                            location.href='https://giglist.com.au/gigtools/index.php'
                        </script>
                    </div>
                }
            />
            <Route
                path="/locations"
                element={
                    <div className="gigtools">
                        <script>
                            location.href='https://giglist.com.au/locations.php'
                        </script>
                    </div>
                }
            />
            {routes}
            <Route
                path="/locationimagecollage"
                element={
                    <div>
                        <LocationGraphic giglist={giglist}></LocationGraphic>
                    </div>
                }
            />
            <Route
                path="/geolocation"
                element={
                    <div>
                        <Geolocation />
                    </div>
                }
            />
            <Route
                path="/redirect"
                element={
                    <div>
                        <Navigate to="/" />
                    </div>
                }
            />
            <Route
                path="/today"
                element={
                    <>
                        <div
                            style={{
                                width: "400px",
                                height: "50px",
                                position: "absolute",
                                backgroundColor: "black",
                                top: 0,
                                right: 0,
                                zIndex: 1,
                            }}
                        ></div>
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "black",
                            }}
                        >
                            <WordCloud giglist={giglist}></WordCloud>
                        </div>
                    </>
                }
            />
            <Route
                path="/notfound"
                element={
                    <div className="side-scroll ">
                        <section>
                            <DateList
                                giglist={giglist}
                                gigAds={gigAds}
                                filterByDate={Date}
                                searchMode={searchMode}
                            />
                        </section>
                    </div>
                }
            />
        </Routes>
    );
};
