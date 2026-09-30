import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CustomContext } from "../components/GiglistProvider";
import { Main } from "./Main";

jest.mock("../components/ListingModal", () => ({ ListingModal: ({ children, listing }) => <div data-gig={listing.id}>{children}</div> }));
jest.mock("../components/GigAds", () => ({ GigAds: () => <div data-ad /> }));
jest.mock("../components/DateList", () => ({ DateList: () => <div data-normal-list /> }));

const gig = { id: 1, artist: "Clayton Bulger", name: "Windsor Hotel", address: "112 Mill Point Road", suburb: "South Perth", state: "WA", zip: "6151", date: "2026-10-02", start: "8pm" };
const dates = [{ listings: [gig, { ...gig, id: 2, date: "2026-10-01", name: "Other Venue" }] }];
let container;
beforeEach(() => { container = document.createElement("div"); document.body.appendChild(container); });
afterEach(() => { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); });
const render = (path, gigs = dates, localGigs = gigs, feedStatus = "ready") => act(() => {
    ReactDOM.render(<MemoryRouter initialEntries={[path]}><HelmetProvider>
        <CustomContext.Provider value={{ feedStatus, nationalGiglist: gigs, giglist: localGigs, giglistFull: localGigs, gigAds: [{}] }}><Main /></CustomContext.Provider>
    </HelmetProvider></MemoryRouter>, container);
});

test("URL tour lists national gigs even when the local postcode has no matches", () => {
    render("/claytonbulger", dates, []);
    expect(container.querySelector("h1").textContent).toBe("Clayton Bulger");
    expect(container.querySelectorAll("[data-gig]")).toHaveLength(2);
});

test("artist URL gets a tour heading and chronological venues without ads", () => {
    render("/claytonbulger");
    expect(container.querySelector("h1").textContent).toBe("Clayton Bulger");
    expect(container.querySelector("h2").textContent).toBe("Upcoming Gigs");
    expect(container.querySelector(".tour-address")).toBeNull();
    expect(Array.from(container.querySelectorAll(".tour-gig h3"), (el) => el.textContent)).toEqual(["Other Venue", "Windsor Hotel"]);
    expect(Array.from(container.querySelectorAll("[data-gig]"), (el) => el.dataset.gig)).toEqual(["2", "1"]);
    expect(container.querySelectorAll("[data-ad]")).toHaveLength(0);
});

test("venue URL shows the address and performing artists", () => {
    render("/windsorhotel");
    expect(container.querySelector("h1").textContent).toBe("Windsor Hotel");
    expect(container.querySelector(".tour-address").textContent).toBe("112 Mill Point Road, South Perth WA 6151");
    expect(container.querySelector(".tour-gig h3").textContent).toBe("Clayton Bulger");
    expect(container.querySelectorAll("[data-gig]")).toHaveLength(1);
});

test("no matching gigs shows an empty state without an ad", () => {
    render("/claytonbulger", []);
    expect(container.querySelector(".tour-empty")).not.toBeNull();
    expect(container.querySelector("[data-ad]")).toBeNull();
});

test.each(["/", "/search"])("normal listing keeps its layout at %s", (path) => {
    render(path);
    expect(container.querySelector("[data-normal-list]")).not.toBeNull();
    expect(container.querySelector(".tour-page")).toBeNull();
});


test("URL search hides unresolved title and results until the feed is ready", () => {
    render("/claytonbulger", [], [], "loading");
    expect(container.querySelector('[role="status"]').textContent).toContain("Loading upcoming gigs");
    expect(container.querySelector("h1")).toBeNull();
    expect(container.querySelector(".tour-empty")).toBeNull();
    expect(container.querySelector("[data-normal-list]")).toBeNull();
    render("/claytonbulger");
    expect(container.querySelector('[role="status"]')).toBeNull();
    expect(container.querySelector("h1").textContent).toBe("Clayton Bulger");
});

test("failed feed shows an error instead of an endless spinner", () => {
    render("/claytonbulger", [], [], "error");
    expect(container.querySelector('[role="alert"]').textContent).toContain("refresh");
    expect(container.querySelector('[role="status"]')).toBeNull();
});
