import React, { Fragment, ReactElement } from "react";
import { Helmet } from "react-helmet";
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
import { Head } from "./Head";

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
                    <Fragment>
                        <Helmet>
                            <base href="/" />
                            <link
                                rel="canonical"
                                href="https://giglist.com.au"
                            />
                            <meta charSet="utf-8" />
                            <meta
                                name="viewport"
                                content="width=device-width, initial-scale=1"
                            />
                            <meta name="theme-color" content="#000000" />
                            <meta
                                itemProp="name"
                                content="Gigs. In a list. Giglist."
                            />
                            <meta
                                itemProp="description"
                                content="WA’s largest live music gig guide. Driven by the music community, created and maintained by locals. Features include easy search & gig map. Submit a gig to Giglist."
                            />
                            <meta
                                name="description"
                                content="WA’s largest live music gig guide. Driven by the music community, created and maintained by locals. Features include easy search & gig map. Submit a gig to Giglist."
                            />

                            <link
                                rel="shortcut icon"
                                type="image/x-icon"
                                href="https://giglist.com.au/wp-content/uploads/2018/08/favicon-1.ico"
                            />

                            <link
                                rel="stylesheet"
                                href="https://use.fontawesome.com/releases/v5.1.0/css/all.css"
                                integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt"
                                crossOrigin="anonymous"
                            />

                            <meta
                                property="og:title"
                                content="Giglist. Perth Live Music Gig Guide"
                            />
                            <meta property="og:site_name" content="Giglist" />
                            <meta
                                property="og:url"
                                content="https://giglist.com.au"
                            />
                            <meta
                                property="og:description"
                                content="Gigs in a list. Giglist."
                            />
                            <meta property="og:type" content="website" />
                            <meta
                                property="og:image"
                                content="assets/logo_web.png"
                            />

                            <link rel="manifest" href="./manifest.json" />

                            <link
                                rel="shortcut icon"
                                type="image/x-icon"
                                href="https://giglist.com.au/wp-content/uploads/2018/08/favicon-1.ico"
                            />
                            <link
                                rel="stylesheet"
                                href="./fontawesome.css"
                                integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt"
                                crossOrigin="anonymous"
                            />

                            <title>Giglist. Gigs in a List</title>
                        </Helmet>
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
                                    top: 0,
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
                                    zIndex: -1,
                                    scrollbarWidth: "none",
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
            <Route path="/qr" element={<Navigate to="/" />} />
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
