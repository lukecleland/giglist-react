import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { HelmetProvider } from "react-helmet-async";
import { QrPoster } from "./QrPoster";
import axios from "axios";
jest.mock("axios", () => ({ get: jest.fn() }));

let container;
let context;
let originalImage;
let originalFonts;
beforeEach(() => {
    axios.get.mockResolvedValue({ data: [{ listings: [{ artist: "Clayton Bulger", name: "Windsor Hotel", address: "Main Street", suburb: "Perth" }] }] });
    container = document.createElement("div");
    document.body.appendChild(container);
    originalImage = window.Image;
    originalFonts = document.fonts;
    Object.defineProperty(document, "fonts", { configurable: true, value: { load: jest.fn().mockResolvedValue([{}]) } });
    window.Image = class {
        set src(value) { Promise.resolve().then(() => this.onload()); }
    };
    URL.createObjectURL = jest.fn(() => "blob:qr");
    URL.revokeObjectURL = jest.fn();
    context = { fillRect: jest.fn(), fillText: jest.fn(), drawImage: jest.fn() };
    jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
    jest.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,poster");
    jest.spyOn(window, "print").mockImplementation(() => {});
});
afterEach(() => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
    window.Image = originalImage;
    Object.defineProperty(document, "fonts", { configurable: true, value: originalFonts });
    jest.restoreAllMocks();
});

test("creates a branded PNG and enables print after the preview loads", async () => {
    await act(async () => {
        ReactDOM.render(<HelmetProvider><QrPoster targetUrl="https://giglist.com.au/claytonbulger" /></HelmetProvider>, container);
    });
    expect(document.fonts.load).toHaveBeenCalledWith('184px "carbontyperegular"');
    expect(context.fillText.mock.calls.map(([text]) => text)).toEqual([
        "Giglist", "Scan the QR Code to see", "upcoming gigs for", "Clayton Bulger",
    ]);
    const canvas = HTMLCanvasElement.prototype.toDataURL.mock.instances[0];
    expect([canvas.width, canvas.height]).toEqual([1600, 2000]);
    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), 240, 430, 1120, 1120);
    const download = container.querySelector("a[download]");
    expect(download.download).toBe("giglist-claytonbulger-qr.png");
    expect(download.href).toBe("data:image/png;base64,poster");
    expect(container.querySelector("a").href).toBe("https://giglist.com.au/claytonbulger");
    const print = container.querySelector("button");
    expect(print.disabled).toBe(true);
    act(() => Simulate.load(container.querySelector("img.qr-poster-image")));
    expect(print.disabled).toBe(false);
    act(() => Simulate.click(print));
    expect(window.print).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:qr");
});

test("font failures show a recoverable error instead of a misbranded PNG", async () => {
    document.fonts.load.mockRejectedValue(new Error("offline"));
    await act(async () => {
        ReactDOM.render(<HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" /></HelmetProvider>, container);
    });
    expect(container.querySelector("[role=alert]").textContent).toContain("reload");
    expect(container.querySelector("a[download]")).toBeNull();
    expect(container.querySelector("button").disabled).toBe(true);
});

test("inverting regenerates the PNG and QR with the opposite colours", async () => {
    const fills = [];
    const textStyles = [];
    context.fillRect.mockImplementation(() => fills.push(context.fillStyle));
    context.fillText.mockImplementation(() => textStyles.push([context.fillStyle, context.font]));
    await act(async () => {
        ReactDOM.render(<HelmetProvider><QrPoster targetUrl="https://giglist.com.au/claytonbulger" /></HelmetProvider>, container);
    });
    expect(fills).toEqual(["#fff"]);
    expect(textStyles).toEqual([
        ["#000", '184px "carbontyperegular"'],
        ["#000", '64px "carbontyperegular"'],
        ["#000", '64px "carbontyperegular"'],
        ["#000", '64px "carbontyperegular"'],
    ]);
    const invert = container.querySelector("button[aria-pressed]");
    const originalCells = Array.from(container.querySelectorAll("svg path"), (path) => path.getAttribute("fill"));
    await act(async () => { Simulate.click(invert); });
    expect(invert.getAttribute("aria-pressed")).toBe("true");
    expect(fills).toEqual(["#fff", "#000"]);
    expect(textStyles.slice(4).every(([colour]) => colour === "#fff")).toBe(true);
    const invertedCells = Array.from(container.querySelectorAll("svg path"), (path) => path.getAttribute("fill"));
    expect(invertedCells).toEqual(originalCells.map((colour) => colour === "#000" ? "#fff" : "#000"));
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledTimes(2);
    await act(async () => { Simulate.click(invert); });
    expect(invert.getAttribute("aria-pressed")).toBe("false");
    expect(fills).toEqual(["#fff", "#000", "#fff"]);
});

test("venue name appears on its own caption line", async () => {
    await act(async () => {
        ReactDOM.render(<HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" /></HelmetProvider>, container);
    });
    expect(context.fillText).toHaveBeenCalledWith("upcoming gigs at", 800, 1770, 1360);
    expect(context.fillText).toHaveBeenCalledWith("Windsor Hotel", 800, 1870, 1360);
    expect(container.querySelector(".qr-poster-image").alt).toContain("upcoming gigs at\nWindsor Hotel");
});

test("suburb QR caption uses in with the suburb on its own line", async () => {
    await act(async () => {
        ReactDOM.render(<HelmetProvider><QrPoster targetUrl="https://giglist.com.au/perth" /></HelmetProvider>, container);
    });
    expect(context.fillText).toHaveBeenCalledWith("upcoming gigs in", 800, 1770, 1360);
    expect(context.fillText).toHaveBeenCalledWith("Perth", 800, 1870, 1360);
    expect(container.querySelector(".qr-poster-image").alt).toContain("upcoming gigs in\nPerth");
});
