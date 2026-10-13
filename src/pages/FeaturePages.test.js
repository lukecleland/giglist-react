import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';
import {act, Simulate} from 'react-dom/test-utils';
import {HelmetProvider} from 'react-helmet-async';
import axios from 'axios';
import {FeaturePage} from './FeaturePages';

jest.mock('@react-google-maps/api',()=>({
    useJsApiLoader:()=>({isLoaded:true}),
    GoogleMap:({children})=><div data-testid="map">{children}</div>,
    Marker:({onClick,position})=><button data-testid="marker" onClick={onClick}>{position.lat},{position.lng}</button>,
}));
jest.mock('axios',()=>({get:jest.fn()}));
let root;
const gig={id:1,artist:'Clayton Bulger',name:'Windsor Hotel',date:'2027-10-03',start:'7:30PM',address:'1 Main Street',suburb:'Perth',state:'WA',lat:'-31.95',lng:'115.86'};
beforeEach(()=>{root=document.createElement('div');document.body.appendChild(root);axios.get.mockResolvedValue({data:[{listings:[gig]}]});URL.createObjectURL=jest.fn(()=> 'blob:calendar');URL.revokeObjectURL=jest.fn();});
afterEach(()=>{act(()=>{ReactDOM.unmountComponentAtNode(root);});root.remove();jest.clearAllMocks();});
const show=async(kind,slug)=>act(async()=>{ReactDOM.render(<HelmetProvider><MemoryRouter><FeaturePage route={{kind,slug,targetUrl:`https://giglist.com.au/${slug}`}} /></MemoryRouter></HelmetProvider>,root);});

test('artist embed lists the venue and provides an iframe snippet',async()=>{
    await show('embed','claytonbulger');
    expect(root.textContent).toContain('Windsor Hotel');
    expect(root.querySelector('textarea').value).toContain('claytonbulger_embed?embed=1');
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
    expect(root.querySelectorAll('[data-testid="marker"]')).toHaveLength(2);
    act(()=>{Simulate.click(root.querySelector('[data-testid="marker"]'));});
    expect(Array.from(root.querySelectorAll('.feature-map-selected time'),time=>time.textContent)).toEqual([
        'Sun 3 Oct 2027 · 7:30PM','Sun 10 Oct 2027 · 7:30PM',
    ]);
    act(()=>{Simulate.click(root.querySelectorAll('[data-testid="marker"]')[1]);});
    expect(root.querySelector('.feature-map-selected time').textContent).toBe('Mon 1 Nov 2027 · 7:30PM');
});
