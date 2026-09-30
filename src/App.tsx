import { BrowserRouter, useLocation } from "react-router-dom";
import { GiglistProvider } from "./components/GiglistProvider";
import { Data } from "./components/Data";
import { Loader } from "./components/Loader";
import { LocationModal } from "./components/LocationModal";
import { Menu } from "./components/Menu";
import { Routing } from "./components/Routing";
import { HelmetProvider } from "react-helmet-async";
import { QrPoster } from "./pages/QrPoster";
import { qrTargetFromPath, posterRouteFromPath } from "./utils/qrUrl";
import { UtilityPageMetadata } from "./components/UtilityPageMetadata";

export const App = () => {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </HelmetProvider>
    );
};

const AppContent = () => {
    const { pathname } = useLocation();
    const posterRoute = posterRouteFromPath(pathname);
    if (posterRoute) return <QrPoster key={pathname} targetUrl={posterRoute.targetUrl} poster month={posterRoute.month} />;
    const targetUrl = qrTargetFromPath(pathname);
    if (targetUrl) return <QrPoster key={targetUrl} targetUrl={targetUrl} />;
    return (
        <GiglistProvider>
            <UtilityPageMetadata />
            <Loader />
            <main>
                <div className={`ui page grid${/^\/gigmap\/?$/i.test(pathname) ? " gigmap-layout" : ""}`} style={{ marginTop: "0px" }}>
                    <LocationModal />
                    <Menu />
                    <Routing />
                </div>
            </main>
            <Data />
        </GiglistProvider>
    );
};
