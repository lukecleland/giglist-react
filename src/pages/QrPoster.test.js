import { MemoryRouter } from 'react-router-dom';
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
    jest.spyOn(Date, "now").mockReturnValue(new Date("2026-10-13T12:00:00Z").getTime());
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
    context = { measureText: value => ({width: value.length * Number(/([\d.]+)px/.exec(context.font)?.[1] || 30) * .5}), createLinearGradient: () => ({addColorStop: jest.fn()}), fillRect: jest.fn(), fillText: jest.fn(), drawImage: jest.fn() };
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
        ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/claytonbulger" /></HelmetProvider></MemoryRouter>, container);
    });
    expect(document.fonts.load).toHaveBeenCalledWith('184px "carbontyperegular"');
    expect(context.fillText.mock.calls.map(([text]) => text)).toEqual([
        "Clayton Bulger", "Scan the QR Code to see", "upcoming gigs on Giglist",
    ]);
    const canvas = HTMLCanvasElement.prototype.toDataURL.mock.instances[0];
    expect([canvas.width, canvas.height]).toEqual([1600, 2000]);
    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), 240, 430, 1120, 1120);
    const download = container.querySelector("a[download]");
    expect(download.download).toBe("giglist-claytonbulger-qr.png");
    expect(download.href).toBe("data:image/png;base64,poster");
    expect(container.querySelector(".qr-poster-controls a").href).toBe("https://giglist.com.au/claytonbulger");
    const print = container.querySelector(".poster-export-actions button");
    expect(print.disabled).toBe(false);
    act(() => Simulate.load(container.querySelector("img.qr-poster-image")));
    expect(print.disabled).toBe(false);
    act(() => Simulate.click(print));
    expect(window.print).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:qr");
    expect(container.querySelector('.poster-panel-heading h2').textContent).toBe('QR Code Settings');
    const toggle = container.querySelector('.poster-panel-toggle');
    act(() => Simulate.click(toggle));
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    await act(async () => Simulate.change(container.querySelector('select[aria-label="QR colours"]'), {target:{value:'light'}}));
    expect(container.querySelector('button[aria-pressed]').getAttribute('aria-pressed')).toBe('true');
});

test("font failures show a recoverable error instead of a misbranded PNG", async () => {
    document.fonts.load.mockRejectedValue(new Error("offline"));
    await act(async () => {
        ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" /></HelmetProvider></MemoryRouter>, container);
    });
    expect(container.querySelector("[role=alert]").textContent).toContain("reload");
    expect(container.querySelector("a[download]")).toBeNull();
    expect(container.querySelector(".poster-export-actions button").disabled).toBe(true);
});

test("inverting regenerates the PNG and QR with the opposite colours", async () => {
    const fills = [];
    const textStyles = [];
    context.fillRect.mockImplementation(() => fills.push(context.fillStyle));
    context.fillText.mockImplementation(() => textStyles.push([context.fillStyle, context.font]));
    await act(async () => {
        ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/claytonbulger" /></HelmetProvider></MemoryRouter>, container);
    });
    expect(fills).toEqual(["#fff"]);
    expect(textStyles).toEqual([
        ["#000", '184px "carbontyperegular"'],
        ["#000", '64px "carbontyperegular"'],
        ["#000", '64px "carbontyperegular"'],
    ]);
    const invert = container.querySelector("button[aria-pressed]");
    const originalCells = Array.from(container.querySelectorAll(".qr-poster-page [hidden] svg path"), (path) => path.getAttribute("fill"));
    await act(async () => { Simulate.click(invert); });
    expect(invert.getAttribute("aria-pressed")).toBe("true");
    expect(fills).toEqual(["#fff", "#000"]);
    expect(textStyles.slice(3).every(([colour]) => colour === "#fff")).toBe(true);
    const invertedCells = Array.from(container.querySelectorAll(".qr-poster-page [hidden] svg path"), (path) => path.getAttribute("fill"));
    expect(invertedCells).toEqual(originalCells.map((colour) => colour === "#000" ? "#fff" : "#000"));
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledTimes(2);
    await act(async () => { Simulate.click(invert); });
    expect(invert.getAttribute("aria-pressed")).toBe("false");
    expect(fills).toEqual(["#fff", "#000", "#fff"]);
});

