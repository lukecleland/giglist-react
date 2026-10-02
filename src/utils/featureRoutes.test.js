import { featureRouteFromPath } from './featureRoutes';

test.each(['embed','calendar','screen','map','social'])('%s URL resolves to its original gig page', kind => {
    expect(featureRouteFromPath(`/fremantle_${kind}`)).toEqual({kind,slug:'fremantle',targetUrl:'https://giglist.com.au/fremantle'});
});
test('feature URLs reject nested, empty and invalid paths', () => {
    expect(featureRouteFromPath('/_map')).toBeNull();
    expect(featureRouteFromPath('/a/b_map')).toBeNull();
    expect(featureRouteFromPath('/%ZZ_social')).toBeNull();
    expect(featureRouteFromPath('/fremantle_poster')).toBeNull();
    expect(featureRouteFromPath('/fremantle_embed_xyz')).toBeNull();
});

test.each(['embed','calendar','screen','map','social'])('%s accepts a month suffix', kind => {
    expect(featureRouteFromPath(`/fremantle_${kind}_OCT/`)).toEqual({kind,slug:'fremantle',targetUrl:'https://giglist.com.au/fremantle',month:9});
    expect(featureRouteFromPath(`/fremantle_${kind}_jan`).month).toBe(0);
});
