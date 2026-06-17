import React, { useEffect } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import { mapStyles } from "../styles/mapStyles";
import { TGiglist } from "../types/types";
import moment from "moment";
import { Helmet } from "react-helmet-async";

const containerStyle = {
    width: "100%",
    height: "110%",
};

const defaultMapOptions = {
    fullscreenControl: false,
};

let center = { lat: -31.9505, lng: 115.8605 };
let zoom = 13;

type Props = {
    giglist: TGiglist;
};

const GigMap = ({ giglist }: Props) => {
    const location = window.localStorage.getItem("location");
    const [searchDate, setSearchDate] = React.useState<string>("");

    const DateControl = () => {
        return (
            <div className="date-control">
                <div>
                    <button
                        className="previous"
                        onClick={() => {
                            const date = moment(searchDate)
                                .add(-1, "days")
                                .format("YYYY-MM-DD");
                            setSearchDate(date);
                        }}
                    >
                        <img
                            src={require("../styles/assets/triangle.png")}
                            alt="previous"
                        />
                    </button>
                    <p>{moment(searchDate).format("ddd MMM D, YYYY")}</p>
                    <button
                        className="next"
                        onClick={() => {
                            const date = moment(searchDate)
                                .add(1, "days")
                                .format("YYYY-MM-DD");
                            setSearchDate(date);
                        }}
                    >
                        <img
                            src={require("../styles/assets/triangle.png")}
                            alt="next"
                        />
                    </button>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const date = moment().format("YYYY-MM-DD");
        setSearchDate(date);
        if (location) {
            const locationObj = JSON.parse(location);
            const lat = parseFloat(locationObj.lat);
            const long = parseFloat(locationObj.long);

            center = { lat: lat, lng: long };
            zoom = 13;
        }
    }, []);

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: "AIzaSyDTkZauLKxFmJ3qW2jKsgjLvgt30kqJ3AM",
    });

    const [map, setMap] = React.useState<any>(null);

    const [infoWindowId, setInfoWindowId] = React.useState<number>(0);

    const onLoad = React.useCallback(function callback(map: any) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null);
    }, []);

    return isLoaded ? (
        <>
            <Helmet>
                <title>Gig Map | Giglist</title>
                <link rel="canonical" href="https://giglist.com.au/gigmap" />
                <meta
                    name="description"
                    content="Explore live music gigs on the Giglist map and discover venues and shows near you."
                />
                <meta property="og:title" content="Gig Map | Giglist" />
                <meta
                    property="og:description"
                    content="Explore live music gigs on the Giglist map and discover venues and shows near you."
                />
                <meta
                    property="og:url"
                    content="https://giglist.com.au/gigmap"
                />
            </Helmet>
            <DateControl />
            <GoogleMap
                mapContainerStyle={containerStyle}
                options={{
                    styles: mapStyles,
                    disableDefaultUI: true,
                    gestureHandling: "greedy",
                    zoom,
                }}
                center={center}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                <>
                    {giglist.length &&
                        giglist.map((date) => {
                            return date.listings
                                .filter(
                                    (listing, index) =>
                                        listing.date === searchDate,
                                )
                                .map((listing, index) => {
                                    return (
                                        <Marker
                                            onClick={() =>
                                                setInfoWindowId(listing.id)
                                            }
                                            position={{
                                                lat: parseFloat(listing.lat),
                                                lng: parseFloat(listing.lng),
                                            }}
                                            key={listing.id}
                                            icon={{
                                                url: require("../styles/assets/guitarpin.png"),
                                                scaledSize:
                                                    new window.google.maps.Size(
                                                        30,
                                                        30,
                                                    ),
                                            }}
                                        >
                                            {infoWindowId === listing.id ? (
                                                <InfoWindow
                                                    onCloseClick={() =>
                                                        setInfoWindowId(0)
                                                    }
                                                >
                                                    <div className="gigmap-preview">
                                                        <img
                                                            src={
                                                                listing.location_image_url ||
                                                                "https://giglist.com.au/newLogoGiglist.png"
                                                            }
                                                            alt={listing.name}
                                                            className="gigmap-preview-image"
                                                        />
                                                        <div className="gigmap-preview-body">
                                                            <div className="gigmap-preview-artist">
                                                                {listing.artist.replace(
                                                                    /&amp;/g,
                                                                    "&",
                                                                )}
                                                            </div>
                                                            <div className="gigmap-preview-venue">
                                                                {listing.name.replace(
                                                                    /&amp;/g,
                                                                    "&",
                                                                )}
                                                                {", "}
                                                                {listing.suburb}
                                                            </div>
                                                            <div className="gigmap-preview-time">
                                                                {listing.start}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </InfoWindow>
                                            ) : (
                                                <></>
                                            )}
                                        </Marker>
                                    );
                                });
                        })}
                </>
            </GoogleMap>
        </>
    ) : (
        <></>
    );
};

export default React.memo(GigMap);
