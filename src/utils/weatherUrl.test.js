import { weatherUrl } from './weatherUrl';

const now = Date.parse('2026-10-12T00:00:00Z');
const gig = {date:'2026-10-16',start:'8:00PM',state:'NSW',suburb:'Newtown',lat:'-33.9',lng:'151.2'};

test('uses venue coordinates and daylight-saving local time, rounded to a UTC forecast slot', () => {
    expect(weatherUrl(gig, now)).toBe('https://www.windy.com/-33.90000/151.20000?ecmwf,temp,2026-10-16-09,-33.90000,151.20000,12');
    expect(weatherUrl({...gig,state:'WA'}, now)).toContain('2026-10-16-12');
    expect(weatherUrl({...gig,state:'SA',start:'7:30PM'}, now)).toContain('2026-10-16-09');
    expect(weatherUrl({...gig,suburb:'Broken Hill',start:'7:30PM'}, now)).toContain('2026-10-16-09');
});

test.each([
    {date:'2026-10-11'}, {date:'2026-10-20'}, {date:'2026-02-30'},
    {start:'TBA'}, {start:'25:00'}, {start:'13:00PM'}, {state:''},
    {lat:''}, {lat:' '}, {lat:'NaN'}, {lat:'91'}, {lng:'181'}, {lat:'0',lng:'0'},
])('hides weather for an ineligible gig: %j', changes => {
    expect(weatherUrl({...gig,...changes}, now)).toBeNull();
});

test('checks the exact start time against the seven-day window', () => {
    const start = Date.parse('2026-10-16T09:00:00Z');
    expect(weatherUrl(gig, start)).toBeNull();
    expect(weatherUrl(gig, start - 7 * 86400000)).not.toBeNull();
    expect(weatherUrl(gig, start - 7 * 86400000 - 1)).toBeNull();
});

test('handles UTC date rollover and rejects a nonexistent daylight-saving time', () => {
    expect(weatherUrl({...gig,start:'12:30AM'}, now)).toContain('2026-10-15-15');
    expect(weatherUrl({...gig,date:'2026-10-04',start:'2:30AM'}, Date.parse('2026-10-03T00:00:00Z'))).toBeNull();
});
