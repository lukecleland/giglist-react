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
import { ListingModal } from "../components/ListingModal";

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

    const onMarkerLoad = (marker: any) => {
        // console.log("marker: ", marker);
    };

    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null);
    }, []);

    const handleCloseInfoWindow = () => {
        console.log("handleCloseInfoWindow");
    };

    const onMarkerClick = (id: number) => {
        console.log("onMarkerClick", id);
    };

    return isLoaded ? (
        <>
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
                                        listing.date === searchDate
                                )
                                .map((listing, index) => {
                                    return (
                                        <Marker
                                            onLoad={onMarkerLoad}
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
                                                        30
                                                    ),
                                            }}
                                        >
                                            {infoWindowId === listing.id ? (
                                                // Add styles to InfoWindow
                                                <InfoWindow
                                                    onCloseClick={() =>
                                                        setInfoWindowId(0)
                                                    }
                                                >
                                                    <ListingModal
                                                        listing={listing}
                                                    />
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
