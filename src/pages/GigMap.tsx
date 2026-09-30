import React, { useMemo, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer, InfoWindow } from "@react-google-maps/api";
import { mapStyles } from "../styles/mapStyles";
import { TGiglist } from "../types/types";
import { getMapLocations } from "../utils/mapLocations";
import moment from "moment";
import { Helmet } from "react-helmet-async";
import markerIcon from "../styles/assets/gigmap-marker.svg";
import clusterIcon from "../styles/assets/gigmap-cluster.svg";

const containerStyle = { width: "100%", height: "110%" };
const clusterStyles = [{
    url: clusterIcon, width: 56, height: 56, textColor: "#111", textSize: 18, fontWeight: "bold",
}];
const mapOptions = {
    styles: mapStyles, disableDefaultUI: true, zoomControl: true,
    gestureHandling: "greedy", backgroundColor: "#171b22",
};

const GigMap = ({ giglist }: { giglist: TGiglist }) => {
    const [searchDate, setSearchDate] = useState(() => moment().format("YYYY-MM-DD"));
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [center] = useState(() => {
        try {
            const location = JSON.parse(window.localStorage.getItem("location") || "null");
            const lat = Number(location?.lat);
            const lng = Number(location?.long);
            if (location?.lat && location?.long && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
        } catch { /* Use Perth when no valid saved location is available. */ }
        return { lat: -31.9505, lng: 115.8605 };
    });
    const locations = useMemo(() => getMapLocations(giglist, searchDate), [giglist, searchDate]);
    const selectedLocation = locations.find((location) => location.key === selectedKey);
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: "AIzaSyDTkZauLKxFmJ3qW2jKsgjLvgt30kqJ3AM",
    });
    const changeDate = (days: number) => {
        setSelectedKey(null);
        setSearchDate(moment(searchDate).add(days, "days").format("YYYY-MM-DD"));
    };

    return <>
        <Helmet>
            <title>Gigmap | Giglist</title>
            <link rel="canonical" href="https://giglist.com.au/gigmap" />
            <meta name="description" content="Explore live music gigs on the Giglist map and discover venues and shows near you." />
            <meta property="og:title" content="Gigmap | Giglist" />
            <meta property="og:description" content="Explore live music gigs on the Giglist map and discover venues and shows near you." />
            <meta property="og:url" content="https://giglist.com.au/gigmap" />
        </Helmet>
        <div className="date-control"><div>
            <button className="previous" onClick={() => changeDate(-1)} aria-label="Previous day">
                <img src={require("../styles/assets/triangle.png")} alt="" />
            </button>
            <p>{moment(searchDate).format("ddd MMM D, YYYY")}</p>
            <button className="next" onClick={() => changeDate(1)} aria-label="Next day">
                <img src={require("../styles/assets/triangle.png")} alt="" />
            </button>
        </div></div>
        {isLoaded && <GoogleMap mapContainerStyle={containerStyle} options={mapOptions}
            center={center} zoom={13} onClick={() => setSelectedKey(null)}>
            <MarkerClusterer key={searchDate} gridSize={40} maxZoom={18}
                averageCenter styles={clusterStyles} zoomOnClick
                title="Click to zoom in to gig locations" onClick={() => setSelectedKey(null)}>
                {(clusterer) => <>{locations.map((location) => <Marker
                    key={location.key} clusterer={clusterer} position={location.position}
                    title={location.listings.map((listing) => `${listing.artist} — ${listing.name}`).join("; ")}
                    onClick={() => setSelectedKey(location.key)}
                    icon={{ url: markerIcon, scaledSize: new window.google.maps.Size(32, 32), anchor: new window.google.maps.Point(16, 16) }}
                />)}</>}
            </MarkerClusterer>
            {selectedLocation && <InfoWindow position={selectedLocation.position} onCloseClick={() => setSelectedKey(null)}>
                <div style={{ maxHeight: "min(60vh, 480px)", overflowY: "auto" }}>
                    {selectedLocation.listings.map((listing, index) => <div className="gigmap-preview" key={`${listing.id}-${index}`}>
                        <img src={listing.location_image_url || "https://giglist.com.au/newLogoGiglist.png"}
                            alt={listing.name} className="gigmap-preview-image" />
                        <div className="gigmap-preview-body">
                            <div className="gigmap-preview-artist">{listing.artist.replace(/&amp;/g, "&")}</div>
                            <div className="gigmap-preview-venue">{listing.name.replace(/&amp;/g, "&")}, {listing.suburb}</div>
                            <div className="gigmap-preview-time">{listing.start}</div>
                        </div>
                    </div>)}
                </div>
            </InfoWindow>}
        </GoogleMap>}
    </>;
};

export default React.memo(GigMap);