test("venue name is the header above the QR code", async () => {
    await act(async () => {
        ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" /></HelmetProvider></MemoryRouter>, container);
    });
    expect(context.fillText).toHaveBeenCalledWith("upcoming gigs on Giglist", 800, 1830, 1360);
    expect(context.fillText).toHaveBeenCalledWith("Windsor Hotel", 800, 275, 1360);
    expect(container.querySelector(".qr-poster-image").alt).toContain("Windsor Hotel. QR code");
});

test("suburb name is the header above the QR code", async () => {
    await act(async () => {
        ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/perth" /></HelmetProvider></MemoryRouter>, container);
    });
    expect(context.fillText).toHaveBeenCalledWith("upcoming gigs on Giglist", 800, 1830, 1360);
    expect(context.fillText).toHaveBeenCalledWith("Perth", 800, 275, 1360);
    expect(container.querySelector(".qr-poster-image").alt).toContain("Perth. QR code");
});

test("poster provides researched themes and exports the selected layout", async () => {
    for (const method of ['strokeText', 'strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'scale','translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({ width: value.length * 20 });
    await act(async () => {
        ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" poster /></HelmetProvider></MemoryRouter>, container);
    });
    const select = container.querySelector('select');
    expect(select.options).toHaveLength(posterThemes.length);
    expect(container.querySelector('.poster-invert-fonts').getAttribute('aria-pressed')).toBe('false');
    expect(container.querySelector('a[download]').download).toBe('giglist-windsorhotel-nocturne-poster.png');
    await act(async () => { Simulate.change(select, { target: { value: 'wildflower' } }); });
    expect(container.querySelector('a[download]').download).toBe('giglist-windsorhotel-wildflower-poster.png');
    expect(context.fillText.mock.calls.map(([text]) => text).join(' ')).toContain('Windsor');
    expect(container.querySelector('[hidden] svg').innerHTML).toContain('#000');
});

test("March poster filters listings and includes month in export name", async () => {
    for (const method of ['strokeText', 'strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'scale','translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({ width: value.length * 20 });
    axios.get.mockResolvedValue({data: [{listings: [
        {artist: 'March Band', name: 'Windsor Hotel', suburb: 'Perth', address: 'Main Street', date: '2027-03-15', start: '8pm'},
        {artist: 'April Band', name: 'Windsor Hotel', suburb: 'Perth', address: 'Main Street', date: '2027-04-15', start: '8pm'},
    ]}]});
    await act(async () => {
        ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" poster month={2} /></HelmetProvider></MemoryRouter>, container);
    });
    expect(container.querySelector('a[download]').download).toContain('-poster-mar-2027.png');
    const text = context.fillText.mock.calls.map(([value]) => value);
    expect(text).toContain('LIVE MUSIC IN MARCH 2027');
    expect(text).toContain('March Band');
    expect(text).not.toContain('April Band');
});


test("random theme updates the selector and export while preserving the target and month", async () => {
    for (const method of ['strokeText', 'strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'scale','translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({width: value.length * 20});
    axios.get.mockResolvedValue({data: [{listings: [{artist: 'Band', name: 'Windsor Hotel', address: 'Main Street', suburb: 'Perth', date: '2027-03-01', start: '8pm'}]}]});
    jest.spyOn(Math, 'random').mockReturnValue(0);
    await act(async () => { ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" poster month={2} /></HelmetProvider></MemoryRouter>, container); });
    const old = container.querySelector('select').value;
    await act(async () => { Simulate.click(container.querySelector('.poster-random')); });
    const chosen = container.querySelector('select').value;
    expect(chosen).not.toBe(old);
    expect(container.querySelector('a[download]').download).toBe(`giglist-windsorhotel-${chosen}-poster-mar-2027.png`);
    expect(container.querySelector('.qr-poster-controls a').href).toBe('https://giglist.com.au/windsorhotel');
    expect(document.fonts.load).toHaveBeenCalledWith('700 40px "Poster Grotesk"');
});

test("artist posters shuffle imagery without changing their theme, listings or target", async () => {
    for (const method of ['strokeText', 'strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'scale','translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({width: value.length * 20});
    await act(async () => { ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/claytonbulger" poster /></HelmetProvider></MemoryRouter>, container); });
    const originalTheme = container.querySelector('select').value;
    const calls = HTMLCanvasElement.prototype.toDataURL.mock.calls.length;
    await act(async () => { Simulate.click(container.querySelector('.poster-shuffle')); });
    expect(HTMLCanvasElement.prototype.toDataURL.mock.calls.length).toBe(calls + 1);
    expect(container.querySelector('select').value).toBe(originalTheme);
    expect(container.querySelector('.qr-poster-controls a').href).toBe('https://giglist.com.au/claytonbulger');
    expect(container.querySelector('.poster-invert-fonts').getAttribute('aria-pressed')).toBe('false');
});

test('suburb location imagery loads by default and survives theme changes', async () => {
    for (const method of ['strokeText', 'strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'scale','translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({width: value.length * 20});
    axios.get.mockResolvedValue({data: [{listings: [{artist: 'Band', name: 'Local Venue', address: 'Main Street', suburb: 'Brunswick', state: 'VIC', date: '2027-03-01', start: '8pm'}]}]});
    const oldFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({ok: true, json: async () => ({query: {pages: {1: {
        pageid: 1, title: 'File:Brunswick street.jpg', imageinfo: [{mime: 'image/jpeg', width: 2000, height: 1500,
            thumburl: 'https://upload.wikimedia.org/brunswick.jpg', extmetadata: {Artist: {value: 'Jane'}, LicenseShortName: {value: 'CC BY 4.0'}, LicenseUrl: {value: 'https://creativecommons.org/licenses/by/4.0/'}}}],
    }}}})});
    try {
        await act(async () => { ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/brunswick" poster /></HelmetProvider></MemoryRouter>, container); });
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(container.querySelector('.poster-location')).toBeNull();
        expect(context.fillText.mock.calls.some(([value]) => value.includes('Photo: Jane'))).toBe(true);
        await act(async () => { Simulate.change(container.querySelector('select'), {target: {value: 'solar'}}); });
        expect(container.querySelector('.poster-location')).toBeNull();
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(container.querySelector('.poster-photo-credit')).toBeNull();
    } finally { global.fetch = oldFetch; }
});

test('font shuffle regenerates typography without changing theme or image mode', async () => {
    for (const method of ['strokeText', 'strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'scale','translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({width: value.length * 20});
    jest.spyOn(Math, 'random').mockReturnValue(0);
    await act(async () => { ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/claytonbulger" poster /></HelmetProvider></MemoryRouter>, container); });
    const theme = container.querySelector('select').value;
    const count = HTMLCanvasElement.prototype.toDataURL.mock.calls.length;
    await act(async () => { Simulate.click(container.querySelector('.poster-font-shuffle')); });
    expect(container.querySelector('select').value).toBe(theme);
    expect(HTMLCanvasElement.prototype.toDataURL.mock.calls.length).toBe(count + 1);
    expect(document.fonts.load).toHaveBeenCalledWith('700 100px "Poster Condensed"');
    expect(context.fillText.mock.calls.some(([text]) => text === 'Giglist')).toBe(true);
    expect(container.querySelector('.qr-poster-controls a').href).toBe('https://giglist.com.au/claytonbulger');
});

test('venues with their own photo can shuffle imagery and restore the venue photo', async () => {
    for (const method of ['strokeText', 'strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'scale','translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({width: value.length * 20});
    const loaded = [];
    window.Image = class {
        naturalWidth = 1200; naturalHeight = 800;
        set src(value) { this.source=value; loaded.push(value); Promise.resolve().then(() => this.onload()); }
    };
    const venuePhoto = 'https://giglist.com.au/venues/windsor.jpg';
    axios.get.mockResolvedValue({data: [{listings: [{artist: 'Band', name: 'Windsor Hotel', address: 'Main Street', suburb: 'Perth', date: '2027-03-01', start: '8pm', location_image_url: venuePhoto}]}]});
    await act(async () => { ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" poster /></HelmetProvider></MemoryRouter>, container); });
    expect(loaded).toContain(venuePhoto);
    expect(container.querySelector('.poster-venue-photo').textContent.trim()).toBe('Use Venue Photo');
    expect(container.querySelector('.poster-venue-photo input').checked).toBe(true);
    loaded.length = 0;
    await act(async () => { Simulate.click(container.querySelector('.poster-shuffle')); });
    expect(loaded).not.toContain(venuePhoto);
    expect(loaded.some((url) => url !== 'blob:qr')).toBe(true);
    const restore = container.querySelector('.poster-venue-photo input');
    expect(restore.checked).toBe(false);
    await act(async () => { Simulate.change(restore,{target:{checked:true}}); });
    expect(loaded).toContain(venuePhoto);
    expect(context.drawImage.mock.calls.some(([image])=>image.source===venuePhoto)).toBe(true);
    expect(container.querySelector('[aria-label="Background"]').value).toBe('venue');
    loaded.length=0;
    await act(async()=>{Simulate.change(restore,{target:{checked:false}});});
    expect(loaded).not.toContain(venuePhoto);
    expect(container.querySelector('[aria-label="Background"]').value).not.toBe('venue');
});

test('shuffle all styles changes theme and fonts while preserving background and gig target', async () => {
    axios.get.mockResolvedValue({data: [{listings: [{artist: 'Clayton Bulger', name: 'Windsor Hotel', suburb: 'Perth', address: 'Main Street', date: '2027-03-01', start: '8pm'}]}]});
    for (const method of ['strokeText', 'strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'scale','translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = (value) => ({width: value.length * 20});
    jest.spyOn(Math, 'random').mockReturnValue(0);
    await act(async () => { ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/claytonbulger" poster month={2} /></HelmetProvider></MemoryRouter>, container); });
    const theme = container.querySelector('select').value;
    const background = container.querySelector('[aria-label="Background"]').value;
    const exports = HTMLCanvasElement.prototype.toDataURL.mock.calls.length;
    expect(container.querySelector('.poster-random').textContent).toContain('Shuffle Theme');
    await act(async () => { Simulate.click(container.querySelector('.poster-shuffle-everything')); });
    expect(container.querySelector('select').value).not.toBe(theme);
    expect(container.querySelector('[aria-label="Background"]').value).toBe(background);
    expect(HTMLCanvasElement.prototype.toDataURL.mock.calls.length).toBeGreaterThan(exports);
    expect(document.fonts.load).toHaveBeenCalledWith('100px "Poster Grotesk"');
    expect(container.querySelector('.qr-poster-controls a').href).toBe('https://giglist.com.au/claytonbulger');
    expect(container.querySelector('a[download]').download).toContain('-poster-mar-2027.png');
});


test('keeps the poster visible and shows a configuration panel spinner until a shuffle completes', async () => {
    for (const method of ['strokeText', 'strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'scale','translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = value => ({width: value.length * 20});
    await act(async () => { ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/claytonbulger" poster /></HelmetProvider></MemoryRouter>, container); });
    const preview = container.querySelector('.qr-poster-image');
    const previous = preview.src;
    let finish;
    document.fonts.load.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
    await act(async () => { Simulate.click(container.querySelector('.poster-header-shuffle')); });
    const button = container.querySelector('.poster-header-shuffle');
    expect(container.querySelector('.qr-poster-image')).toBe(preview);
    expect(preview.src).toBe(previous);
    expect(container.querySelector('.poster-panel-loading .poster-button-spinner')).not.toBeNull();
    expect(button.textContent).toBe('Shuffle Header');
    expect(button.getAttribute('aria-label')).toBe('Shuffle Header');
    expect(button.disabled).toBe(true);
    await act(async () => { finish([{}]); });
    expect(container.querySelector('.poster-panel-loading .poster-button-spinner')).toBeNull();
    expect(button.textContent).toBe('Shuffle Header');
    expect(button.disabled).toBe(false);
});

test('list style dropdown selects Festival layout while keeping theme and target', async () => {
    for (const method of ['strokeText', 'strokeRect', 'beginPath', 'arc', 'fill', 'stroke', 'moveTo', 'lineTo', 'save', 'restore', 'scale','translate', 'rotate', 'ellipse', 'closePath']) context[method] = jest.fn();
    context.measureText = value => ({width: value.length * Number(/([\d.]+)px/.exec(context.font)?.[1] || 30) * .5});
    axios.get.mockResolvedValue({data:[{listings:[{artist:'Band',name:'Windsor Hotel',address:'Main Street',suburb:'Perth',date:'2026-10-02',start:'7PM'}]}]});
    await act(async () => { ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" poster /></HelmetProvider></MemoryRouter>, container); });
    const theme = container.querySelector('select').value;
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const button = container.querySelector('select[aria-label="List Style"]');
    expect(container.querySelector('.poster-weekend-toggle input').checked).toBe(false);
    expect(button.value).toBe('columns');
    const count = HTMLCanvasElement.prototype.toDataURL.mock.calls.length;
    await act(async () => { Simulate.change(button, {target:{value:'festivalDays'}}); });
    expect(button.value).toBe('festivalDays');
    expect(HTMLCanvasElement.prototype.toDataURL.mock.calls.length).toBe(count + 1);
    expect(container.querySelector('select').value).toBe(theme);
    expect(container.querySelector('.qr-poster-controls a').href).toBe('https://giglist.com.au/windsorhotel');
    expect(context.fillText.mock.calls.some(([text]) => text === 'BAND')).toBe(true);
});

test('weekend mode overrides month filtering and restores the month when unchecked', async () => {
    const {upcomingWeekend} = require('../utils/posterWeekend');
    const range = upcomingWeekend();
    for (const method of ['strokeText','strokeRect','beginPath','arc','fill','stroke','moveTo','lineTo','save','restore','scale','translate','rotate','ellipse','closePath']) context[method] = jest.fn();
    context.measureText = value => ({width:value.length * Number(/([\d.]+)px/.exec(context.font)?.[1] || 30) * .5});
    const weekendMonth = Number(range.start.slice(5,7))-1;
    const otherMonth = (weekendMonth+6)%12;
    const otherDate = `${otherMonth < 9 ? 2027 : 2026}-${String(otherMonth+1).padStart(2,'0')}-15`;
    axios.get.mockResolvedValue({data:[{listings:[['Friday Act',range.start],['Sunday Act',range.end],['Other Month Act',otherDate]].map(([artist,date])=>({artist,date,name:'Local Venue',suburb:'Perth',address:'Main Street',start:'7PM'}))}]});
    await act(async () => { ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/localvenue" poster month={otherMonth} /></HelmetProvider></MemoryRouter>,container); });
    const checkbox = container.querySelector('.poster-weekend-toggle input');
    expect(container.querySelector('.poster-date-range').nextElementSibling.contains(checkbox)).toBe(true);
    context.fillText.mockClear();
    await act(async () => { Simulate.change(checkbox,{target:{checked:true}}); });
    expect(container.querySelector('[aria-label="Poster start date"]').value).toBe(range.start);
    expect(container.querySelector('[aria-label="Poster end date"]').value).toBe(range.end);
    const text = context.fillText.mock.calls.map(([t])=>t).join(' ');
    expect(text).toContain('FRIDAY ACT'); expect(text).toContain('SUNDAY ACT');
    expect(text).not.toContain('Other Month Act'); expect(text).not.toContain('7PM');
    expect(text).toContain('LIVE MUSIC THIS WEEKEND');
    expect(container.querySelector('select[aria-label="List Style"]').disabled).toBe(true);
    context.fillText.mockClear();
    await act(async () => { Simulate.change(checkbox,{target:{checked:false}}); });
    expect(context.fillText.mock.calls.map(([t])=>t).join(' ')).toContain('Other Month Act');
});

test('fonts always match and header controls preserve the selected font', async () => {
    for (const method of ['rect','clip','strokeText','strokeRect','beginPath','arc','fill','stroke','moveTo','lineTo','save','restore','scale','translate','rotate','ellipse','closePath']) context[method] = jest.fn();
    context.measureText = value => ({width:value.length * Number(/([\d.]+)px/.exec(context.font)?.[1] || 30) * .5});
    const drawn = {};
    context.fillText.mockImplementation(text => { const key = text.toLowerCase().startsWith('clayton') ? 'clayton bulger' : text.toLowerCase(); drawn[key] = /"([^"]+)"/.exec(context.font)?.[1]; });
    jest.spyOn(Math,'random').mockReturnValue(0);
    await act(async () => { ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/claytonbulger" poster /></HelmetProvider></MemoryRouter>, container); });
    expect(container.querySelector('.poster-match-fonts')).toBeNull();
    expect(drawn['clayton bulger']).toBe(drawn['windsor hotel']);
    await act(async () => { Simulate.click(container.querySelector('.poster-font-shuffle')); });
    const matchedFont = drawn['clayton bulger'];
    expect(drawn['windsor hotel']).toBe(matchedFont);
    await act(async () => { Simulate.click(container.querySelector('.poster-header-shuffle')); });
    expect(drawn['clayton bulger']).toBe(matchedFont);
    await act(async () => { Simulate.change(container.querySelector('[aria-label="Header Artwork"]'),{target:{value:'western-centered'}}); });
    expect(drawn['clayton bulger']).toBe(matchedFont);
    expect(drawn['windsor hotel']).toBe(matchedFont);
    await act(async () => { Simulate.click(container.querySelector('[aria-label="Next header artwork"]')); });
    expect(drawn['clayton bulger']).toBe(matchedFont);
    await act(async () => { Simulate.change(container.querySelector('[aria-label="Poster Font"]'),{target:{value:'Rye'}}); });
    expect(drawn['clayton bulger']).toBe('Rye');
    expect(drawn['windsor hotel']).toBe('Rye');
});

test('separate custom banner and background uploads can be selected and removed', async () => {
    for (const method of ['strokeText','strokeRect','beginPath','rect','clip','arc','fill','stroke','moveTo','lineTo','save','restore','scale','translate','rotate','ellipse','closePath']) context[method]=jest.fn();
    context.measureText=value=>({width:value.length*20});
    const uploads=require('../utils/posterUpload');
    const image={naturalWidth:1600,naturalHeight:800};
    jest.spyOn(uploads,'readPosterUpload').mockImplementation(async file=>({name:file.name,image,palette:{background:'#223344',backdrop:'#223344dd',ink:'#ffffff',accent:'#cceeff'}}));
    await act(async()=>{ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/claytonbulger" poster /></HelmetProvider></MemoryRouter>,container);});
    for(const kind of ['banner','background']) {
        const input=container.querySelector(`input[aria-label="Upload ${kind[0].toUpperCase()+kind.slice(1)}"]`);
        await act(async()=>{Simulate.change(input,{target:{files:[new File(['image'],`${kind}.png`,{type:'image/png'})],value:''}});});
    }
    expect(container.querySelector('[aria-label="Header Artwork"]').value).toBe('custom');
    expect(container.querySelector('[aria-label="Background"]').value).toBe('custom');
    expect(context.drawImage.mock.calls.some(args=>args[0]===image)).toBe(true);
    expect(container.querySelector('a[download]')).not.toBeNull();
    await act(async()=>{Simulate.click(container.querySelector('[aria-label="Remove Custom Banner"]'));});
    expect(container.querySelector('[aria-label="Header Artwork"]').value).toBe('gradient');
    expect(container.querySelector('[aria-label="Background"]').value).toBe('custom');
    await act(async()=>{Simulate.click(container.querySelector('[aria-label="Remove Custom Background"]'));});
    expect(container.querySelector('[aria-label="Background"]').value).not.toBe('custom');
});

test('QR background upload keeps a solid quiet zone and can be removed', async () => {
    const uploads=require('../utils/posterUpload');
    const image={naturalWidth:1600,naturalHeight:800};
    jest.spyOn(uploads,'readPosterUpload').mockResolvedValue({name:'background.png',image,palette:{}});
    await act(async()=>{ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/claytonbulger" /></HelmetProvider></MemoryRouter>,container);});
    await act(async()=>{Simulate.change(container.querySelector('input[aria-label="Upload Background"]'),{target:{files:[new File(['image'],'background.png',{type:'image/png'})],value:''}});});
    expect(context.drawImage.mock.calls.some(args=>args[0]===image)).toBe(true);
    expect(context.fillRect).toHaveBeenCalledWith(288,478,1024,1024);
    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(),352,542,896,896);
    expect(container.querySelector('a[download]')).not.toBeNull();
    context.drawImage.mockClear();
    await act(async()=>Simulate.click(container.querySelector('[aria-label="Remove Custom Background"]')));
    expect(context.drawImage.mock.calls.some(args=>args[0]===image)).toBe(false);
    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(),240,430,1120,1120);
});

test('poster month and custom dates update the listings, subtitle and export', async()=>{
    for (const method of ['strokeText','strokeRect','beginPath','arc','fill','stroke','moveTo','lineTo','save','restore','scale','translate','rotate','ellipse','closePath']) context[method]=jest.fn();
    axios.get.mockResolvedValue({data:[{listings:[
        {artist:'First Show',name:'Windsor Hotel',address:'Main Street',suburb:'Perth',date:'2027-03-15',start:'8pm'},
        {artist:'Last Show',name:'Windsor Hotel',address:'Main Street',suburb:'Perth',date:'2027-03-17',start:'8pm'},
        {artist:'Later Show',name:'Windsor Hotel',address:'Main Street',suburb:'Perth',date:'2027-04-01',start:'8pm'},
    ]}]});
    await act(async()=>{ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" poster /></HelmetProvider></MemoryRouter>,container);});
    const monthOptions=Array.from(container.querySelector('[aria-label="Poster month"]').options).slice(1);
    expect(monthOptions).toHaveLength(12);
    expect(monthOptions.map(option=>option.value)).toEqual(['2026-10','2026-11','2026-12','2027-01','2027-02','2027-03','2027-04','2027-05','2027-06','2027-07','2027-08','2027-09']);
    expect(monthOptions[0].textContent).toBe('October 2026');
    expect(monthOptions[11].textContent).toBe('September 2027');
    await act(async()=>{Simulate.change(container.querySelector('[aria-label="Poster month"]'),{target:{value:'2027-04'}});});
    expect(container.querySelector('[aria-label="Poster start date"]').value).toBe('2027-04-01');
    expect(container.querySelector('[aria-label="Poster end date"]').value).toBe('2027-04-30');
    expect(container.querySelector('.poster-date-range button').textContent).toBe('Apply Date Range');
    expect(container.querySelector('.qr-poster-image').alt).toContain('LIVE MUSIC IN APRIL 2027. 1 listings');
    expect(container.querySelector('a[download]').download).toContain('-poster-apr-2027.png');
    await act(async()=>{
        Simulate.change(container.querySelector('[aria-label="Poster start date"]'),{target:{value:'2027-03-15'}});
        Simulate.change(container.querySelector('[aria-label="Poster end date"]'),{target:{value:'2027-03-17'}});
    });
    context.fillText.mockClear();
    await act(async()=>{Simulate.click(container.querySelector('.poster-date-range button'));});
    const text=context.fillText.mock.calls.map(([value])=>value).join(' ');
    expect(text).toContain('First Show');expect(text).toContain('Last Show');expect(text).not.toContain('Later Show');
    expect(container.querySelector('.qr-poster-image').alt).toContain('15 Mar 2027–17 Mar 2027');
    expect(container.querySelector('a[download]').download).toContain('-2027-03-15-to-2027-03-17.png');
    await act(async()=>{Simulate.change(container.querySelector('[aria-label="Poster end date"]'),{target:{value:'2027-03-14'}});});
    expect(container.querySelector('.poster-date-range button').disabled).toBe(true);
    expect(container.querySelector('.poster-date-range [role=alert]')).not.toBeNull();
    await act(async()=>{Simulate.change(container.querySelector('[aria-label="Poster month"]'),{target:{value:'all'}});});
    expect(container.querySelector('.qr-poster-image').alt).toContain('Upcoming gigs. 3 listings');
});

test('listing background and font inversion persist through style shuffling',async()=>{
    for(const method of ['strokeText','strokeRect','beginPath','arc','fill','stroke','moveTo','lineTo','save','restore','scale','translate','rotate','ellipse','closePath'])context[method]=jest.fn();
    axios.get.mockResolvedValue({data:[{listings:[{artist:'Band',name:'Windsor Hotel',address:'Main Street',suburb:'Perth',date:'2027-03-15',start:'8pm'}]}]});
    await act(async()=>{ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" poster /></HelmetProvider></MemoryRouter>,container);});
    const background=Array.from(container.querySelectorAll('label')).find(label=>label.textContent.trim()==='Listing Background').querySelector('input');
    const invert=container.querySelector('.poster-invert-fonts');
    expect(background.checked).toBe(true);
    expect(invert.previousElementSibling.querySelector('[aria-label="Poster Font"]')).not.toBeNull();
    const exports=HTMLCanvasElement.prototype.toDataURL.mock.calls.length;
    await act(async()=>{Simulate.change(background,{target:{checked:false}});});
    await act(async()=>{Simulate.click(invert);});
    expect(HTMLCanvasElement.prototype.toDataURL.mock.calls.length).toBeGreaterThan(exports);
    await act(async()=>{Simulate.click(container.querySelector('.poster-shuffle-everything'));});
    expect(background.checked).toBe(false);
    expect(invert.getAttribute('aria-pressed')).toBe('true');
});

test('failed venue photos uncheck the control and can be retried',async()=>{
    for(const method of ['strokeText','strokeRect','beginPath','arc','fill','stroke','moveTo','lineTo','save','restore','scale','translate','rotate','ellipse','closePath'])context[method]=jest.fn();
    const venuePhoto='https://giglist.com.au/venues/test.jpg';
    let fail=true;
    window.Image=class {
        naturalWidth=1200;naturalHeight=800;
        set src(value){this.source=value;Promise.resolve().then(()=>value===venuePhoto&&fail?this.onerror():this.onload());}
    };
    axios.get.mockResolvedValue({data:[{listings:[{artist:'Band',name:'Test Venue',address:'Main Street',suburb:'Perth',date:'2027-03-15',start:'8pm',location_image_url:venuePhoto}]}]});
    await act(async()=>{ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/testvenue" poster /></HelmetProvider></MemoryRouter>,container);});
    const checkbox=container.querySelector('.poster-venue-photo input');
    expect(checkbox.checked).toBe(false);
    expect(container.textContent).toContain('check Use Venue Photo again to retry');
    fail=false;context.drawImage.mockClear();
    await act(async()=>{Simulate.change(checkbox,{target:{checked:true}});});
    expect(checkbox.checked).toBe(true);
    expect(context.drawImage.mock.calls.some(([image])=>image.source===venuePhoto)).toBe(true);
    expect(container.textContent).not.toContain('check Use Venue Photo again to retry');
});

test('feed outages explain the missing preview and Retry restores the poster',async()=>{
    for(const method of ['strokeText','strokeRect','beginPath','arc','fill','stroke','moveTo','lineTo','save','restore','scale','translate','rotate','ellipse','closePath'])context[method]=jest.fn();
    jest.spyOn(console,'error').mockImplementation(()=>{});
    axios.get.mockRejectedValueOnce({response:{status:500}}).mockResolvedValue({data:[{listings:[{artist:'Band',name:'Windsor Hotel',address:'Main Street',suburb:'Perth',date:'2027-03-15',start:'8pm'}]}]});
    await act(async()=>{ReactDOM.render(<MemoryRouter><HelmetProvider><QrPoster targetUrl="https://giglist.com.au/windsorhotel" poster /></HelmetProvider></MemoryRouter>,container);});
    expect(container.querySelector('.poster-preview-status [role=alert]').textContent).toContain('HTTP 500');
    expect(container.querySelector('.qr-poster-image')).toBeNull();
    await act(async()=>{Simulate.click(container.querySelector('.poster-preview-status button'));});
    expect(container.querySelector('.qr-poster-image')).not.toBeNull();
    expect(container.querySelector('.poster-preview-status')).toBeNull();
});
