import moment from 'moment';
import { TListing, TGiglist } from '../types/types';
import { uniquePosterGigs } from './posterDuplicates';
import { filterGigSearch } from './searchUrl';

export const featureGigs = (dates: TGiglist, slug: string, month?: number): TListing[] => uniquePosterGigs(
    filterGigSearch(dates, slug, true).flatMap(day => day.listings).filter(gig => month === undefined || Number(gig.date.slice(5,7)) === month + 1),
).sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`));

export const gigDisplayName = (gig: TListing, isVenue: boolean, isSuburb: boolean) =>
    (isVenue || isSuburb ? gig.artist : gig.name).replace(/&amp;/gi, '&');

export const gigSecondaryName = (gig: TListing, isVenue: boolean, isSuburb: boolean) =>
    (isVenue ? [gig.suburb, gig.state].filter(Boolean).join(', ') : isSuburb ? gig.name : [gig.suburb, gig.state].filter(Boolean).join(', ')).replace(/&amp;/gi, '&');

export const gigDateLabel = (gig: TListing) => `${moment(gig.date).format('ddd D MMM')} · ${gig.start || 'Time TBA'}`;
