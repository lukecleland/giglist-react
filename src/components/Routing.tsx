import React, { Fragment, ReactElement } from "react";
import { Helmet } from "react-helmet";
import { Route } from "react-router";
import { Routes } from "react-router-dom";
import { TDate, TGiglist } from "../types/types";
import { DateList } from "./DateList";
import { LocationGraphic } from "./LocationGraphic";
import PageListing from "./PageListing";
import { WordCloud } from "./WordCloud";

export const Routing = ({
    giglist,
    searchMode,
    filterByDate,
}: {
    giglist: TGiglist;
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
                    <Fragment>
                        <Helmet>
                            <link
                                rel="canonical"
                                href="https://giglist.com.au/"
                            />
                        </Helmet>
                        <div className="side-scroll ">
                            <section>
                                <DateList
                                    giglist={giglist}
                                    filterByDate={filterByDate}
                                    searchMode={searchMode}
                                />
                            </section>
                        </div>
                    </Fragment>
                }
            />
            <Route
                path="/gigmap"
                element={
                    <Fragment>
                        <Helmet>
                            <link
                                rel="canonical"
                                href="https://giglist.com.au/gigmap"
                            />
                        </Helmet>
                        <div className="gigmap">
                            <iframe
                                style={{
                                    position: "absolute",
                                    top: 62,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    width: "100%",
                                    height: "100%",
                                    border: "none !important",
                                    outline: "none",
                                    margin: 0,
                                    padding: 0,
                                    overflow: "hidden",
                                    zIndex: 10,
                                }}
                                frameBorder="0"
                                height={"100%"}
                                width={"100%"}
                                title={"Gigmap"}
                                src="https://giglist.com.au/gigmap-no-menu.php"
                            ></iframe>
                        </div>
                    </Fragment>
                }
            />
            <Route
                path="/submit"
                element={
                    <Fragment>
                        <Helmet>
                            <link
                                rel="canonical"
                                href="https://giglist.com.au/submit"
                            />
                        </Helmet>
                        <div className={"iframe-parent"}>
                            <iframe
                                style={{
                                    position: "absolute",
                                    top: "55 !important",
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    width: "100%",
                                    height: "100%",
                                    border: "none !important",
                                    outline: "none",
                                    margin: 0,
                                    padding: 0,
                                    overflow: "hidden",
                                    zIndex: 10,
                                }}
                                className={"iframe"}
                                frameBorder="0"
                                height={"100%"}
                                width={"100%"}
                                title={"Submit"}
                                src="https://giglist.com.au/submit-no-menu.php"
                            ></iframe>
                        </div>
                    </Fragment>
                }
            />
            <Route
                path="/musoswanted"
                element={
                    <Fragment>
                        <Helmet>
                            <link
                                rel="canonical"
                                href="https://giglist.com.au/musoswanted"
                            />
                        </Helmet>
                        <div className={"iframe-parent"}>
                            <iframe
                                style={{
                                    position: "absolute",
                                    top: 62,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    width: "100%",
                                    height: "100%",
                                    border: "none !important",
                                    outline: "none",
                                    margin: 0,
                                    padding: 0,
                                    overflow: "hidden",
                                    zIndex: 999999,
                                }}
                                className={"iframe"}
                                frameBorder="0"
                                height={"100%"}
                                width={"100%"}
                                title={"Musos Wanted"}
                                src="https://giglist.com.au/classifieds"
                            ></iframe>
                        </div>
                    </Fragment>
                }
            />
            <Route
                path="/oldsite"
                element={
                    <Fragment>
                        <div className={"iframe-parent"}>
                            <iframe
                                style={{
                                    position: "absolute",
                                    top: 62,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    width: "100%",
                                    height: "100%",
                                    border: "none !important",
                                    outline: "none",
                                    margin: 0,
                                    padding: 0,
                                    overflow: "hidden",
                                    zIndex: 999999,
                                }}
                                className={"iframe"}
                                frameBorder="0"
                                height={"100%"}
                                width={"100%"}
                                title={"Musos Wanted"}
                                src="https://giglist.com.au/index.php"
                            ></iframe>
                        </div>
                    </Fragment>
                }
            />
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
                path="/locationwordcollage"
                element={
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "black",
                        }}
                    >
                        <WordCloud giglist={giglist}></WordCloud>
                    </div>
                }
            />
            <Route
                path="/notfound"
                element={
                    <div className="side-scroll ">
                        <section>
                            <DateList
                                giglist={giglist}
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
