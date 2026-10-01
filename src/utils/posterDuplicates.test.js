import {uniquePosterGigs} from './posterDuplicates';
const gig = {date:'2026-10-04',artist:'Mike Nayar',name:'Local Bar',suburb:'Northbridge',state:'WA',address:'1 Main St',start:'7:00PM'};
test('removes duplicate events despite feed IDs, casing and time formatting', () => {
    expect(uniquePosterGigs([gig,{...gig,id:2,artist:' MIKE  NAYAR ',start:'19:00'}])).toEqual([gig]);
});
test('preserves different days, venues and times in detailed listings', () => {
    const gigs = [gig,{...gig,date:'2026-10-05'},{...gig,name:'Other Bar'},{...gig,start:'9PM'}];
    expect(uniquePosterGigs(gigs)).toEqual(gigs);
});
test('artist-only festival layout shows each artist once per calendar day', () => {
    const tomorrow = {...gig,date:'2026-10-05'};
    expect(uniquePosterGigs([gig,{...gig,name:'Other Bar',start:'9PM'},tomorrow],true)).toEqual([gig,tomorrow]);
});
test('does not conflate different multi-artist bills', () => {
    const other = {...gig,artist:'Mike Nayar, Another Artist'};
    expect(uniquePosterGigs([gig,other],true)).toEqual([gig,other]);
});
