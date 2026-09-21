import axios from "axios";
import { fetchGigAds } from "./fetchGigAds";

jest.mock("axios", () => ({
    __esModule: true,
    default: { get: jest.fn() },
}));
beforeEach(() => jest.resetAllMocks());

test.each(["http", "https"])("loads all pages over HTTPS when Baserow returns %s next links", async (protocol) => {
    const firstPage = Array.from({ length: 100 }, (_, id) => ({ id }));
    const lastPage = Array.from({ length: 7 }, (_, index) => ({ id: 100 + index }));
    const next = `${protocol}://api.baserow.io/api/database/rows/table/108866/?page=2&user_field_names=true`;
    axios.get.mockResolvedValueOnce({ data: { results: firstPage, next } });
    axios.get.mockResolvedValueOnce({ data: { results: lastPage, next: null } });
    expect(await fetchGigAds("Token test")).toEqual([...firstPage, ...lastPage]);
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenLastCalledWith(
        "https://api.baserow.io/api/database/rows/table/108866/?page=2&user_field_names=true",
        { headers: { Authorization: "Token test" } },
    );
});

test("returns no ads for an empty table", async () => {
    axios.get.mockResolvedValueOnce({ data: { results: [], next: null } });
    expect(await fetchGigAds("Token test")).toEqual([]);
    expect(axios.get).toHaveBeenCalledTimes(1);
});

test("rejects failed later pages instead of returning an incomplete rotation", async () => {
    axios.get.mockResolvedValueOnce({ data: { results: [{ id: 1 }], next: "https://api.baserow.io/?page=2" } });
    axios.get.mockRejectedValueOnce(new Error("Request failed"));
    await expect(fetchGigAds("Token test")).rejects.toThrow("Request failed");
});
