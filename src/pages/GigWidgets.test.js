import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import { GigWidgets } from './GigWidgets';

jest.mock('axios',()=>({get:jest.fn()}));
const data=[{date:'2026-10-16',listings:[{artist:'Andrew Meredith, Jane Antiparty',name:'The Rose',suburb:'Fitzroy',address:'1 Main Street'}]}];
let container;
beforeEach(()=>{
    container=document.createElement('div');document.body.appendChild(container);
    axios.get.mockReset().mockResolvedValue({data});
});
afterEach(()=>{act(()=>{ReactDOM.unmountComponentAtNode(container);});container.remove();});
const render=(route='/gigwidgets')=>act(async()=>{
    ReactDOM.render(<HelmetProvider><MemoryRouter initialEntries={[route]}><GigWidgets /></MemoryRouter></HelmetProvider>,container);
});
const search=(query)=>act(()=>{Simulate.change(container.querySelector('input'),{target:{value:query}});});

test('artist search opens eight tools using only the selected lineup member',async()=>{
    await render();search('Andrew Meredith');
    expect(container.querySelector('.gigwidgets-results').textContent).toBe('Andrew MeredithArtist');
    act(()=>{Simulate.submit(container.querySelector('form'));});
    expect(container.querySelector('h1').textContent).toBe('Andrew Meredith');
    expect(Array.from(container.querySelectorAll('.gigwidgets-card'),link=>link.getAttribute('href'))).toEqual([
        '/andrewmeredith/poster','/andrewmeredith/qr','/andrewmeredith/social','/andrewmeredith/embed',
        '/andrewmeredith/calendar','/andrewmeredith/screen','/andrewmeredith/map','/andrewmeredith'
    ]);
    expect(container.querySelector('.feature-footer')).not.toBeNull();
    act(()=>{Simulate.click(container.querySelector('.gigwidgets-back'));});
    expect(container.querySelector('input').value).toBe('');
    expect(container.querySelector('.gigwidgets-cards')).toBeNull();
});

test.each([['therose','The Rose','Venue'],['fitzroy','Fitzroy','Suburb'],['sydney','Sydney','City']])('direct selection %s survives loading',async(slug,name,kind)=>{
    await render(`/gigwidgets?for=${slug}`);
    expect(container.querySelector('h1').textContent).toBe(name);
    expect(container.querySelector('.gigwidgets-kicker').textContent).toBe(kind);
    expect(!!container.querySelector(`a[href="/${slug}/map"]`)).toBe(kind!=='Venue');
});

test('failed feed can be retried and unmatched searches give feedback',async()=>{
    axios.get.mockRejectedValueOnce(new Error('Offline'));
    await render();
    expect(container.querySelector('[role=status]').textContent).toContain('couldn’t load');
    await act(async()=>{Simulate.click(container.querySelector('.gigwidgets-retry'));});
    search('nonexistent name');
    expect(container.querySelector('[role=status]').textContent).toContain('No matches found');
    expect(axios.get).toHaveBeenCalledTimes(2);
});

test('returning to a selected artist shows tools immediately while the feed reloads',async()=>{
    await render('/gigwidgets?for=andrewmeredith');
    act(()=>{ReactDOM.unmountComponentAtNode(container);});
    axios.get.mockReturnValue(new Promise(()=>{}));
    await render('/gigwidgets?for=andrewmeredith');
    expect(container.querySelector('h1').textContent).toBe('Andrew Meredith');
    expect(container.querySelectorAll('.gigwidgets-card')).toHaveLength(8);
    expect(container.querySelector('input')).toBeNull();
});

test('a direct selection never shows the search form while it loads',async()=>{
    axios.get.mockReturnValue(new Promise(()=>{}));
    await render('/gigwidgets?for=uncachedartist');
    expect(container.querySelector('[role=status]').textContent).toBe('Loading tools…');
    expect(container.querySelector('input')).toBeNull();
});
