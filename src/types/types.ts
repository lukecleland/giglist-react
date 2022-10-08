export type TGiglistApiResponse = {
    status: number;
    statusText: string;
    data: TDate[];
    error: any;
    loading: boolean;
};

export type TListing = {
    lat: number;
    lng: number;
    name: string;
    artist: string;
    artist_url: string;
    address: string;
    suburb: string;
    location_url: string;
    start: string;
    date_formatted: string;
    date: string;
    state: string;
    zip: string;
    location_image_url: string;
    datestamp: {
        date: Date;
    };
};

export type TDate = {
    datestring: string;
    datetime: string;
    listings: TListing[];
};

export type TGiglist = TDate[];
