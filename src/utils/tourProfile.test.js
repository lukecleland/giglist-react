import { getTourProfile } from "./tourProfile";

test.each([
    ['andrewmeredith','ANDREW MEREDITH'],
    ['dddylan','DDDylan'],
    ['janeantiparty','Jane Antiparty'],
    ['ashby','Ashby'],
])('uses only the matching artist in a comma-separated lineup for %s', (slug,title) => {
    const dates=[{listings:[{artist:'ANDREW MEREDITH, DDDylan, Jane Antiparty, Ashby',name:'Local Venue',suburb:'Northbridge'}]}];
    expect(getTourProfile(dates,slug)).toMatchObject({title,isVenue:false,isSuburb:false});
});

test('prefers an exact lineup member over an earlier partial artist match',()=>{
    const dates=[{listings:[
        {artist:'Andrew Meredith Tribute',name:'Venue A'},
        {artist:'Other Band, Andrew Meredith',name:'Venue B'},
    ]}];
    expect(getTourProfile(dates,'andrewmeredith').title).toBe('Andrew Meredith');
});

test('retains the full title when the URL matches the whole comma-containing name',()=>{
    const dates=[{listings:[{artist:'Earth, Wind &amp; Fire',name:'Venue'}]}];
    expect(getTourProfile(dates,'earthwindfire').title).toBe('Earth, Wind & Fire');
});

test("recognizes a venue even when the URL omits The", () => {
    const gig = { artist: "Live Band", name: "The Windsor Hotel", address: "112 Mill Point Road", suburb: "South Perth" };
    expect(getTourProfile([{ listings: [gig, gig] }], "windsorhotel")).toEqual({
        title: "The Windsor Hotel", isVenue: true, isSuburb: false, addresses: ["112 Mill Point Road, South Perth"],
    });
});

test("an exact venue match takes priority over an artist substring", () => {
    const gigs = [{ artist: "Windsor Hotel Tribute", name: "Windsor Hotel", address: "Main Street", suburb: "Perth" }];
    expect(getTourProfile([{ listings: gigs }], "windsorhotel").isVenue).toBe(true);
});


test("exact suburbs take priority over partial venue names and have no address", () => {
    const gigs = [{ artist: "Live Band", name: "South Perth Hotel", address: "Main Street", suburb: "South Perth" }];
    expect(getTourProfile([{ listings: gigs }], "southperth")).toEqual({
        title: "South Perth", isVenue: false, isSuburb: true, addresses: [],
    });
});
