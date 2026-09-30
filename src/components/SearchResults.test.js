import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { CustomContext, GiglistProvider } from "./GiglistProvider";
import { Menu } from "./Menu";
import { DateList } from "./DateList";

jest.mock("semantic-ui-react", () => ({
    Icon: ({ name, onClick }) => <button data-icon={name} onClick={onClick} />,
}));
jest.mock("antd", () => ({ DatePicker: () => null, Space: ({ children }) => <div>{children}</div> }));
jest.mock("./ListingModal", () => ({ ListingModal: ({ listing }) => <div>{listing.artist}</div> }));
jest.mock("./GigAds", () => ({ GigAds: () => <div data-ad="true" /> }));

const feed = [1, 2, 3].map((id) => ({
    datestring: `Day ${id}`, datetime: `2026-10-0${id}`,
    listings: [{ id, artist: "Clayton Bulger", name: "Windsor Hotel", suburb: "Perth", date: "2026-10-01" }],
}));

function Seed() {
    const { setGiglistFull, setGigAds } = React.useContext(CustomContext);
    React.useEffect(() => {
        setGiglistFull([...feed, { datestring: "Empty day", datetime: "2026-10-04", listings: [] }]);
        setGigAds([{}, {}]);
    }, [setGiglistFull, setGigAds]);
    return null;
}

let container;
beforeEach(() => {
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
    expect(container.querySelector(".mobile-links").style.display).toBe("none");
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
    expect(container.querySelector(".mobile-links").style.display).toBe("block");
    expect(container.querySelectorAll("a[href='/search']")).toHaveLength(2);
    expect(container.querySelectorAll("a[href='/store']")).toHaveLength(2);
    expect(container.querySelectorAll("[data-ad]")).toHaveLength(3);
});
