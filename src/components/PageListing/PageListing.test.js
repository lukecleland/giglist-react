import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { HelmetProvider } from 'react-helmet-async';
import { PageListing } from './PageListing';
import { buildGigUrl } from '../../utils/gigUrl';

jest.mock('../EventSchema', () => ({ EventSchema: () => null }));
const gig = {artist:'Kyle Hearn',name:'Landing7',artist_url:' NA ',location_url:'https://example.com',location_image_url:'',address:'140 Blue Plains Road',suburb:'Chittering',state:'WA',lat:'-31.4',lng:'116.1',date:'2026-10-03',start:'1:00PM',datestamp:{date:'2026-10-03T13:00:00'}};
let container;
beforeEach(() => {container=document.createElement('div');document.body.appendChild(container);});
afterEach(() => {act(() => {ReactDOM.unmountComponentAtNode(container);});container.remove();});
const render = data => act(() => {ReactDOM.render(<HelmetProvider><PageListing listing={data}/></HelmetProvider>,container);});
test('NA artist has no link; directions, venue and Facebook use consistent buttons', () => {
    render(gig);
    expect(container.querySelectorAll('.listing-action')).toHaveLength(4);
    expect(Array.from(container.querySelectorAll("a")).some(link => link.textContent === "Artist/Event")).toBe(false);
    const share = container.querySelector('a[href^="https://www.facebook.com/sharer/sharer.php"]');
    expect(new URL(share.href).searchParams.get('u')).toBe(buildGigUrl(gig));
    expect(share.target).toBe('_blank');
    expect(share.rel).toContain('noopener');
    expect(new URL(container.querySelector('a[href*="maps/dir"]').href).searchParams.get('destination')).toBe('-31.4,116.1');
});
test('artist URL is normalized and missing coordinates use the venue address', () => {
    render({...gig,artist_url:'example.org/artist',lat:'',lng:''});
    expect(container.querySelector('a[href="https://example.org/artist"]')).not.toBeNull();
    expect(new URL(container.querySelector('a[href*="maps/dir"]').href).searchParams.get('destination')).toContain('140 Blue Plains Road');
});
