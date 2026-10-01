import { upcomingWeekend, weekendGigs } from './posterWeekend';
test.each([[2026,9,1,'2026-10-02','2026-10-04'],[2026,9,2,'2026-10-02','2026-10-04'],[2026,9,3,'2026-10-02','2026-10-04'],[2026,9,4,'2026-10-02','2026-10-04'],[2026,9,5,'2026-10-09','2026-10-11'],[2026,11,31,'2027-01-01','2027-01-03']])('selects Friday–Sunday for %i/%i/%i', (y,m,d,start,end) => {
    const range = upcomingWeekend(new Date(y,m,d,12));
    expect(range.start).toBe(start); expect(range.end).toBe(end);
});
test('includes both boundary dates and excludes weekdays', () => {
    const gigs = ['2026-10-01','2026-10-02','2026-10-03','2026-10-04','2026-10-05'].map(date => ({date}));
    expect(weekendGigs(gigs,upcomingWeekend(new Date(2026,9,1)))).toEqual(gigs.slice(1,4));
});
