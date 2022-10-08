import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./components/Menu";
import PageListing from "./components/PageListing";
import { TDate, TListing } from "./types/types";
import "./styles/styles.css";
import { DateList } from "./components/DateList";
import { Head } from "./components/Head";
import { Helmet } from "react-helmet";
import axios from "axios";
//import giglistFeed from "./feed.json";

export const App = () => {
    const [giglist, setGiglist] = useState<TDate[]>([]);
    const [giglistFeed, setGiglistFeed] = useState<TDate[]>([]);

    useEffect(() => {
        axios.get("https://giglist.com.au/feed.php").then((response) => {
            setGiglistFeed(response.data);
            setGiglist(response.data);
        });
    }, []);

    const doSearch = (e: ChangeEvent<HTMLInputElement> | undefined) => {
        if (!e) {
            setGiglist(giglistFeed as TDate[]);
            return;
        }
        const input = e.target.value;
        const newGiglist: TDate[] = [];
        giglistFeed.forEach((el) => {
            const foundObjects = el.listings.filter(
                (l) =>
                    l.artist.toLowerCase().includes(input.toLowerCase()) ||
                    l.name.toLowerCase().includes(input.toLowerCase())
            );
            if (foundObjects.length) {
                newGiglist.push({
                    datestring: el.datestring,
                    datetime: el.datetime,
                    listings: [...(foundObjects as TListing[])],
                });
            }
        });

        if (!newGiglist.length) {
            newGiglist.push({
                datestring: "No Gigs Found",
                datetime: "",
                listings: [],
            });
        }
        setGiglist(newGiglist as TDate[]);
    };

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
        !!giglist && (
            <>
                <Helmet>
                    <Head />
                </Helmet>
                <main>
                    <div className="ui page grid">
                        <Menu doSearch={doSearch} />
                        <BrowserRouter>
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <div className="side-scroll ">
                                            <section>
                                                <DateList giglist={giglist} />
                                            </section>
                                        </div>
                                    }
                                />
                                <Route
                                    path="/gigmap"
                                    element={
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
                                    }
                                />
                                <Route
                                    path="/submit"
                                    element={
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
                                    }
                                />
                                <Route
                                    path="/musoswanted"
                                    element={
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
                                    }
                                />
                                {routes}
                                <Route
                                    path="/notfound"
                                    element={
                                        <div className="side-scroll ">
                                            <section>
                                                <DateList giglist={giglist} />
                                            </section>
                                        </div>
                                    }
                                />
                            </Routes>
                        </BrowserRouter>
                    </div>
                    <div className="footer">
                        <div className="footer-outer">
                            {/* <a href="/classifieds" className="item">
                                Classifieds
                            </a>
                            <a href="shop.php" className="item">
                                Shop
                            </a> */}
                            <a
                                href="/"
                                className="item float-right giglist-copy"
                            >
                                <span className="copy">&copy;</span>Giglist 2022
                            </a>
                        </div>
                    </div>
                </main>
            </>
        )
    );
};

export default App;
