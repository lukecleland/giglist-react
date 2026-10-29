import { initializeLocation, postcodeForCoordinates } from "./initialLocation";

beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
});
afterEach(() => jest.useRealTimers());
const mockLocation = (implementation) => {
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: { getCurrentPosition: jest.fn(implementation) } });
};

test("detects and stores a postcode for a first visit", async () => {
    mockLocation((success) => success({ coords: { latitude: -12.458684, longitude: 130.83668 } }));
    await initializeLocation();
    expect(JSON.parse(localStorage.getItem("location")).postcode).toBe("0800");
});
test("retains an existing location without requesting permission", async () => {
    mockLocation();
    localStorage.setItem("location", JSON.stringify({ postcode: "6000" }));
    await initializeLocation();
    expect(navigator.geolocation.getCurrentPosition).not.toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem("location")).postcode).toBe("6000");
});
test("falls back to national when permission is denied", async () => {
    mockLocation((success, failure) => failure());
    await initializeLocation();
    expect(JSON.parse(localStorage.getItem("location")).postcode).toBe("0000");
});
test("falls back when geolocation is unavailable", async () => {
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: undefined });
    await initializeLocation();
    expect(JSON.parse(localStorage.getItem("location")).postcode).toBe("0000");
});
test("times out an unanswered permission prompt and ignores late results", async () => {
    let success;
    mockLocation((callback) => { success = callback; });
    const ready = initializeLocation();
    jest.advanceTimersByTime(8000);
    await ready;
    success({ coords: { latitude: -12.458684, longitude: 130.83668 } });
    expect(JSON.parse(localStorage.getItem("location")).postcode).toBe("0000");
});
test("does not overwrite a manual selection while detection is pending", async () => {
    let success;
    mockLocation((callback) => { success = callback; });
    const ready = initializeLocation();
    localStorage.setItem("location", JSON.stringify({ postcode: "2000" }));
    success({ coords: { latitude: -12.458684, longitude: 130.83668 } });
    await ready;
    expect(JSON.parse(localStorage.getItem("location")).postcode).toBe("2000");
});
test("uses national for distant or invalid coordinates", () => {
    expect(postcodeForCoordinates(51.5, -0.12).postcode).toBe("0000");
    expect(postcodeForCoordinates(NaN, NaN).postcode).toBe("0000");
});
