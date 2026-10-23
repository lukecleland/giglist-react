import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';
import {act, Simulate} from 'react-dom/test-utils';
import {HelmetProvider} from 'react-helmet-async';
import axios from 'axios';
import {FeaturePage} from './FeaturePages';

const mockClusterer={};
jest.mock('@react-google-maps/api',()=>({
    useJsApiLoader:()=>({isLoaded:true}),
    GoogleMap:({children})=><div data-testid="map">{children}</div>,
    InfoWindow:({children,position,onCloseClick})=><div data-testid="map-popup" data-lat={position.lat}><button aria-label="Close venue details" onClick={onCloseClick}>×</button>{children}</div>,
    MarkerClusterer:({children,onClick})=><div><button data-testid="cluster" onClick={onClick}>Cluster</button>{children(mockClusterer)}</div>,
    Marker:({onClick,position,clusterer,icon})=><button data-testid="marker" data-clustered={clusterer===mockClusterer} data-icon={icon.url} onClick={onClick}>{position.lat},{position.lng}</button>,
}));
jest.mock('axios',()=>({get:jest.fn()}));
let root;
const originalGoogle=window.google;
const gig={id:1,artist:'Clayton Bulger',name:'Windsor Hotel',date:'2027-10-03',start:'7:30PM',address:'1 Main Street',suburb:'Perth',state:'WA',lat:'-31.95',lng:'115.86'};
beforeEach(()=>{window.google={maps:{Size:class {constructor(width,height){this.width=width;this.height=height;}},Point:class {constructor(x,y){this.x=x;this.y=y;}}}};root=document.createElement('div');document.body.appendChild(root);axios.get.mockResolvedValue({data:[{listings:[gig]}]});URL.createObjectURL=jest.fn(()=> 'blob:calendar');URL.revokeObjectURL=jest.fn();});
afterEach(()=>{act(()=>{ReactDOM.unmountComponentAtNode(root);});root.remove();window.google=originalGoogle;jest.clearAllMocks();});
const show=async(kind,slug)=>act(async()=>{ReactDOM.render(<HelmetProvider><MemoryRouter><FeaturePage route={{kind,slug,targetUrl:`https://giglist.com.au/${slug}`}} /></MemoryRouter></HelmetProvider>,root);});

test('artist embed lists the venue and provides an iframe snippet',async()=>{
    await show('embed','claytonbulger');
    expect(root.textContent).toContain('Windsor Hotel');
    expect(root.querySelector('textarea').value).toContain('claytonbulger/embed?embed=1');
});
test('calendar page offers a live subscription and downloadable snapshot',async()=>{
    await show('calendar','windsorhotel');
    expect(root.querySelector('a[href^="webcal:"]')).not.toBeNull();
    expect(root.querySelector('a[download]').getAttribute('href')).toBe('blob:calendar');
    expect(root.textContent).toContain('Clayton Bulger');
});


test('map shows gigs across dates and includes each full date in venue details',async()=>{
    axios.get.mockResolvedValue({data:[{listings:[gig,
        {...gig,id:2,date:'2027-10-10'},
        {...gig,id:3,name:'Another Venue',date:'2027-11-01',lat:'-32.1'},
    ]}]});
    await show('map','claytonbulger');
    expect(root.querySelector('#feature-map-day')).toBeNull();
    expect(root.querySelector('.tool-header h1').textContent).toBe('Clayton Bulger - 2 venues');
    expect(root.querySelector('.feature-map-summary')).toBeNull();
    expect(root.querySelector('.feature-map > header')).toBeNull();
    expect(root.querySelectorAll('[data-testid="marker"]')).toHaveLength(2);
    expect(root.querySelector('[data-testid="marker"]').dataset.clustered).toBe('true');
    expect(root.querySelector('[data-testid="marker"]').dataset.icon).toBe('gigmap-marker.svg');
    act(()=>{Simulate.click(root.querySelector('[data-testid="marker"]'));});
    expect(Array.from(root.querySelectorAll('.feature-map-selected time'),time=>time.textContent)).toEqual([
        'Sun 3 Oct 2027 · 7:30PM','Sun 10 Oct 2027 · 7:30PM',
    ]);
    expect(root.querySelector('.feature-map-hero').getAttribute('src')).toBe('/placeholder-gig.jpeg');
    expect(root.querySelectorAll('.feature-map-selected h2')).toHaveLength(1);
    expect(root.querySelectorAll('.feature-map-selected h3')).toHaveLength(1);
    act(()=>{Simulate.click(root.querySelectorAll('[data-testid="marker"]')[1]);});
    expect(root.querySelector('.feature-map-selected time').textContent).toBe('Mon 1 Nov 2027 · 7:30PM');
    expect(root.querySelector('[data-testid="map-popup"]').dataset.lat).toBe('-32.1');
    act(()=>{Simulate.click(root.querySelector('[data-testid="cluster"]'));});
    expect(root.querySelector('.feature-map-selected')).toBeNull();
});


test('map summarises multiple artists under one venue with links for every date',async()=>{
    axios.get.mockResolvedValue({data:[{listings:[gig,{...gig,id:2,date:'2027-10-10'},{...gig,id:3,artist:'Another Artist',date:'2027-10-12',location_image_url:'https://giglist.com.au/venue.jpg'}]}]});
    await show('map','perth');
    act(()=>{Simulate.click(root.querySelector('[data-testid="marker"]'));});
    expect(root.querySelectorAll('.feature-map-selected')).toHaveLength(1);
    expect(root.querySelector('.feature-map-selected h2').textContent).toBe('Windsor Hotel');
    expect(Array.from(root.querySelectorAll('.feature-map-selected h3'),el=>el.textContent)).toEqual(['Clayton Bulger','Another Artist']);
    expect(root.querySelectorAll('.feature-map-dates a')).toHaveLength(3);
    const photo=root.querySelector('.feature-map-hero');
    expect(photo.getAttribute('src')).toBe('https://giglist.com.au/venue.jpg');
    act(()=>{Simulate.error(photo);});
    expect(photo.getAttribute('src')).toBe('/placeholder-gig.jpeg');
    act(()=>{Simulate.click(root.querySelector('[aria-label="Close venue details"]'));});
    expect(root.querySelector('.feature-map-selected')).toBeNull();
});
