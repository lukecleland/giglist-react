import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import axios from "axios";
import { Data } from "./Data";
import { CustomContext } from "./GiglistProvider";

jest.mock("axios", () => ({ get: jest.fn() }));
jest.mock("../utils/fetchGigAds", () => ({ fetchGigAds: () => Promise.resolve([]) }));

test("retains the national feed while restricting ordinary listings to the saved location", async () => {
    const common = { artist: "Clayton Bulger", name: "Venue", address: "Main Street", suburb: "Suburb" };
    const perth = { ...common, lat: "-31.95", lng: "115.86" };
    const sydney = { ...common, lat: "-33.86", lng: "151.21" };
    const feed = [{ listings: [perth, sydney] }];
    axios.get.mockImplementation((url) => Promise.resolve({ data: url.includes("feed_national") ? feed : { count: 0 } }));
    window.localStorage.setItem("location", JSON.stringify({ postcode: "2000", lat: "-33.86", long: "151.21" }));
    const setters = {
        setGiglist: jest.fn(), setGiglistFull: jest.fn(), setNationalGiglist: jest.fn(),
        setGigAds: jest.fn(), setAllTimeCount: jest.fn(),
    };
    const container = document.createElement("div");
    try {
        await act(async () => { ReactDOM.render(<CustomContext.Provider value={setters}><Data /></CustomContext.Provider>, container); });
        expect(setters.setNationalGiglist.mock.calls[0][0][0].listings).toEqual([perth, sydney]);
        expect(setters.setGiglistFull.mock.calls[0][0][0].listings).toEqual([sydney]);
        expect(setters.setGiglist.mock.calls[0][0][0].listings).toEqual([sydney]);
        expect(feed[0].listings).toHaveLength(2);
    } finally {
        act(() => { ReactDOM.unmountComponentAtNode(container); });
        window.localStorage.removeItem("location");
    }
});
