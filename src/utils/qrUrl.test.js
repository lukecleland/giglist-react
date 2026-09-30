import { qrTargetFromPath, posterTargetFromPath, posterRouteFromPath } from "./qrUrl";

test.each([
    ["/claytonbulger_qr", "https://giglist.com.au/claytonbulger"],
    ["/windsorhotel_qr/", "https://giglist.com.au/windsorhotel"],
    ["/clayton_bulger_qr", "https://giglist.com.au/clayton_bulger"],
    ["/Mac%C3%ABy_qr", "https://giglist.com.au/Mac%C3%ABy"],
    ["/windsorhotel_QR", "https://giglist.com.au/windsorhotel"],
])("removes only the final QR suffix: %s", (path, expected) => {
    expect(qrTargetFromPath(path)).toBe(expected);
});

test.each(["/", "/qr", "/_qr", "/claytonbulger", "/a/b_qr", "/%ZZ_qr", "/%2Fevil_qr", "/a%3Fb_qr"])("leaves ordinary or invalid paths alone: %s", (path) => {
    expect(qrTargetFromPath(path)).toBeNull();
});


test.each(["/windsorhotel_poster", "/windsorhotel_POSTER/"])("poster URL links back to the original search: %s", (path) => {
    expect(posterTargetFromPath(path)).toBe("https://giglist.com.au/windsorhotel");
});
test.each(["/windsorhotel_qr", "/_poster", "/a/b_poster", "/%ZZ_poster", "/%2Fevil_poster"])("invalid poster path: %s", (path) => {
    expect(posterTargetFromPath(path)).toBeNull();
});


test('month poster routes preserve the underlying listing URL', () => {
    expect(posterRouteFromPath('/southperth_poster_mar')).toEqual({targetUrl: 'https://giglist.com.au/southperth', month: 2});
    expect(posterRouteFromPath('/venue_POSTER_DEC/')).toEqual({targetUrl: 'https://giglist.com.au/venue', month: 11});
    expect(posterRouteFromPath('/venue_poster_xyz')).toBeNull();
});
