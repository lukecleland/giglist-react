import React from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';
import {HelmetProvider} from 'react-helmet-async';
import axios from 'axios';
import {FeaturePage} from './FeaturePages';

jest.mock('axios',()=>({get:jest.fn()}));
let root;
const gig={id:1,artist:'Clayton Bulger',name:'Windsor Hotel',date:'2027-10-03',start:'7:30PM',address:'1 Main Street',suburb:'Perth',state:'WA',lat:'-31.95',lng:'115.86'};
beforeEach(()=>{root=document.createElement('div');document.body.appendChild(root);axios.get.mockResolvedValue({data:[{listings:[gig]}]});URL.createObjectURL=jest.fn(()=> 'blob:calendar');URL.revokeObjectURL=jest.fn();});
afterEach(()=>{act(()=>{ReactDOM.unmountComponentAtNode(root);});root.remove();jest.clearAllMocks();});
const show=async(kind,slug)=>act(async()=>{ReactDOM.render(<HelmetProvider><FeaturePage route={{kind,slug,targetUrl:`https://giglist.com.au/${slug}`}} /></HelmetProvider>,root);});

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
