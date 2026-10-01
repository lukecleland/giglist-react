import {filterGigSearch, nameForSearchSlug} from './searchUrl';
import {getTourProfile} from './tourProfile';
import {gigWithinCity, searchCities} from './citySearch';
const gig=(suburb,lat,lng,state='WA')=>({artist:'A band',name:'A venue',suburb,lat:String(lat),lng:String(lng),state});
test.each(['perth','sydney','brisbane','melbourne','adelaide','canberra','hobart','darwin'])('%s includes nearby suburbs without requiring a CBD gig',slug=>{
    const city=searchCities[slug];
    const near=gig('Neighbouring suburb',city.lat+.05,city.lng,city.state);
    const far=gig('Distant suburb',city.lat+.4,city.lng,city.state);
    const dates=[{listings:[near,far]}];
    expect(filterGigSearch(dates,slug,true)[0].listings).toEqual([near]);
    expect(nameForSearchSlug(dates,slug)).toBe(city.name);
    expect(getTourProfile(dates,slug)).toMatchObject({title:city.name,isSuburb:true,isVenue:false,addresses:[]});
});
test('25km boundary uses geographic distance, including east-west travel',()=>{
    const city=searchCities.perth;
    const latitudeOffset=km=>km/6371*180/Math.PI;
    expect(gigWithinCity(gig('Near',city.lat+latitudeOffset(24.99),city.lng),city)).toBe(true);
    expect(gigWithinCity(gig('Far',city.lat+latitudeOffset(25.01),city.lng),city)).toBe(false);
    expect(gigWithinCity(gig('East',city.lat,city.lng+.2),city)).toBe(true);
    expect(gigWithinCity(gig('East',city.lat,city.lng+.4),city)).toBe(false);
});
test('missing coordinates retain only correctly located CBD gigs',()=>{
    expect(gigWithinCity(gig('Perth','',''),searchCities.perth)).toBe(true);
    expect(gigWithinCity(gig('Perth','','','TAS'),searchCities.perth)).toBe(false);
    expect(gigWithinCity(gig('Nearby','',''),searchCities.perth)).toBe(false);
    expect(gigWithinCity(gig('Nearby','oops','181'),searchCities.perth)).toBe(false);
});
test('suburb URLs, regular searches and exact artist collisions keep their existing meaning',()=>{
    const dates=[{listings:[gig('Northbridge',-31.946,115.86),gig('Perth',-31.95,115.86)]}];
    expect(filterGigSearch(dates,'northbridge',true)[0].listings).toHaveLength(1);
    expect(filterGigSearch(dates,'Perth')[0].listings).toHaveLength(1);
    dates[0].listings.push({...gig('Elsewhere',-20,130),artist:'Perth'});
    expect(filterGigSearch(dates,'perth',true)[0].listings).toEqual([dates[0].listings[2]]);
});
