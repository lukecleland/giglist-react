import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Icon } from "semantic-ui-react";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import "antd/dist/antd.css";
import { CustomContext, CustomContextType } from "./GiglistProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { filterGigSearch, nameForSearchSlug, searchSlugFromPath } from "../utils/searchUrl";

import { MobileDrawer, useDrawer } from "./MobileDrawer";

export const Menu: React.ElementType = () => {
    const [searchToggle, setSearchToggle] = useState<boolean>(false);
    const drawer = useDrawer();
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [postcode, setPostcode] = useState<string>("0000");
    const [searchQuery, setSearchQuery] = useState("");
    const { pathname: path, search } = useLocation();
    const navigate = useNavigate();
    const { setGiglist, giglistFull, nationalGiglist, setIsSearching } = useContext(
        CustomContext,
    ) as CustomContextType;

    useEffect(() => {
        const slug = searchSlugFromPath(path);
        setSearchQuery(slug ? nameForSearchSlug(nationalGiglist, slug) : "");
        const date = new URLSearchParams(search).get("date");
        setGiglist(slug ? filterGigSearch(nationalGiglist, slug, true) : date ? giglistFull.filter((gig) => gig.datetime === date) : giglistFull);
        setIsSearching(!!slug);
        setSearchToggle(path === "/search" || path === "/search/");
    }, [path, search, giglistFull, nationalGiglist, setGiglist, setIsSearching]);

    useEffect(() => {
        const updatePostcode = () => {
            const location = window.localStorage.getItem("location");
            if (location) setPostcode(String(JSON.parse(location).postcode));
        };
        updatePostcode();
        window.addEventListener("locationchange", updatePostcode);
        return () => window.removeEventListener("locationchange", updatePostcode);
    }, []);

    const doSearch = (e: ChangeEvent<HTMLInputElement> | undefined) => {
        const input = e?.target.value || "";
        setSearchQuery(input);
        setIsSearching(input.length >= 2);
        setGiglist(filterGigSearch(giglistFull, input));
    };

    const filterByDateCalendar = (datetime: string) => {
        setIsSearching(false);
        setSearchQuery("");
        setGiglist(giglistFull.filter((gig) => gig.datetime === datetime));
    };

    const onChange: DatePickerProps["onChange"] = (
        date: any,
        dateString: any,
    ) => {
        filterByDateCalendar(dateString);
    };

    const handleSearchToggle = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        if (path !== "/" && path !== "/search" && path !== "/search/" && !searchSlugFromPath(path)) {
            navigate("/search");
            return;
        }
        setSearchToggle(!searchToggle);
    };

    const postcodeDisplay =
        postcode === "0000" || postcode === "0" ? "National" : postcode;

    return (
        <>
            <div className="computer tablet only row">
                <div className="ui inverted menu navbar full-width">
                    <a href="/">
                        <img
                            className="main-logo"
                            src={require("../styles/assets/newLogoGiglist.png")}
                            alt="Giglist"
                        />
                    </a>
                    <a href="/location" className="item small">
                        <Icon
                            name="crosshairs"
                            style={{
                                color: "#f4f4f4",
                                borderLeft: "black",
                                margin: "-2px 14px 0px 0px",
                            }}
                        />
                        {postcodeDisplay}
                    </a>
                    <div className="right menu">
                        {path !== "/gigmap" && path !== "/submit" && (
                            <a
                                href="/search"
                                className="item search-button"
                                onClick={handleSearchToggle}
                            >
                                Search
                            </a>
                        )}

                        {searchToggle && (
                            <div
                                className="ui inverted form search-form"
                                style={{
                                    backgroundColor: "black",
                                    color: "white",
                                }}
                                id="search-form"
                            >
                                <Icon
                                    onClick={() => {
                                        setGiglist(giglistFull);
                                        setSearchQuery("");
                                        setIsSearching(false);
                                        return setSearchToggle(false);
                                    }}
                                    style={{
                                        position: "absolute",
                                        top: 8,
                                        right: 5,
                                        backgroundColor: "black",
                                        cursor: "pointer",
                                    }}
                                    name={"window close"}
                                    size={"large"}
                                />

                                <div className="field pad">
                                    <label>Artist / Venue / Suburb</label>
                                    <input
                                        autoComplete="off"
                                        name="searchq"
                                        value={searchQuery}
                                        type="text"
                                        placeholder="Search Artist / Venue / Suburb"
                                        id="event_name_search"
                                        autoFocus={true}
                                        onChange={(e) => {
                                            doSearch(e);
                                        }}
                                    />
                                    <br />
                                    <br />
                                    <label>
                                        Filter by Date{" "}
                                        <Space
                                            direction="vertical"
                                            style={{
                                                backgroundColor: "black",
                                                color: "white",
                                            }}
                                        >
                                            <Icon
                                                name="calendar alternate outline"
                                                onClick={() =>
                                                    setDatePickerOpen(true)
                                                }
                                                size="large"
                                                style={{
                                                    color: "white",
                                                    marginTop: 0,
                                                    marginRight: 16,
                                                    cursor: "pointer",
                                                }}
                                            />

                                            <DatePicker
                                                className={"datePicker"}
                                                open={datePickerOpen}
                                                onOpenChange={setDatePickerOpen}
                                                onChange={onChange}
                                            />
                                        </Space>
                                    </label>
                                </div>
                            </div>
                        )}
                        <a href="/gigmap" className="item">
                            Gigmap
                        </a>
                        <a
                            href="/store"
                            className="item"
                        >
                            Store
                        </a>
                        <a href="/about" className="item">
                            About
                        </a>
                        <a href="/submit" className="item">
                            Submit
                        </a>

                        {/* <a href="/supporters" className="item">
                            Supporters
                        </a> */}
                        {/* <a href="shop.php" className="item">
                            Shop
                        </a> */}
                        {/* <a href="/musoswanted" className="item">
                            Musos Wanted!
                        </a> */}
                    </div>
                </div>
            </div>
            <div className="mobile only row">
                <div className="mobile-app-header">
                    <Link to="/" className="mobile-brand" aria-label="Giglist home">
                        <img src={require("../styles/assets/newLogoGiglist.png")} alt="Giglist" />
                    </Link>
                    <form className="mobile-search" role="search" onSubmit={(event) => {
                        event.preventDefault();
                        (event.currentTarget.querySelector("input") as HTMLInputElement)?.blur();
                    }}>
                        <Icon name="search" aria-hidden="true" />
                        <input type="search" aria-label="Search artist, venue or suburb"
                            placeholder="Find Gigs" value={searchQuery}
                            onChange={doSearch} onFocus={() => {
                                if (path !== "/" && path !== "/search" && !searchSlugFromPath(path)) navigate("/search");
                            }} />
                        {!!searchQuery && <button type="button" aria-label="Clear search" onClick={() => doSearch(undefined)}>×</button>}
                    </form>
                    <button className="mobile-menu-button" type="button" aria-label="Open navigation"
                        aria-expanded={drawer.open} onClick={drawer.show}><Icon name="bars" /></button>
                </div>
            </div>
            <MobileDrawer open={drawer.open} close={drawer.close} title="Giglist">
                <nav aria-label="Mobile navigation" className="mobile-drawer-nav">
                    <Link to="/" replace onClick={() => doSearch(undefined)}><Icon name="list" /> All gigs</Link>
                    <Link to="/gigmap" replace><Icon name="map outline" /> Gigmap</Link>
                    <Link to="/location" replace><Icon name="crosshairs" /> Location <small>{postcodeDisplay}</small></Link>
                    <label className="mobile-date-filter"><span><Icon name="calendar alternate outline" /> Filter by date</span>
                        <input type="date" aria-label="Filter gigs by date" onChange={(event) => {
                            if (!event.target.value) return;
                            const selectedDate = event.target.value;
                            navigate(`/search?date=${selectedDate}`, { replace: true });
                        }} />
                    </label>
                    <Link to="/store" replace><Icon name="shopping bag" /> Store</Link>
                    <Link to="/submit" replace><Icon name="plus" /> Submit a gig</Link>
                    <Link to="/about" replace><Icon name="info circle" /> About</Link>
                </nav>
            </MobileDrawer>
        </>
    );
};
