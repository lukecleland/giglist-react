import { qrTargetFromPath } from "./qrUrl";

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
