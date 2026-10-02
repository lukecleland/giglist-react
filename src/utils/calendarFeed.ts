import moment from 'moment';
import { TListing } from '../types/types';
import { buildGigUrl } from './gigUrl';

const escapeIcs = (value: string) => value.replace(/&amp;/gi, '&').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
const icsDate = (date: string) => date.replace(/-/g, '');
const timeParts = (value: string) => {
    const match = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i.exec(value.trim());
    if (!match) return null;
    const hour = Number(match[1]) % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0);
    return `${String(hour).padStart(2, '0')}${match[2] || '00'}00`;
};
const timezone = (state: string) => ({WA:'Australia/Perth',SA:'Australia/Adelaide',NT:'Australia/Darwin',QLD:'Australia/Brisbane',NSW:'Australia/Sydney',ACT:'Australia/Sydney',VIC:'Australia/Melbourne',TAS:'Australia/Hobart'} as Record<string,string>)[state.toUpperCase()] || 'Australia/Perth';
const fold = (line: string) => line.match(/.{1,70}/gu)?.join('\r\n ') || line;

export const calendarIcs = (title: string, targetUrl: string, gigs: TListing[]): string => {
    const stamp = moment.utc().format('YYYYMMDDTHHmmss[Z]');
    const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Giglist//Live music//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',`X-WR-CALNAME:${escapeIcs(title)} gigs`,`X-WR-CALDESC:${escapeIcs(`Upcoming live music for ${title} on Giglist`)}`];
    for (const gig of gigs) {
        const date = icsDate(gig.date.slice(0, 10));
        if (!/^\d{8}$/.test(date)) continue;
        const start = timeParts(gig.start || '');
        const url = buildGigUrl(gig);
        lines.push('BEGIN:VEVENT',`UID:${encodeURIComponent(`${gig.date}-${gig.start}-${gig.artist}-${gig.name}`)}@giglist.com.au`,`DTSTAMP:${stamp}`);
        if (start) {
            const zone = timezone(gig.state || '');
            lines.push(`DTSTART;TZID=${zone}:${date}T${start}`);
            // The feed has a start time but no reliable finish time.
            lines.push('DURATION:PT2H');
        } else {
            lines.push(`DTSTART;VALUE=DATE:${date}`,`DTEND;VALUE=DATE:${moment(gig.date).add(1,'day').format('YYYYMMDD')}`);
        }
        lines.push(`SUMMARY:${escapeIcs(`${gig.artist} at ${gig.name}`)}`,`LOCATION:${escapeIcs([gig.address,gig.suburb,gig.state].filter(Boolean).join(', '))}`,`DESCRIPTION:${escapeIcs(`Gig details: ${url}`)}`,`URL:${url}`,'END:VEVENT');
    }
    lines.push('END:VCALENDAR');
    return lines.map(fold).join('\r\n') + '\r\n';
};
