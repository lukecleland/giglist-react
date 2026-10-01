import { bannerFonts, bannerNames, drawArtworkBanner } from './posterBanners';
import { drawPoster } from './posterDesign';

const context = () => {
    const ctx = Object.fromEntries(['fillRect','strokeRect','beginPath','rect','clip','arc','ellipse','fill','stroke','moveTo','lineTo','closePath','fillText','strokeText','drawImage','save','restore','translate','scale','rotate'].map(name => [name,jest.fn()]));
    ctx.createLinearGradient = () => ({addColorStop:jest.fn()});
    ctx.measureText = text => ({width:text.length * Number(/([\d.]+)px/.exec(ctx.font)?.[1] || 30) * .5});
    return ctx;
};
test.each(Object.keys(bannerNames))('%s clips ornament and preserves listing font settings', style => {
    const ctx=context();
    drawArtworkBanner(ctx,style,35,240,'#111111','#ffffff','#ddaa55');
    expect(ctx.rect).toHaveBeenCalledWith(0,35,1600,240);
    expect(ctx.clip).toHaveBeenCalledTimes(1);
    const fonts=bannerFonts(style,{title:'Outfit',listing:'Bitter',effect:'outline'});
    expect(fonts.listing).toBe('Bitter'); expect(fonts.effect).toBe('outline');
});
test.each(Object.keys(bannerNames))('%s renders a long name without losing dense listings', header => {
    const ctx=context();
    const gigs=Array.from({length:60},(_,i)=>({artist:`Band ${i}`,name:'Venue',date:'2026-10-02',start:'8PM',suburb:'Perth'}));
    const result=drawPoster(ctx,{theme:'nocturne',header,title:'A very long artist and venue name with several supporting musicians',targetUrl:'https://giglist.com.au/perth',qr:{},photo:null,gigs,isSuburb:true,fonts:bannerFonts(header,{title:'Outfit',listing:'Bitter'})});
    expect(result.rows).toHaveLength(60);
    expect(result.rows.every(row=>row.y>=result.listingArea.y && row.y+row.height<=1710.01)).toBe(true);
});

test.each(['nocturne', 'cutpaste'])('%s starts dense header artwork at the top edge and moves listings up', theme => {
    const ctx=context();
    const gigs=Array.from({length:30},(_,i)=>({artist:`Band ${i}`,name:'Venue',date:'2026-10-02',start:'8PM',suburb:'Perth'}));
    const result=drawPoster(ctx,{theme,header:'ripple-centered',title:'Perth',targetUrl:'https://giglist.com.au/perth',qr:{},photo:null,gigs,isSuburb:true});
    expect(ctx.rect).toHaveBeenCalledWith(0,0,1600,theme==='nocturne' ? 240 : 225);
    expect(result.listingArea.y).toBe(theme==='nocturne' ? 260 : 265);
    expect(result.listingArea.y+result.listingArea.height).toBe(1710);
});
