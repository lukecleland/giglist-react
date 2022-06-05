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
    location_image_url: string;
  };

export type TGiglist = {
    dates: TDatelist[];
};

export type TDatelist = {
    datestring: string;
    datetime: string;
    gigs: TListing[];
}

export type TGiglistApiResponse = {
    status: number;
    statusText: string;
    data: any;
    error: any;
    loading: boolean;
};