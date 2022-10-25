import React, { useState } from "react";
import { Icon } from "semantic-ui-react";

export const Menu: React.ElementType = ({ doSearch }) => {
    const [searchToggle, setSearchToggle] = useState<boolean>(false);
    const [menuToggle, setMenuToggle] = useState<boolean>(false);

    const handleSearchToggle = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setSearchToggle(!searchToggle);
    };

    const handleMenuToggle = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setMenuToggle(!menuToggle);
    };

    const handleSearchClick = (event: React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault();
        setSearchToggle(false);
        setMenuToggle(false);
    };

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
                    <div className="right menu">
                        <a
                            href="/"
                            className="item search-button"
                            onClick={handleSearchToggle}
                        >
                            Search
                        </a>

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
                                        doSearch(null);
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
                                ></Icon>
                                <form
                                    className="search_event"
                                    name="search_event"
                                    action=""
                                    method="post"
                                >
                                    <div className="field pad">
                                        <label>Artist / Venue / Suburb</label>
                                        <input
                                            autoComplete="off"
                                            name="searchq"
                                            type="text"
                                            placeholder="Search Artist / Venue / Suburb"
                                            id="event_name_search"
                                            autoFocus={false}
                                            onChange={(e) => doSearch(e)}
                                        />
                                    </div>
                                    {/* <div className="field pad">
                                        <input
                                            name="submit"
                                            type="submit"
                                            value="Search"
                                            className="ui button"
                                            id="eventSearchBtn"
                                            onClick={handleSearchClick}
                                        />
                                    </div> */}
                                </form>
                            </div>
                        )}
                        <a href="/gigmap" className="item">
                            Gigmap
                        </a>
                        <a href="/submit" className="item">
                            Submit
                        </a>
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
                        <Icon
                            name="sidebar"
                            style={{ color: "white", borderLeft: "black" }}
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
                                        <form
                                            className="search_event"
                                            name="search_event"
                                            action=""
                                            method="post"
                                            autoComplete="off"
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
                                                    onChange={(e) =>
                                                        doSearch(e)
                                                    }
                                                />
                                            </div>
                                            <div className="field pad">
                                                <input
                                                    name="submit"
                                                    type="submit"
                                                    value="Search"
                                                    className="ui button"
                                                    id="eventSearchBtn"
                                                    onClick={handleSearchClick}
                                                />
                                            </div>
                                        </form>
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

export default Menu;
