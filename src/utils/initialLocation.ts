import postcodeData from "../components/output";

const nationalLocation = { postcode: "0000", lat: -35.2777, long: 149.119 };

// Estimate a nearby postcode locally, without sending coordinates to a service.
export function postcodeForCoordinates(latitude: number, longitude: number) {
    const radians = Math.PI / 180;
    let nearest: typeof postcodeData[number] | undefined;
    let nearestDistance = Infinity;
    for (const row of postcodeData) {
        if (!row.postcode) continue;
        const a = Math.sin((row.lat - latitude) * radians / 2) ** 2
            + Math.cos(latitude * radians) * Math.cos(row.lat * radians)
            * Math.sin((row.long - longitude) * radians / 2) ** 2;
        const distance = 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, a)));
        if (distance < nearestDistance) {
            nearest = row;
            nearestDistance = distance;
        }
    }
    // Do not assign a distant Australian postcode to overseas visitors.
    return nearest && nearestDistance <= 50
        ? { ...nearest, postcode: String(nearest.postcode).padStart(4, "0") }
        : nationalLocation;
}

export function initializeLocation(): Promise<void> {
    if (window.localStorage.getItem("location")) return Promise.resolve();
    const fallback = JSON.stringify(nationalLocation);
    window.localStorage.setItem("location", fallback);
    return new Promise((resolve) => {
        let finished = false;
        const finish = (location = nationalLocation) => {
            if (finished) return;
            finished = true;
            window.clearTimeout(timer);
            // A manual choice made while permission was pending takes priority.
            if (window.localStorage.getItem("location") === fallback) {
                window.localStorage.setItem("location", JSON.stringify(location));
                window.dispatchEvent(new Event("locationchange"));
            }
            resolve();
        };
        const timer = window.setTimeout(() => finish(), 8000);
        try {
            if (!navigator.geolocation) return finish();
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => finish(postcodeForCoordinates(coords.latitude, coords.longitude)),
                () => finish(),
                { enableHighAccuracy: false, timeout: 7000, maximumAge: 300000 },
            );
        } catch {
            finish();
        }
    });
}
