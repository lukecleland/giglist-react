import { buildGigAdRotation } from "./gigAdRotation";

const dates = (count) =>
    Array.from({ length: count }, () => ({ listings: [{}] }));

test.each([7, 10, 23])("rotates all %i ads sequentially before repeating", (count) => {
    const cycle = Array.from({ length: count }, (_, index) => index);
    expect(buildGigAdRotation(dates(count * 2 + 1), count)).toEqual([
        ...cycle, ...cycle, 0,
    ]);
});

test("empty dates do not consume ad slots", () => {
    const populated = dates(20);
    const actual = buildGigAdRotation([
        ...populated.slice(0, 3),
        { listings: [] },
        ...populated.slice(3),
    ], 10);
    expect(actual[3]).toBe(-1);
    expect(actual.filter((id) => id !== -1)).toEqual(buildGigAdRotation(populated, 10));
});

test("handles zero ads, one ad, and no dates", () => {
    expect(buildGigAdRotation(dates(3), 0)).toEqual([-1, -1, -1]);
    expect(buildGigAdRotation(dates(3), 1)).toEqual([0, 0, 0]);
    expect(buildGigAdRotation([], 10)).toEqual([]);
});
