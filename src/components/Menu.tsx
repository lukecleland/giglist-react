import React from 'react';

export const Menu:React.ElementType = () => {

    return (
        <>
            <div className="computer tablet only row">
                <div className="ui inverted menu navbar full-width">
                    <a href="/"><img className="main-logo" src={require('../styles/assets/logo_web.png')} width="300" alt="Giglist" /></a>
                    <div className="right menu">
                        <a href="/" className="item search-button">Search</a>
                        <a href="submit.php" className="item">Submit</a>
                        <a href="/gigmap" className="item">Gigmap</a>
                    </div>
                </div>
            </div>
            <div className="mobile only row">
            <div className="ui inverted menu navbar full-width">
                <a href="/"><div className="logo"></div></a>

                <div className="menu-icon">
                <i className="fa fa-bars"></i>
                </div>

                <div className="mobile-links">
                <ul>
                    <li>
                    <a href="/" className="item search-mobile">Search</a>
                    <div className="ui inverted form search-form-mobile" id="search-form-mobile" style={{display:"none"}}>

                        <form className="search_event" name="search_event" action="" method="post" autoComplete="off">
                        <div className="field pad">
                            <label>Artist / Venue / Suburb</label>
                            <input name="searchq" type="text" placeholder="Search Artist / Venue / Suburb" id="event_name_search" />
                        </div>
                        <div className="field pad">
                            <input name="submit" type="submit" value="Search" className="ui button" id="eventSearchBtn" />
                        </div>
                        </form>
                    </div>
                    </li>
                    <li><a className="item" href="/gigmap>">Gigmap</a></li>
                    <li><a className="item" href="submit.php">Submit</a></li>
                    <li><a className="item" href="shop.php">Shop</a></li>
                </ul>
                </div>

            </div>

        </div>
    </>
    )
}

export default Menu;