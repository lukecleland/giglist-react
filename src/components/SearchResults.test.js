import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
jest.mock("axios", () => ({ get: jest.fn() }));
import { act, Simulate } from "react-dom/test-utils";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { CustomContext, GiglistProvider } from "./GiglistProvider";
import { Menu } from "./Menu";
import { DateList } from "./DateList";

jest.mock("semantic-ui-react", () => ({
    Icon: ({ name, onClick }) => <span data-icon={name} onClick={onClick} />,
}));
jest.mock("antd", () => ({ Drawer: ({ open, children }) => open ? <div role="dialog">{children}</div> : null, DatePicker: () => null, Space: ({ children }) => <div>{children}</div> }));
jest.mock("./ListingModal", () => ({ ListingModal: ({ listing }) => <div>{listing.artist}</div> }));
jest.mock("./GigAds", () => ({ GigAds: () => <div data-ad="true" /> }));

const feed = [1, 2, 3].map((id) => ({
    datestring: `Day ${id}`, datetime: `2026-10-0${id}`,
    listings: [{ id, artist: "Clayton Bulger", name: "Windsor Hotel", address: "123 Test Street", suburb: "Perth", date: "2026-10-01" }],
}));

function Seed() {
    const navigate = useNavigate();
    const { setGiglistFull, setNationalGiglist, setGigAds } = React.useContext(CustomContext);
    React.useEffect(() => {
        setGiglistFull([...feed, { datestring: "Empty day", datetime: "2026-10-04", listings: [] }]);
        setNationalGiglist(feed);
        setGigAds([{}, {}]);
    }, [setGiglistFull, setNationalGiglist, setGigAds]);
    return <button data-reset onClick={() => navigate("/")}>Reset route</button>;
}

let container;
beforeEach(() => {
    axios.get.mockReset();
    axios.get.mockResolvedValue({ data: [] });
    window.localStorage.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
});
afterEach(() => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
});

function render(path) {
    act(() => { ReactDOM.render(
        <MemoryRouter initialEntries={[path]}><GiglistProvider>
            <Seed /><Menu /><DateList />
        </GiglistProvider></MemoryRouter>, container,
    ); });
}

test("URL search filters after feed loading without opening either search window", () => {
    render("/claytonbulger");
    expect(container.querySelectorAll("input[name=searchq]")).toHaveLength(0);
    expect(container.querySelector("[aria-expanded]").getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector("input[type=search]").value).toBe("Clayton Bulger");
    expect(container.querySelectorAll("[data-ad]")).toHaveLength(1);
    const days = container.querySelectorAll(".day");
    expect(days[days.length - 1].lastElementChild).toBe(container.querySelector("[data-ad]"));
    const searchLink = Array.from(container.querySelectorAll("a")).find((link) => link.textContent === "Search");
    act(() => Simulate.click(searchLink));
    expect(container.querySelector("input[name=searchq]").value).toBe("Clayton Bulger");
});

test("normal search limits ads and clearing restores normal rotation", () => {
    render("/");
    expect(container.querySelectorAll("[data-ad]")).toHaveLength(3);
    const searchLink = Array.from(container.querySelectorAll("a")).find((link) => link.textContent === "Search");
    act(() => Simulate.click(searchLink));
    const input = container.querySelector("input[name=searchq]");
    act(() => Simulate.change(input, { target: { value: "Clayton" } }));
    expect(container.querySelectorAll("[data-ad]")).toHaveLength(1);
    const days = container.querySelectorAll(".day");
    expect(days[days.length - 1].lastElementChild).toBe(container.querySelector("[data-ad]"));
    act(() => Simulate.change(input, { target: { value: "" } }));
    expect(container.querySelectorAll("[data-ad]")).toHaveLength(3);
});

test("the dedicated Search page opens search with crawlable Search and Store links", () => {
    render("/search");
    expect(container.querySelector("input[name=searchq]").value).toBe("");
    expect(container.querySelector("input[type=search]").value).toBe("");
    expect(container.querySelector("[aria-expanded]").getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelectorAll("a[href='/search']")).toHaveLength(1);
    expect(container.querySelectorAll("a[href='/store']")).toHaveLength(1);
    expect(container.querySelectorAll("[data-ad]")).toHaveLength(3);
});

 test("mobile search filters gigs and date links retain the chosen date", () => {
    render("/search?date=2026-10-02");
    expect(container.querySelectorAll(".day")).toHaveLength(1);
    expect(container.querySelector(".date").textContent).toBe("Day 2");
    const input = container.querySelector("input[type=search]");
    act(() => Simulate.change(input, { target: { value: "missing artist" } }));
    expect(container.querySelectorAll(".day")).toHaveLength(0);
    act(() => Simulate.change(input, { target: { value: "Clayton" } }));
    expect(container.querySelectorAll(".day")).toHaveLength(3);
});


test("a date outside the upcoming feed loads archived gigs and leaving restores upcoming gigs", async () => {
    axios.get.mockResolvedValue({ data: [{ ...feed[0], datetime: "2020-01-01", datestring: "Archived day" }] });
    await act(async () => { render("/search?date=2020-01-01"); });
    expect(axios.get).toHaveBeenCalledWith("https://giglist.com.au/feed_national.php", expect.objectContaining({ params: { date: "2020-01-01" } }));
    expect(container.querySelector(".date").textContent).toBe("Archived day");
    const allGigs = container.querySelector("[data-reset]");
    act(() => Simulate.click(allGigs, { button: 0 }));
    expect(container.querySelectorAll(".day")).toHaveLength(3);
});

test("archive failures display an error instead of claiming no gigs", async () => {
    axios.get.mockRejectedValue(new Error("Offline"));
    await act(async () => { render("/search?date=2020-01-01"); });
    expect(container.querySelector('[role="status"]').textContent).toContain("Could not load gigs");
});
