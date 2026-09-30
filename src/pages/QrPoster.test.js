import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { HelmetProvider } from "react-helmet-async";
import { QrPoster } from "./QrPoster";
import axios from "axios";
import { posterThemes } from "../utils/posterDesign";
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
        naturalWidth = 1200;
        naturalHeight = 800;
        set src(value) { Promise.resolve().then(() => this.onload()); }
    };
    URL.createObjectURL = jest.fn(() => "blob:qr");
    URL.revokeObjectURL = jest.fn();
    context = { createLinearGradient: () => ({addColorStop: jest.fn()}), fillRect: jest.fn(), fillText: jest.fn(), drawImage: jest.fn() };
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

test("poster provides researched themes and exports the selected layout", async () => {
    for (const method of ['strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({ width: value.length * 20 });
    await act(async () => {
        ReactDOM.render(<HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" poster /></HelmetProvider>, container);
    });
    const select = container.querySelector('select');
    expect(select.options).toHaveLength(posterThemes.length);
    expect(container.querySelector('button[aria-pressed]')).toBeNull();
    expect(container.querySelector('a[download]').download).toBe('giglist-windsorhotel-nocturne-poster.png');
    await act(async () => { Simulate.change(select, { target: { value: 'wildflower' } }); });
    expect(container.querySelector('a[download]').download).toBe('giglist-windsorhotel-wildflower-poster.png');
    expect(context.fillText.mock.calls.map(([text]) => text).join(' ')).toContain('Windsor');
    expect(container.querySelector('svg').innerHTML).toContain('#000');
});

test("March poster filters listings and includes month in export name", async () => {
    for (const method of ['strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({ width: value.length * 20 });
    axios.get.mockResolvedValue({data: [{listings: [
        {artist: 'March Band', name: 'Windsor Hotel', suburb: 'Perth', address: 'Main Street', date: '2027-03-15', start: '8pm'},
        {artist: 'April Band', name: 'Windsor Hotel', suburb: 'Perth', address: 'Main Street', date: '2027-04-15', start: '8pm'},
    ]}]});
    await act(async () => {
        ReactDOM.render(<HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" poster month={2} /></HelmetProvider>, container);
    });
    expect(container.querySelector('a[download]').download).toContain('-poster-mar.png');
    const text = context.fillText.mock.calls.map(([value]) => value);
    expect(text).toContain('LIVE MUSIC IN MARCH');
    expect(text).toContain('March Band');
    expect(text).not.toContain('April Band');
});


test("random theme updates the selector and export while preserving the target and month", async () => {
    for (const method of ['strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({width: value.length * 20});
    axios.get.mockResolvedValue({data: [{listings: [{artist: 'Band', name: 'Windsor Hotel', address: 'Main Street', suburb: 'Perth', date: '2027-03-01', start: '8pm'}]}]});
    jest.spyOn(Math, 'random').mockReturnValue(0);
    await act(async () => { ReactDOM.render(<HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" poster month={2} /></HelmetProvider>, container); });
    const old = container.querySelector('select').value;
    await act(async () => { Simulate.click(container.querySelector('.poster-random')); });
    const chosen = container.querySelector('select').value;
    expect(chosen).not.toBe(old);
    expect(container.querySelector('a[download]').download).toBe(`giglist-windsorhotel-${chosen}-poster-mar.png`);
    expect(container.querySelector('a').href).toBe('https://giglist.com.au/windsorhotel');
    expect(document.fonts.load).toHaveBeenCalledWith('700 40px "Poster Grotesk"');
});

test("artist posters shuffle imagery without changing their theme, listings or target", async () => {
    for (const method of ['strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({width: value.length * 20});
    await act(async () => { ReactDOM.render(<HelmetProvider><QrPoster targetUrl="https://giglist.com.au/claytonbulger" poster /></HelmetProvider>, container); });
    const originalTheme = container.querySelector('select').value;
    const calls = HTMLCanvasElement.prototype.toDataURL.mock.calls.length;
    await act(async () => { Simulate.click(container.querySelector('.poster-shuffle')); });
    expect(HTMLCanvasElement.prototype.toDataURL.mock.calls.length).toBe(calls + 1);
    expect(container.querySelector('select').value).toBe(originalTheme);
    expect(container.querySelector('a').href).toBe('https://giglist.com.au/claytonbulger');
    expect(container.querySelector('button[aria-pressed]')).toBeNull();
});

test('suburb location imagery loads by default and survives theme changes', async () => {
    for (const method of ['strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({width: value.length * 20});
    axios.get.mockResolvedValue({data: [{listings: [{artist: 'Band', name: 'Local Venue', address: 'Main Street', suburb: 'Brunswick', state: 'VIC', date: '2027-03-01', start: '8pm'}]}]});
    const oldFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({ok: true, json: async () => ({query: {pages: {1: {
        pageid: 1, title: 'File:Brunswick street.jpg', imageinfo: [{mime: 'image/jpeg', width: 2000, height: 1500,
            thumburl: 'https://upload.wikimedia.org/brunswick.jpg', extmetadata: {Artist: {value: 'Jane'}, LicenseShortName: {value: 'CC BY 4.0'}, LicenseUrl: {value: 'https://creativecommons.org/licenses/by/4.0/'}}}],
    }}}})});
    try {
        await act(async () => { ReactDOM.render(<HelmetProvider><QrPoster targetUrl="https://giglist.com.au/brunswick" poster /></HelmetProvider>, container); });
        expect(global.fetch).toHaveBeenCalledTimes(1);
        const button = container.querySelector('.poster-location');
        expect(button.textContent).toBe('Use theme artwork');
        expect(button.getAttribute('aria-pressed')).toBe('true');
        expect(context.fillText.mock.calls.some(([value]) => value.includes('Photo: Jane'))).toBe(true);
        await act(async () => { Simulate.change(container.querySelector('select'), {target: {value: 'solar'}}); });
        expect(button.getAttribute('aria-pressed')).toBe('true');
        expect(global.fetch).toHaveBeenCalledTimes(1);
        await act(async () => { Simulate.click(button); });
        expect(button.getAttribute('aria-pressed')).toBe('false');
        expect(container.querySelector('.poster-photo-credit')).toBeNull();
    } finally { global.fetch = oldFetch; }
});

test('font shuffle regenerates typography without changing theme or image mode', async () => {
    for (const method of ['strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({width: value.length * 20});
    jest.spyOn(Math, 'random').mockReturnValue(0);
    await act(async () => { ReactDOM.render(<HelmetProvider><QrPoster targetUrl="https://giglist.com.au/claytonbulger" poster /></HelmetProvider>, container); });
    const theme = container.querySelector('select').value;
    const count = HTMLCanvasElement.prototype.toDataURL.mock.calls.length;
    await act(async () => { Simulate.click(container.querySelector('.poster-font-shuffle')); });
    expect(container.querySelector('select').value).toBe(theme);
    expect(HTMLCanvasElement.prototype.toDataURL.mock.calls.length).toBe(count + 1);
    expect(document.fonts.load).toHaveBeenCalledWith('100px "Poster Serif"');
    expect(context.fillText.mock.calls.some(([text]) => text === 'Giglist')).toBe(true);
    expect(container.querySelector('a').href).toBe('https://giglist.com.au/claytonbulger');
});

test('venues with their own photo can shuffle imagery and restore the venue photo', async () => {
    for (const method of ['strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({width: value.length * 20});
    const loaded = [];
    window.Image = class {
        naturalWidth = 1200; naturalHeight = 800;
        set src(value) { loaded.push(value); Promise.resolve().then(() => this.onload()); }
    };
    const venuePhoto = 'https://giglist.com.au/venues/windsor.jpg';
    axios.get.mockResolvedValue({data: [{listings: [{artist: 'Band', name: 'Windsor Hotel', address: 'Main Street', suburb: 'Perth', date: '2027-03-01', start: '8pm', location_image_url: venuePhoto}]}]});
    await act(async () => { ReactDOM.render(<HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" poster /></HelmetProvider>, container); });
    expect(loaded).toContain(venuePhoto);
    expect(container.querySelector('.poster-venue-photo').textContent).toBe('Venue photo selected');
    expect(container.querySelector('.poster-venue-photo').getAttribute('aria-pressed')).toBe('true');
    loaded.length = 0;
    await act(async () => { Simulate.click(container.querySelector('.poster-shuffle')); });
    expect(loaded).not.toContain(venuePhoto);
    expect(loaded.some((url) => url !== 'blob:qr')).toBe(true);
    const restore = [...container.querySelectorAll('button')].find((button) => button.textContent === 'Use venue photo');
    await act(async () => { Simulate.click(restore); });
    expect(loaded).toContain(venuePhoto);
});
