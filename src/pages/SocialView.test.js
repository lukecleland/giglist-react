import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { SocialView } from './FeaturePages';
import { drawSocialCard } from '../utils/socialCard';
import { loadPosterImage } from '../utils/posterArtwork';
import * as uploads from '../utils/posterUpload';

jest.mock('axios', () => ({get:jest.fn()}));
jest.mock('../utils/socialCard', () => ({ drawSocialCard: jest.fn() }));
jest.mock('../utils/posterArtwork', () => ({ posterArtwork: {concertlights:'lights.jpg',forest:'forest.jpg'}, loadPosterImage: jest.fn() }));
let container, originalImage, originalFonts;
const route={slug:'perth',targetUrl:'https://giglist.com.au/perth'};
const profile={title:'Perth',isSuburb:true,isVenue:false};
const gigs=[{date:'2026-10-14',artist:'Midweek'},{date:'2026-10-16',artist:'Friday'}];
beforeEach(()=>{
    jest.useFakeTimers().setSystemTime(new Date('2026-10-13T12:00:00Z'));
    container=document.createElement('div');document.body.appendChild(container);
    originalImage=window.Image;originalFonts=document.fonts;
    window.Image=class {decode(){return Promise.resolve();}};
    Object.defineProperty(document,'fonts',{configurable:true,value:{load:jest.fn().mockResolvedValue([{}])}});
    jest.spyOn(HTMLCanvasElement.prototype,'toDataURL').mockReturnValue('data:image/png;base64,social');
    loadPosterImage.mockResolvedValue({});drawSocialCard.mockClear();
});
afterEach(()=>{
    act(()=>{ReactDOM.unmountComponentAtNode(container);});container.remove();
    window.Image=originalImage;Object.defineProperty(document,'fonts',{configurable:true,value:originalFonts});
    jest.restoreAllMocks();jest.useRealTimers();
});
const render=()=>act(async()=>{ReactDOM.render(<MemoryRouter><SocialView route={route} profile={profile} gigs={gigs}/></MemoryRouter>,container);});
const change=async(label,value)=>act(async()=>{Simulate.change(container.querySelector(`select[aria-label="${label}"]`),{target:{value}});});
const output=()=>drawSocialCard.mock.calls.slice(-1)[0][1];

test('panel selections update the exported format, palette and image',async()=>{
    await render();
    const toggle=container.querySelector('.poster-panel-toggle');
    act(()=>Simulate.click(toggle));expect(toggle.getAttribute('aria-expanded')).toBe('true');
    await change('Size','square');await change('Colour','paper');await change('Image','forest');
    expect(output()).toMatchObject({format:'square',palette:'paper',gigs});
    expect(loadPosterImage).toHaveBeenLastCalledWith('forest.jpg');
    expect(container.querySelector('a[download]').download).toBe('giglist-perth-square.png');
    expect(container.querySelector('a[download]').href).toBe('data:image/png;base64,social');
});

test('weekend filter updates both listings and the graphic period',async()=>{
    await render();
    await act(async()=>Simulate.change(container.querySelector('input[type=checkbox]'),{target:{checked:true}}));
    expect(output().gigs).toEqual([gigs[1]]);
    expect(output().periodLabel).toContain('WEEKEND');
});

test('None removes the image without a fetch and image labels are readable',async()=>{
    await render();
    const options=Array.from(container.querySelector('select[aria-label="Image"]').options).map(option=>option.textContent);
    expect(options).toEqual(['None','Concert Lights','Forest']);
    loadPosterImage.mockClear();
    await change('Image','none');
    expect(output().image).toBeNull();
    expect(loadPosterImage).not.toHaveBeenCalled();
    expect(container.querySelector('a[download]')).not.toBeNull();
    await change('Image','forest');
    expect(loadPosterImage).toHaveBeenCalledWith('forest.jpg');
});

test('font controls load the selected font and update the exported graphic',async()=>{
    await render();
    await change('Font','Rye');
    expect(document.fonts.load).toHaveBeenCalledWith('400 42px "Rye"');
    expect(output().font).toBe('Rye');
    await change('Size','square');
    expect(output()).toMatchObject({font:'Rye',format:'square'});
    await act(async()=>Simulate.click(container.querySelector('[aria-label="Next font"]')));
    expect(output().font).toBe(container.querySelector('select[aria-label="Font"]').value);
    expect(output().font).not.toBe('Rye');
});

test('failed font load prevents exporting a fallback font',async()=>{
    await render();document.fonts.load.mockRejectedValueOnce(new Error('offline'));
    await change('Font','Rye');
    expect(container.querySelector('a[download]')).toBeNull();
    expect(container.querySelector('[role=alert]')).not.toBeNull();
});

test('font colour inversion toggles and persists across format changes',async()=>{
    await render();
    const toggle=container.querySelector('button[aria-pressed]');
    await act(async()=>Simulate.click(toggle));
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(output().invertFontColour).toBe(true);
    await change('Size','square');expect(output().invertFontColour).toBe(true);
    await act(async()=>Simulate.click(toggle));
    expect(output().invertFontColour).toBe(false);
});

test('auto contrast reaches the export and manual inversion switches back to manual colour',async()=>{
    await render();
    const auto=Array.from(container.querySelectorAll('button')).find(button=>button.textContent==='Auto contrast');
    await act(async()=>Simulate.click(auto));
    expect(auto.getAttribute('aria-pressed')).toBe('true');
    expect(output().autoContrast).toBe(true);
    await change('Image','none');await change('Colour','paper');
    expect(output().autoContrast).toBe(true);
    const invert=Array.from(container.querySelectorAll('button')).find(button=>button.textContent==='Invert font colour');
    await act(async()=>Simulate.click(invert));
    expect(output()).toMatchObject({autoContrast:false,invertFontColour:true});
});

test('failed image render removes the stale download and reports the error',async()=>{
    await render();loadPosterImage.mockRejectedValueOnce(new Error('offline'));
    await change('Image','forest');
    expect(container.querySelector('a[download]')).toBeNull();
    expect(container.querySelector('[role=alert]').textContent).toContain('couldn’t load');
});

test('uploaded background reaches the export, survives format changes, and can be removed',async()=>{
    const image={naturalWidth:1600,naturalHeight:900};
    jest.spyOn(uploads,'readPosterUpload').mockResolvedValue({name:'my-photo.png',image,palette:{}});
    await render();
    await act(async()=>Simulate.change(container.querySelector('input[type=file]'),{target:{files:[new File(['image'],'my-photo.png',{type:'image/png'})],value:''}}));
    expect(output().image).toBe(image);
    expect(container.querySelector('select[aria-label="Image"]').value).toBe('custom');
    await change('Size','square');expect(output().image).toBe(image);
    await act(async()=>Simulate.click(container.querySelector('[aria-label="Remove custom background"]')));
    expect(output().image).not.toBe(image);
    expect(container.querySelector('select[aria-label="Image"]').value).toBe('concertlights');
});

test('rejected background upload preserves the current graphic and reports the reason',async()=>{
    jest.spyOn(uploads,'readPosterUpload').mockRejectedValue(new Error('Choose a JPG, PNG or WebP image.'));
    await render();
    await act(async()=>Simulate.change(container.querySelector('input[type=file]'),{target:{files:[new File(['bad'],'bad.txt')],value:''}}));
    expect(container.querySelector('[role=alert]').textContent).toContain('JPG, PNG or WebP');
    expect(container.querySelector('a[download]')).not.toBeNull();
});
