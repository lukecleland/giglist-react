import React, { ChangeEvent, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Menu from "./components/Menu";
import { TDate, TListing } from "./types/types";
import axios from "axios";
import "semantic-ui-css/semantic.min.css";
import "./styles/styles.css";
import { Routing } from "./components/Routing";

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

    return (
        !!giglist && (
            <>
                <main>
                    <div className="ui page grid">
                        <Menu doSearch={doSearch} />
                        <BrowserRouter>
                            <Routing giglist={giglist} />
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
