import { drawSocialCard } from './socialCard';

test('auto contrast adapts each text block and outlines text without changing the footer',()=>{
    const draws=[];
    const pixels=new Uint8ClampedArray(1080*1920*4);
    pixels.fill(255,0,1080*300*4);
    const ctx={fillRect:jest.fn(),drawImage:jest.fn(),save:jest.fn(),restore:jest.fn(),strokeText:jest.fn(),
        getImageData:jest.fn(()=>({width:1080,height:1920,data:pixels})),
        measureText:text=>({width:text.length * Number(/([\d.]+)px/.exec(ctx.font)[1]) * .5}),
        fillText:text=>draws.push({text,colour:ctx.fillStyle})};
    drawSocialCard({getContext:()=>ctx},{title:'Perth',targetUrl:'https://giglist.com.au/perth',
        gigs:[{artist:'Local Band',name:'Venue',date:'2026-10-16',start:'8pm'}],image:{},qr:{},
        format:'story',palette:'none',autoContrast:true,isVenue:true,isSuburb:false});
    expect(draws.find(draw=>draw.text==='Perth').colour).toBe('#000000');
    expect(draws.find(draw=>draw.text==='Local Band').colour).toBe('#ffffff');
    expect(draws.find(draw=>draw.text==='Giglist').colour).toBe('#fff');
    expect(ctx.getImageData).toHaveBeenCalledTimes(1);
    expect(ctx.strokeText.mock.calls.some(([text])=>text==='Local Band')).toBe(true);
    expect(ctx.strokeText.mock.calls.some(([text])=>text==='Giglist')).toBe(false);
});

test('font colour inversion turns white text black while preserving footer contrast',()=>{
    const draws=[];
    const ctx={fillRect:jest.fn(),drawImage:jest.fn(),
        measureText:text=>({width:text.length * Number(/([\d.]+)px/.exec(ctx.font)[1]) * .5}),
        fillText:text=>draws.push({text,colour:ctx.fillStyle})};
    drawSocialCard({getContext:()=>ctx},{title:'Perth',targetUrl:'https://giglist.com.au/perth',
        gigs:[{artist:'Local Band',name:'Venue',date:'2026-10-16',start:'8pm'}],image:{},qr:{},
        format:'story',palette:'none',invertFontColour:true,isVenue:true,isSuburb:false});
    for(const text of ['Perth','Local Band','LIVE MUSIC · NEXT 7 DAYS'])expect(draws.find(draw=>draw.text===text).colour).toBe('#000000');
    expect(draws.find(draw=>draw.text==='Giglist').colour).toBe('#fff');
});

test.each(['story','square'])('%s applies the chosen font to headline and gig names',format=>{
    const draws=[];
    const ctx={fillRect:jest.fn(),drawImage:jest.fn(),createLinearGradient:()=>({addColorStop:jest.fn()}),
        measureText:text=>({width:text.length * Number(/([\d.]+)px/.exec(ctx.font)[1]) * .5}),
        fillText:text=>draws.push({text,font:ctx.font})};
    drawSocialCard({getContext:()=>ctx},{title:'Perth',targetUrl:'https://giglist.com.au/perth',
        gigs:[{artist:'Local Band',name:'Venue',date:'2026-10-16',start:'8pm'}],image:{},qr:{},
        format,palette:'midnight',font:'Rye',isVenue:true,isSuburb:false});
    for(const text of ['Perth','Local Band'])expect(draws.find(draw=>draw.text===text).font).toMatch(/^400 .*"Rye"/);
    expect(draws.find(draw=>draw.text==='Giglist').font).toContain('carbontyperegular');
});

test.each(['story', 'square'])('%s columns keep a shared font size and wrap long names without compression', format => {
    const draws = [];
    const ctx = {
        fillRect: jest.fn(), drawImage: jest.fn(),
        createLinearGradient: () => ({ addColorStop: jest.fn() }),
        measureText: text => ({ width: Array.from(text).length * Number(/([\d.]+)px/.exec(ctx.font)[1]) * .5 }),
        fillText: (...args) => draws.push({ args, font: ctx.font }),
    };
    const longName = 'Supercalifragilisticexpialidocious'.repeat(2);
    const gigs = Array.from({ length: 14 }, (_, index) => ({
        artist: index === 0 ? longName : `Band ${index}`, name: 'Venue',
        suburb: 'Perth', state: 'WA', date: '2026-10-02', start: '8pm',
    }));
    drawSocialCard({ getContext: () => ctx }, {
        title: 'Perth', targetUrl: 'https://giglist.com.au/perth', gigs,
        image: {}, qr: {}, format, palette: 'midnight', isVenue: true, isSuburb: false,
    });
    const names = draws.filter(({ args: [, x, y], font }) =>
        (x === 94 || x === 585) && font.startsWith('700 '));
    expect(new Set(names.map(({ args }) => args[1]))).toEqual(new Set([94, 585]));
    expect(new Set(names.map(({ font }) => font)).size).toBe(1);
    expect(names.every(({ args }) => args.length === 3)).toBe(true);
    const wrappedName = names.filter(({ args }) => !args[0].startsWith('Band '));
    expect(wrappedName.map(({ args }) => args[0]).join('')).toBe(longName);
    expect(wrappedName.length).toBeGreaterThan(1);
    for (const x of [94, 585]) {
        const column = draws.filter(({ args }) => args[1] === x);
        const starts = column.filter(({ args, font }) => font.startsWith('700 ') && args[0].startsWith('Band '));
        starts.forEach(({ args: [, , y] }) => {
            const previousDetails = column.filter(({ args, font }) => !font.startsWith('700 ') && args[2] < y);
            const previous = previousDetails[previousDetails.length - 1];
            if (previous) {
                const detailSize = Number(/([\d.]+)px/.exec(previous.font)[1]);
                expect(y - previous.args[2] - detailSize * 1.25).toBeCloseTo(36);
            }
        });
    }
});

test.each([['story', 3], ['square', 3], ['story', 9]])('%s single column keeps %i gigs together with consistent spacing', (format, count) => {
    const draws = [];
    const ctx = {
        fillRect: jest.fn(), drawImage: jest.fn(),
        createLinearGradient: () => ({ addColorStop: jest.fn() }),
        measureText: text => ({ width: text.length * Number(/([\d.]+)px/.exec(ctx.font)[1]) * .5 }),
        fillText: (...args) => draws.push({ args, font: ctx.font }),
    };
    drawSocialCard({ getContext: () => ctx }, {
        title: 'Perth', targetUrl: 'https://giglist.com.au/perth',
        gigs: Array.from({ length: count }, (_, index) => ({
            artist: `Band ${index}`, name: 'Venue', suburb: 'Perth', state: 'WA',
            date: '2026-10-02', start: '8pm',
        })),
        image: {}, qr: {}, format, palette: 'midnight', isVenue: true, isSuburb: false,
    });
    const names = draws.filter(({ args }) => args[0].startsWith('Band '));
    expect(names).toHaveLength(count);
    expect(names.every(({ args }) => args[1] === 94)).toBe(true);
    const details = draws.filter(({ args, font }) => args[1] === 94 && !font.startsWith('700 '));
    names.slice(1).forEach(({args}) => {
        const previous = details.filter(detail => detail.args[2] < args[2]).slice(-1)[0];
        const detailSize = Number(/([\d.]+)px/.exec(previous.font)[1]);
        expect(args[2] - previous.args[2] - detailSize * 1.25).toBeCloseTo(36);
    });
    expect(names[1].args[2] - names[0].args[2]).toBeCloseTo(names[2].args[2] - names[1].args[2]);
});
