import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { HelmetProvider } from "react-helmet-async";
import moment from "moment";
import GigMap from "./GigMap";

let mockMapProps;
let mockClusterProps;
const mockClusterer = {};
jest.mock("@react-google-maps/api", () => ({
    useJsApiLoader: () => ({ isLoaded: true }),
    GoogleMap: (props) => { mockMapProps = props; return <div>{props.children}</div>; },
    MarkerClusterer: (props) => { mockClusterProps = props; return props.children(mockClusterer); },
    Marker: ({ onClick, title, clusterer }) => <button data-marker={clusterer === mockClusterer} onClick={onClick}>{title}</button>,
    InfoWindow: ({ children }) => <div data-popup>{children}</div>,
}));

test("dark clustered map shows co-located gigs and clears them when changing date", () => {
    const oldGoogle = window.google;
    window.google = { maps: { Size: class {}, Point: class {} } };
    const container = document.createElement("div");
    document.body.appendChild(container);
    const gig = { id: 1, artist: "First Act", name: "Venue", suburb: "Perth", lat: "-31.95", lng: "115.86", date: moment().format("YYYY-MM-DD"), start: "8pm" };
    try {
        act(() => { ReactDOM.render(<HelmetProvider><GigMap giglist={[{ listings: [gig, { ...gig, id: 2, artist: "Second Act" }] }]} /></HelmetProvider>, container); });
        expect(mockMapProps.options.backgroundColor).toBe("#171b22");
        expect(mockMapProps.options.styles).toEqual(expect.arrayContaining([expect.objectContaining({ elementType: "geometry", stylers: [{ color: "#171b22" }] })]));
        expect(mockClusterProps.zoomOnClick).toBe(true);
        expect(container.querySelectorAll("[data-marker=true]")).toHaveLength(1);
        act(() => Simulate.click(container.querySelector("[data-marker=true]")));
        expect(container.querySelector("[data-popup]").textContent).toContain("First Act");
        expect(container.querySelector("[data-popup]").textContent).toContain("Second Act");
        act(() => Simulate.click(container.querySelector('[aria-label="Next day"]')));
        expect(container.querySelector("[data-popup]")).toBeNull();
        expect(container.querySelectorAll("[data-marker=true]")).toHaveLength(0);
    } finally {
        act(() => { ReactDOM.unmountComponentAtNode(container); });
        container.remove();
        window.google = oldGoogle;
    }
});
