import { BrowserRouter } from "react-router-dom";
import { GiglistProvider } from "./components/GiglistProvider";
import { Data } from "./components/Data";
import { Loader } from "./components/Loader";
import { LocationModal } from "./components/LocationModal";
import { Menu } from "./components/Menu";
import { Routing } from "./components/Routing";
import { HelmetProvider } from "react-helmet-async";

export const App = () => {
    return (
        <>
            <HelmetProvider>
                <GiglistProvider>
                    <Loader />
                    <main>
                        <div
                            className="ui page grid"
                            style={{ marginTop: "0px" }}
                        >
                            <BrowserRouter>
                                <LocationModal />
                                <Menu />
                                <Routing />
                            </BrowserRouter>
                        </div>
                    </main>
                    <Data />
                </GiglistProvider>
            </HelmetProvider>
        </>
    );
};
