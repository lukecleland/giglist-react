export type TGiglistApiResponse = {
    status: number;
    statusText: string;
    data: TDate[];
    error: any;
    loading: boolean;
};

export type TListing = {
    lat: string;
    lng: string;
    name: string;
    artist: string;
    artist_url: string;
    address: string;
    suburb: string;
    location_url: string | null;
    start: string;
    date_formatted: string;
    date: string;
    state: string;
    zip: string;
    location_image_url: string;
    datestamp: {
        date: Date | string;
    };
};

export type TDate = {
    datestring: string;
    datetime: string;
    listings: TListing[];
};

export type TGiglist = TDate[];

declare global {
    interface JQuery {
        printArea(): void;
    }
}
