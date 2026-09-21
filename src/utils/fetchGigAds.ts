import axios from "axios";
import { GigAd } from "../types/types";

type AdsPage = {
    results: GigAd[];
    next: string | null;
};

export const fetchGigAds = async (authorization: string): Promise<GigAd[]> => {
    const ads: GigAd[] = [];
    const endpoint =
        "https://api.baserow.io/api/database/rows/table/108866/?user_field_names=true";
    let url: string | null = endpoint;

    while (url) {
        const { data }: { data: AdsPage } = await axios.get<AdsPage>(url, {
            headers: { Authorization: authorization },
        });
        ads.push(...data.results);
        // Baserow can return HTTP next links. Keep requests on the HTTPS
        // table endpoint and copy only the pagination query parameters.
        if (data.next) {
            const nextPage = new URL(endpoint);
            nextPage.search = new URL(data.next, endpoint).search;
            url = nextPage.href;
        } else {
            url = null;
        }
    }

    return ads;
};
