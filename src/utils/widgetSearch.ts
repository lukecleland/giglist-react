import { TGiglist } from '../types/types';
import { compactName } from './searchUrl';
import { cityForSlug, searchCities } from './citySearch';

export type WidgetSubject = {slug: string; name: string; kind: string};

export const widgetSubjects = (dates: TGiglist): WidgetSubject[] => {
    const artists = new Map<string,string>(), members = new Map<string,string>();
    const venues = new Map<string,string>(), suburbs = new Map<string,string>();
    const add = (map: Map<string,string>, name: string) => {
        const slug = compactName(name || '');
        if (slug && !map.has(slug)) map.set(slug,name.trim().replace(/&amp;/gi,'&'));
    };
    dates.forEach(date => date.listings.forEach(gig => {
        add(artists,gig.artist);
        gig.artist.split(',').forEach(name=>add(members,name));
        add(venues,gig.name);add(suburbs,gig.suburb);
    }));
    const slugs = new Set([...Object.keys(searchCities),...Array.from(members.keys()),...Array.from(venues.keys()),...Array.from(suburbs.keys())]);
    return Array.from(slugs, slug => {
        // Match the same name precedence used by the destination pages.
        if(artists.has(slug))return {slug,name:artists.get(slug)!,kind:'Artist'};
        if(venues.has(slug))return {slug,name:venues.get(slug)!,kind:'Venue'};
        const city = cityForSlug(slug);
        if(city)return {slug,name:city.name,kind:'City'};
        if(suburbs.has(slug))return {slug,name:suburbs.get(slug)!,kind:'Suburb'};
        return {slug,name:members.get(slug)!,kind:'Artist'};
    }).sort((a,b) => a.name.localeCompare(b.name));
};

export const searchWidgetSubjects = (subjects: WidgetSubject[], query: string): WidgetSubject[] => {
    const needle = compactName(query);
    if (needle.length < 2) return [];
    return subjects.filter(subject => subject.slug.includes(needle)).sort((a,b) =>
        Number(b.slug === needle) - Number(a.slug === needle) ||
        Number(b.slug.startsWith(needle)) - Number(a.slug.startsWith(needle)) || a.name.localeCompare(b.name));
};
