import { ReactElement, useContext } from "react";
import { Route } from "react-router";
import { Navigate } from "react-router-dom";
import { Routes } from "react-router-dom";
import { DateList } from "./DateList";
import { LocationGraphic } from "./LocationGraphic";
import { WordCloud } from "./WordCloud";
import { Geolocation } from "./Geolocation";
import { Main } from "../pages/Main";
import GigMap from "../pages/GigMap";
import { Submit } from "../pages/Submit";
import { Supporters } from "./Supporters";
import { GiglistEditor } from "./GiglistEditor";
import { CustomContext, CustomContextType } from "./GiglistProvider";
import { Location } from "./Location/Location";
import { PageListing } from "./PageListing/PageListing";

export const Routing = () => {
    const { giglist } = useContext(CustomContext) as CustomContextType;

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
            {routes}
            <Route path="/" element={<Main />} />
            <Route path="/location" element={<Location />} />
            <Route path="/gigmap" element={<GigMap giglist={giglist} />} />
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
                path="/store"
                element={
                    <div className="gigtools">
                        <script>
                            location.href='https://giglist.deco-apparel.com/'
                        </script>
                    </div>
                }
            />
            <Route
                path="/editor"
                element={
                    <div>
                        <GiglistEditor />
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
                            <WordCloud />
                        </div>
                    </>
                }
            />
            <Route
                path="/notfound"
                element={
                    <div className="side-scroll ">
                        <section>
                            <DateList />
                        </section>
                    </div>
                }
            />
        </Routes>
    );
};
