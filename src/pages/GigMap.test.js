import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { HelmetProvider } from "react-helmet-async";
import moment from "moment";
import GigMap from "./GigMap";

let mockMapProps;
let mockClusterProps;
let mockIsLoaded = true;
const mockClusterer = {};
afterEach(() => window.localStorage.removeItem("location"));
jest.mock("@react-google-maps/api", () => ({
    useJsApiLoader: () => ({ isLoaded: mockIsLoaded }),
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
        const directions = container.querySelector(".gigmap-directions");
        const directionsUrl = new URL(directions.href);
        expect(directionsUrl.origin).toBe("https://www.google.com");
        expect(directionsUrl.pathname).toBe("/maps/dir/");
        expect(directionsUrl.searchParams.get("api")).toBe("1");
        expect(directionsUrl.searchParams.get("destination")).toBe("-31.95,115.86");
        expect(directionsUrl.searchParams.has("origin")).toBe(false);
        expect(directions.target).toBe("_blank");
        act(() => Simulate.click(container.querySelector('[aria-label="Next day"]')));
        expect(container.querySelector("[data-popup]")).toBeNull();
        expect(container.querySelectorAll("[data-marker=true]")).toHaveLength(0);
    } finally {
        act(() => { ReactDOM.unmountComponentAtNode(container); });
        container.remove();
        window.google = oldGoogle;
    }
});

test("keeps the same map container while the Google Maps script loads", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    mockIsLoaded = false;
    try {
        act(() => { ReactDOM.render(<HelmetProvider><GigMap giglist={[]} /></HelmetProvider>, container); });
        const canvas = container.querySelector(".gigmap-canvas");
        expect(canvas.getAttribute("aria-busy")).toBe("true");
        expect(canvas.querySelector('[role="status"]').textContent).toBe("Loading map…");
        mockIsLoaded = true;
        act(() => { ReactDOM.render(<HelmetProvider><GigMap giglist={[]} /></HelmetProvider>, container); });
        expect(container.querySelector(".gigmap-canvas")).toBe(canvas);
        expect(canvas.getAttribute("aria-busy")).toBe("false");
        expect(canvas.querySelector('[role="status"]')).toBeNull();
        expect(mockMapProps.mapContainerStyle).toEqual({ width: "100%", height: "100%" });
    } finally {
        mockIsLoaded = true;
        act(() => { ReactDOM.unmountComponentAtNode(container); });
        container.remove();
    }
});

test.each(["0000", "0", 0])("national postcode %s fits all of Australia regardless of saved coordinates", (postcode) => {
    window.localStorage.setItem("location", JSON.stringify({ postcode, lat: -35.2777, long: 149.119 }));
    const container = document.createElement("div");
    try {
        act(() => { ReactDOM.render(<HelmetProvider><GigMap giglist={[]} /></HelmetProvider>, container); });
        const map = { fitBounds: jest.fn() };
        mockMapProps.onLoad(map);
        expect(map.fitBounds).toHaveBeenCalledWith({ north: -10, south: -44, west: 112, east: 154 }, 24);
        expect(mockMapProps.zoom).toBe(4);
    } finally { act(() => { ReactDOM.unmountComponentAtNode(container); }); }
});

test("local postcode keeps a neighbourhood view", () => {
    window.localStorage.setItem("location", JSON.stringify({ postcode: "6000", lat: -31.95, long: 115.86 }));
    const container = document.createElement("div");
    try {
        act(() => { ReactDOM.render(<HelmetProvider><GigMap giglist={[]} /></HelmetProvider>, container); });
        const map = { fitBounds: jest.fn() };
        mockMapProps.onLoad(map);
        expect(map.fitBounds).not.toHaveBeenCalled();
        expect(mockMapProps.center).toEqual({ lat: -31.95, lng: 115.86 });
        expect(mockMapProps.zoom).toBe(13);
    } finally { act(() => { ReactDOM.unmountComponentAtNode(container); }); }
});
