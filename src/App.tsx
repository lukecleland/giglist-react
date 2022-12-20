import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { TDate, TListing } from "./types/types";
import axios from "axios";
import "semantic-ui-css/semantic.min.css";
import "./styles/styles.css";
import { Routing } from "./components/Routing";
import Menu from "./components/Menu";
import { isMobile } from "react-device-detect";
import { GigAd } from "./components/GigAds";

const Loader = () => {
    const [loading, setLoading] = useState(true);
    const [percent, setPercent] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
        setTimeout(() => setPercent(false), 50);
    }, []);

    return (
        <div
            className={"loader"}
            style={{
                display: "flex",
                visibility: loading ? "visible" : "hidden",
                opacity: loading ? 1 : 0,
            }}
        >
            <img
                style={{
                    marginTop: "-130px",
                    marginLeft: "0px",
                    width: "200px",
                    clear: "right",
                }}
                className="main-logo"
                src={require("./styles/assets/newLogoGiglist.png")}
                alt="Giglist"
            />
            <div
                style={{
                    position: "absolute",
                    width: percent ? "0%" : "160px",
                    marginTop: "-70px",
                    height: "2px",
                    backgroundColor: "white",
                }}
            ></div>
        </div>
    );
};

export const App = () => {
    const [giglist, setGiglist] = useState<TDate[]>([]);
    const [gigAds, setGigAds] = useState<GigAd[]>([]);
    const [giglistFeed, setGiglistFeed] = useState<TDate[]>([]);
    const [searchMode, setSearchMode] = useState<boolean>(false);
    const myRef = useRef<HTMLDivElement>(null);

    let feedLink = "https://giglist.com.au/feed.php";

    if (isMobile) {
        feedLink = "https://giglist.com.au/feed.php?mobile";
    }

    useEffect(() => {
        axios
            .get(
                "https://api.baserow.io/api/database/rows/table/108866/?user_field_names=true",
                {
                    headers: {
                        Authorization: "Token oBtxXLOu03SJmaB8O8TNh3c8M6dbMobB",
                    },
                }
            )
            .then((response) => {
                const validAds: GigAd[] = response.data.results.filter(
                    (ad: GigAd) => ad.Active
                );
                setGigAds([...validAds]);
            });

        axios.get(feedLink).then((response) => {
            setGiglistFeed(response.data);
            setGiglist(response.data);
        });
    }, []);

    const filterByDate = (date: TDate) => {
        setGiglist(giglistFeed.filter((gig) => gig.datetime === date.datetime));
    };

    const filterByLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;
            const kms = 10;
            const distance = (1 / 60) * 0.621371 * kms;

            giglistFeed.filter(
                (date, index) =>
                    (giglistFeed[index].listings = date.listings.filter(
                        (gig) =>
                            parseFloat(gig.lat) < lat + distance &&
                            parseFloat(gig.lat) > lat - distance &&
                            parseFloat(gig.lng) < lng + distance &&
                            parseFloat(gig.lng) > lng - distance
                    ))
            );

            if (!giglistFeed.length) {
                alert("No gigs found in your area");
                return false;
            }

            setGiglist([...giglistFeed]);
        });
    };

    const filterByDateCalendar = (datetime: string) => {
        setGiglist(giglistFeed.filter((gig) => gig.datetime === datetime));
        // myRef &&
        //     myRef.current &&
        //     myRef.current.scrollIntoView({
        //         behavior: "smooth",
        //         block: "start",
        //     });
    };

    const doSearch = (e: ChangeEvent<HTMLInputElement> | undefined) => {
        if (!e || e.target.value.length < 2) {
            setSearchMode(false);
            setGiglist(giglistFeed as TDate[]);
            return;
        }
        const input = e.target.value;

        if (input.length > 2) {
            setSearchMode(true);
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
        }
    };

    return (
        !!giglist &&
        gigAds && (
            <>
                {/* {!giglist.length && <div>No Gigs Found</div>} */}
                <Loader />
                <main>
                    <div
                        ref={myRef}
                        className="ui page grid"
                        style={{ marginTop: "0px" }}
                    >
                        <BrowserRouter>
                            <Menu
                                doSearch={doSearch}
                                filterByDateCalendar={filterByDateCalendar}
                                filterByLocation={filterByLocation}
                            />
                            <Routing
                                giglist={giglist}
                                gigAds={gigAds}
                                filterByDate={filterByDate}
                                searchMode={searchMode}
                            />
                        </BrowserRouter>
                    </div>
                    <div className="footer">
                        <div className="footer-outer">
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
