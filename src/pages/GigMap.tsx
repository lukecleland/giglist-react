import React from "react";
import { Helmet } from "react-helmet";
import { IFrame } from "../components/IFrame";
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
    width: "3000px",
    height: "1000px",
};

const defaultMapOptions = {
    fullscreenControl: false,
};

const center = { lat: -31.9505, lng: 115.8605 };

type Props = {
    giglist: TGiglist;
};

// const GigMap = ({ giglist }: Props) => {
//     const { isLoaded } = useJsApiLoader({
//         id: "google-map-script",
//         googleMapsApiKey: "AIzaSyDTkZauLKxFmJ3qW2jKsgjLvgt30kqJ3AM",
//     });

//     const [map, setMap] = React.useState<any>(null);

//     const [infoWindowId, setInfoWindowId] = React.useState<number>(0);

//     const onLoad = React.useCallback(function callback(map: any) {
//         // This is just an example of getting and using the map instance!!! don't just blindly copy!
//         const bounds = new window.google.maps.LatLngBounds(center);
//         map.fitBounds(bounds);

//         setMap(map);
//     }, []);

//     const onMarkerLoad = (marker: any) => {
//         console.log("marker: ", marker);
//     };

//     const onUnmount = React.useCallback(function callback(map: any) {
//         setMap(null);
//     }, []);

//     const handleCloseInfoWindow = () => {
//         console.log("handleCloseInfoWindow");
//     };

//     const onMarkerClick = (id: number) => {
//         console.log("onMarkerClick", id);
//     };

//     return isLoaded ? (
//         <GoogleMap
//             mapContainerStyle={containerStyle}
//             options={{
//                 styles: mapStyles,
//                 zoom: 12,
//                 disableDefaultUI: true,
//                 gestureHandling: "greedy",
//             }}
//             center={center}
//             zoom={10}
//             onLoad={onLoad}
//             onUnmount={onUnmount}
//         >
//             <>
//                 {giglist.length &&
//                     giglist.map((date) => {
//                         return date.listings
//                             .filter(
//                                 (listing, index) =>
//                                     listing.date === "2023-02-28"
//                             )
//                             .map((listing, index) => {
//                                 console.log(listing);
//                                 return (
//                                     <Marker
//                                         onLoad={onMarkerLoad}
//                                         onClick={() =>
//                                             setInfoWindowId(listing.id)
//                                         }
//                                         position={{
//                                             lat: parseFloat(listing.lat),
//                                             lng: parseFloat(listing.lng),
//                                         }}
//                                         key={listing.id}
//                                         icon={{
//                                             url: require("../styles/assets/guitarpin.png"),
//                                             scaledSize:
//                                                 new window.google.maps.Size(
//                                                     30,
//                                                     30
//                                                 ),
//                                         }}
//                                     >
//                                         {infoWindowId === listing.id ? (
//                                             <InfoWindow
//                                                 onCloseClick={() =>
//                                                     setInfoWindowId(0)
//                                                 }
//                                                 //options={{ maxWidth: 100 }}
//                                             >
//                                                 <ListingModal
//                                                     listing={listing}
//                                                 />
//                                             </InfoWindow>
//                                         ) : (
//                                             <></>
//                                         )}
//                                     </Marker>
//                                 );
//                             });
//                     })}
//             </>
//         </GoogleMap>
//     ) : (
//         <></>
//     );
// };

// export default React.memo(GigMap);

export const GigMap = () => {
    return (
        <>
            <Helmet>
                <link rel="canonical" href="https://giglist.com.au/gigmap" />
            </Helmet>
            <IFrame
                src="https://giglist.com.au/gigmap-no-menu.php"
                className="iframe-parent"
                title="Submit"
            />
        </>
    );
};
