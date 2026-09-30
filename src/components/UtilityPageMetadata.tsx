import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const utilityPages: Record<string, string> = {
    location: "Set Location", locations: "Locations", supporters: "Supporters",
    gigtools: "Gigtools", locationimagecollage: "Location Images",
    geolocation: "Geolocation", editor: "Editor", redirect: "Redirect",
    today: "Today", notfound: "Not Found", qr: "QR",
};

export const UtilityPageMetadata = () => {
    const path = useLocation().pathname.replace(/^\/|\/$/g, "").toLowerCase();
    const title = Object.prototype.hasOwnProperty.call(utilityPages, path) ? utilityPages[path] : null;
    if (!title) return null;
    return <Helmet>
        <title>{title} | Giglist</title>
        <meta name="robots" content="noindex, follow" />
    </Helmet>;
};
