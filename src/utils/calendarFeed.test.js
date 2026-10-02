import { calendarIcs } from './calendarFeed';

test('calendar snapshot includes local gig time, venue and event link', () => {
    const ics = calendarIcs('Northbridge','https://giglist.com.au/northbridge',[{
        date:'2026-10-03',start:'7:30PM',artist:'A & B',name:'The Hall',address:'1 Main St',suburb:'Northbridge',state:'WA',
    }]);
    expect(ics).toContain('DTSTART;TZID=Australia/Perth:20261003T193000');
    expect(ics).toContain('SUMMARY:A & B at The Hall');
    expect(ics).toContain('URL:https://giglist.com.au/gig-a-and-b-the-hall-2026-10-03');
    expect(ics).toContain('END:VCALENDAR\r\n');
});
test('gigs without reliable times become all-day reminders', () => {
    const ics = calendarIcs('Venue','https://giglist.com.au/venue',[{date:'2026-10-03',start:'TBA',artist:'Band',name:'Venue',state:'QLD'}]);
    expect(ics).toContain('DTSTART;VALUE=DATE:20261003');
    expect(ics).toContain('DTEND;VALUE=DATE:20261004');
});
