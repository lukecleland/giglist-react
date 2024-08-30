import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Icon } from "semantic-ui-react";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import "antd/dist/antd.css";
import { CustomContext, CustomContextType } from "./GiglistProvider";
import { TGiglist, TListing } from "../types/types";
import { cp } from "fs";

export const Menu: React.ElementType = () => {
    const [searchToggle, setSearchToggle] = useState<boolean>(false);
    const [menuToggle, setMenuToggle] = useState<boolean>(false);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [datePickerOpenMobile, setDatePickerOpenMobile] = useState(false);
    const [postcode, setPostcode] = useState<string>("0000");
    const { giglist, setGiglist, giglistFull } = useContext(
        CustomContext
    ) as CustomContextType;

    useEffect(() => {
        const location = window.localStorage.getItem("location");
        if (location) {
            setPostcode(JSON.parse(location).postcode);
        }
    }, []);

    const doSearch = (e: ChangeEvent<HTMLInputElement> | undefined) => {
        // Is this needed?
        if (!e || e.target.value.length < 2) {
            setGiglist(giglistFull);
            return;
        }

        const input = e.target.value;

        setGiglist(
            giglistFull.map((el) => {
                const foundObjects = el.listings.filter(
                    (l) =>
                        l.artist.toLowerCase().includes(input.toLowerCase()) ||
                        l.name.toLowerCase().includes(input.toLowerCase()) ||
                        l.suburb.toLowerCase().includes(input.toLowerCase())
                );

                return {
                    datestring: el.datestring,
                    datetime: el.datetime,
                    listings: [...foundObjects],
                };
            })
        );
    };

    const filterByDateCalendar = (datetime: string) => {
        setGiglist(giglistFull.filter((gig) => gig.datetime === datetime));
    };

    const onChange: DatePickerProps["onChange"] = (
        date: any,
        dateString: any
    ) => {
        filterByDateCalendar(dateString);
    };

    const handleSearchToggle = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setSearchToggle(!searchToggle);
    };

    const handleMenuToggle = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setMenuToggle(!menuToggle);
    };

    const handleSearchEnter = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        console.log(event.key);
        if (event.key === "Enter") {
            setSearchToggle(false);
            setMenuToggle(false);
        }
    };

    const path = window.location.pathname;

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
                        {postcode}
                    </a>
                    <div className="right menu">
                        {path != "/gigmap" && path != "/submit" && (
                            <a
                                href="#"
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
                <div className="ui inverted menu navbar full-width">
                    <a href="/">
                        <div className="logo"></div>
                    </a>

                    <div className="menu-icon">
                        <a href="/location" className="location-icon">
                            <Icon name="crosshairs" />
                        </a>
                        <Space
                            direction="vertical"
                            style={{
                                backgroundColor: "black",
                                color: "white",
                                height: 30,
                            }}
                        >
                            <Icon
                                name="calendar alternate outline"
                                onClick={() => setDatePickerOpenMobile(true)}
                                style={{
                                    color: "#f4f4f4",
                                    borderLeft: "black",
                                    margin: "-10px 0px 0px 0px",
                                }}
                            />

                            <DatePicker
                                className={"datePicker"}
                                open={datePickerOpenMobile}
                                onOpenChange={setDatePickerOpenMobile}
                                onChange={onChange}
                            />
                        </Space>

                        <Icon
                            name="sidebar"
                            style={{
                                color: "#f4f4f4",
                                borderLeft: "black",
                                margin: "-10px 0px 0px 0px",
                            }}
                            onClick={handleMenuToggle}
                        ></Icon>
                    </div>

                    <div
                        className="mobile-links"
                        style={
                            menuToggle
                                ? { display: "block" }
                                : { display: "none" }
                        }
                    >
                        <ul>
                            <li>
                                <a
                                    href="/"
                                    className="item search-mobile"
                                    onClick={handleSearchToggle}
                                >
                                    Search
                                </a>
                                {searchToggle && (
                                    <div
                                        className="ui inverted form search-form-mobile"
                                        id="search-form-mobile"
                                    >
                                        <div className="field pad">
                                            <label>
                                                Artist / Venue / Suburb
                                            </label>
                                            <input
                                                autoComplete="off"
                                                name="searchq"
                                                type="text"
                                                placeholder="Search Artist / Venue / Suburb"
                                                id="event_name_search"
                                                autoFocus={false}
                                                onChange={(e) => doSearch(e)}
                                                onKeyDown={(e) => {
                                                    handleSearchEnter(e);
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </li>
                            <li>
                                <a className="item" href="/gigmap">
                                    Gigmap
                                </a>
                            </li>
                            <li>
                                <a className="item" href="/submit">
                                    Submit
                                </a>
                            </li>
                            <li>
                                <a href="/location" className="item">
                                    Set Location
                                </a>
                            </li>
                            {/* <li>
                                <a className="item" href="shop.php">
                                    Shop
                                </a>
                            </li> */}
                            {/* <li>
                                <a className="item" href="/musoswanted">
                                    Musos Wanted!
                                </a>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};
