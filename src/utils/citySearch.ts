import { TListing } from '../types/types';

export type SearchCity = {name: string; state: string; lat: number; lng: number};
// Approximate city centres (not municipal boundaries). Coordinates checked against
// https://www.geodatos.net/en/coordinates/australia and https://www.geonames.org/AU/largest-cities-in-australia.html
export const searchCities: Record<string, SearchCity> = {
    sydney: {name:'Sydney',state:'NSW',lat:-33.86785,lng:151.20732},
    melbourne: {name:'Melbourne',state:'VIC',lat:-37.814,lng:144.96332},
    brisbane: {name:'Brisbane',state:'QLD',lat:-27.46794,lng:153.02809},
    perth: {name:'Perth',state:'WA',lat:-31.95224,lng:115.8614},
    adelaide: {name:'Adelaide',state:'SA',lat:-34.92866,lng:138.59863},
    canberra: {name:'Canberra',state:'ACT',lat:-35.28346,lng:149.12807},
    hobart: {name:'Hobart',state:'TAS',lat:-42.87936,lng:147.32941},
    darwin: {name:'Darwin',state:'NT',lat:-12.46113,lng:130.84185},
    goldcoast: {name:'Gold Coast',state:'QLD',lat:-28.00029,lng:153.43088},
    newcastle: {name:'Newcastle',state:'NSW',lat:-32.92953,lng:151.7801},
    wollongong: {name:'Wollongong',state:'NSW',lat:-34.424,lng:150.89345},
    geelong: {name:'Geelong',state:'VIC',lat:-38.14711,lng:144.36069},
    townsville: {name:'Townsville',state:'QLD',lat:-19.26639,lng:146.80569},
    cairns: {name:'Cairns',state:'QLD',lat:-16.92366,lng:145.76613},
    toowoomba: {name:'Toowoomba',state:'QLD',lat:-27.56056,lng:151.95386},
    launceston: {name:'Launceston',state:'TAS',lat:-41.43876,lng:147.13467},
    sunshinecoast: {name:'Sunshine Coast',state:'QLD',lat:-26.65682,lng:153.07955},
};
export const cityForSlug = (slug: string): SearchCity | undefined => Object.prototype.hasOwnProperty.call(searchCities, slug) ? searchCities[slug] : undefined;
export const CITY_RADIUS_KM = 25;
export function gigWithinCity(gig: TListing, city: SearchCity): boolean {
    const lat=Number(gig.lat), lng=Number(gig.lng);
    if (!String(gig.lat ?? '').trim() || !String(gig.lng ?? '').trim() || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat)>90 || Math.abs(lng)>180 || (lat===0 && lng===0)) {
        // Retain known CBD gigs without coordinates; never guess nearby suburbs.
        return (gig.suburb || '').trim().toLowerCase() === city.name.toLowerCase() && (!gig.state || gig.state.toUpperCase() === city.state);
    }
    const radians=(degrees:number)=>degrees*Math.PI/180;
    const a=Math.sin(radians(lat-city.lat)/2)**2+Math.cos(radians(city.lat))*Math.cos(radians(lat))*Math.sin(radians(lng-city.lng)/2)**2;
    const distance=6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(Math.max(0,1-a)));
    return distance <= CITY_RADIUS_KM;
}
