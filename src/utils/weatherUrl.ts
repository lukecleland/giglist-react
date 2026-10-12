import moment from 'moment';
import { TListing } from '../types/types';

const zones: Record<string, string> = {
    WA: 'Australia/Perth', SA: 'Australia/Adelaide', NT: 'Australia/Darwin',
    QLD: 'Australia/Brisbane', NSW: 'Australia/Sydney', ACT: 'Australia/Sydney',
    VIC: 'Australia/Melbourne', TAS: 'Australia/Hobart',
};
const day = 24 * 60 * 60 * 1000;
const forecastStep = 3 * 60 * 60 * 1000;

export const weatherUrl = (gig: TListing, now = Date.now()): string | null => {
    if (!gig.lat?.trim() || !gig.lng?.trim()) return null;
    const lat = Number(gig.lat), lng = Number(gig.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180 || (lat === 0 && lng === 0)) return null;

    const state = (gig.state || '').trim().toUpperCase();
    const suburb = (gig.suburb || '').trim().toLowerCase();
    const zone = state === 'NSW' && ['broken hill', 'silverton'].includes(suburb) ? 'Australia/Broken_Hill'
        : state === 'NSW' && suburb === 'lord howe island' ? 'Australia/Lord_Howe' : zones[state];
    if (!zone) return null;
    const date = moment.utc(gig.date, 'YYYY-MM-DD', true);
    const time = moment.utc((gig.start || '').trim().toUpperCase(), ['h:mmA', 'h:mm A', 'hA', 'h A', 'HH:mm', 'HH:mm:ss'], true);
    if (!date.isValid() || !time.isValid()) return null;

    // Interpret the wall-clock start in the venue's timezone, independent of the visitor's timezone.
    const wallTime = date.hour(time.hour()).minute(time.minute()).second(time.second()).valueOf();
    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    });
    const localTime = (timestamp: number) => {
        const parts: Record<string, string> = {};
        formatter.formatToParts(timestamp).forEach(part => { parts[part.type] = part.value; });
        return Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
    };
    let start = wallTime;
    for (let i = 0; i < 3; i++) start += wallTime - localTime(start);
    // Reject nonexistent local times during the daylight-saving jump and out-of-range gigs.
    if (localTime(start) !== wallTime || start <= now || start > now + 7 * day) return null;

    // Windy's documented links use three-hour UTC forecast slots. Never select a past slot.
    const forecast = Math.max(Math.round(start / forecastStep), Math.ceil(now / forecastStep)) * forecastStep;
    if (forecast > now + 7 * day) return null;
    const point = `${lat.toFixed(5)}/${lng.toFixed(5)}`;
    return `https://www.windy.com/${point}?ecmwf,temp,${moment.utc(forecast).format('YYYY-MM-DD-HH')},${lat.toFixed(5)},${lng.toFixed(5)},12`;
};
