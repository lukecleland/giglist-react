import moment from 'moment';
import { TListing } from '../types/types';

// During Friday–Sunday, use the current weekend; otherwise use the next Friday.
export const upcomingWeekend = (now: Date = new Date()) => {
    const start = moment(now).startOf('day');
    const day = start.isoWeekday();
    start.add(day <= 5 ? 5 - day : -(day - 5), 'days');
    const end = start.clone().add(2, 'days');
    return {start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD'),
        label: `LIVE MUSIC THIS WEEKEND · ${start.format('D MMM')}–${end.format('D MMM YYYY')}`};
};
export const weekendGigs = (gigs: TListing[], range: ReturnType<typeof upcomingWeekend>) =>
    gigs.filter(gig => gig.date.slice(0,10) >= range.start && gig.date.slice(0,10) <= range.end);
