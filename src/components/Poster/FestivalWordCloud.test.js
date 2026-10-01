import { drawFestivalWordCloud, listStyles, nextListStyle } from './FestivalWordCloud';

test.each(listStyles.filter(style => style !== 'columns').flatMap(style => [1, 9, 92, 200].map(count => [style, count])))('%s fits all %i gigs without overlaps or dropped repeated names', (style, count) => {
    const ctx = Object.fromEntries(['save', 'restore', 'fillRect', 'fillText', 'strokeText', 'beginPath', 'arc', 'moveTo', 'lineTo', 'closePath', 'fill'].map(name => [name,jest.fn()]));
    ctx.measureText = text => ({width: text.length * Number(/([\d.]+)px/.exec(ctx.font)?.[1] || 30) * .55});
    const area = {x:65,y:320,width:1470,height:1390};
    const entries = Array.from({length:count}, (_, i) => ({name:i % 3 ? 'A long artist and supporting band name' : 'Open Mic', dateKey: String(Math.floor(i / 4)), dateLabel: `Day ${Math.floor(i / 4)}`, details:`Fri ${i+1} Oct 2026 · 7PM · The Local Venue`}));
    const {bounds} = drawFestivalWordCloud(ctx, {area,entries,backdrop:'#111111bb',divider:style,font:'Bitter',ink:'#fff',accent:'#ddd'});
    expect(bounds).toHaveLength(count);
    for (const box of bounds) {
        expect(box.x).toBeGreaterThanOrEqual(area.x + 48 - .01);
        expect(box.y).toBeGreaterThanOrEqual(area.y + 48 - .01);
        expect(box.x + box.width).toBeLessThanOrEqual(area.x + area.width - 48 + .01);
        expect(box.y + box.height).toBeLessThanOrEqual(area.y + area.height - 48 + .01);
    }
    bounds.forEach((a,i) => bounds.slice(i+1).forEach(b => {
        expect(a.x + a.width <= b.x + .01 || b.x + b.width <= a.x + .01 || a.y + a.height <= b.y + .01 || b.y + b.height <= a.y + .01).toBe(true);
    }));
    expect(ctx.fillText.mock.calls.map(([text])=>text).join(' ')).toContain(`Fri ${count} Oct 2026`);
});

test.each(['diamonds', 'circles', 'stars'])('%s dividers fit between entries and long names use smaller type', divider => {
    const ctx = Object.fromEntries(['save', 'restore', 'fillRect', 'fillText', 'strokeText', 'beginPath', 'arc', 'moveTo', 'lineTo', 'closePath', 'fill'].map(name => [name,jest.fn()]));
    ctx.measureText = text => ({width: text.length * Number(/([\d.]+)px/.exec(ctx.font)?.[1] || 30) * .5});
    const sizes = {};
    ctx.fillText.mockImplementation(text => { sizes[text] = Number(/([\d.]+)px/.exec(ctx.font)?.[1]); });
    const {bounds} = drawFestivalWordCloud(ctx, {area:{x:0,y:0,width:1470,height:200},entries:[{name:'Neon',details:'Friday'}, {name:'The Much Longer Artist Event Name',details:'Saturday'}, {name:'Band',details:'Sunday'}],font:'Outfit',ink:'#fff',accent:'#ddd',divider});
    expect(bounds).toHaveLength(3);
    expect(sizes.Neon).toBeGreaterThan(sizes[Object.keys(sizes).find(text => text.startsWith('The Much'))]);
    expect(ctx.fill).toHaveBeenCalled();
});


test('shuffle reaches every layout before repeating', () => {
    const seen = ['columns'];
    while (seen.length < listStyles.length) {
        const next = nextListStyle(seen[seen.length-1], () => 0, seen);
        expect(seen).not.toContain(next);
        seen.push(next);
    }
    expect(new Set(seen).size).toBe(listStyles.length);
});

test('long comma-separated artist names wrap without shrinking the entire bill to one line', () => {
    const ctx = Object.fromEntries(['save', 'restore', 'fillRect', 'fillText', 'strokeText', 'beginPath', 'arc', 'moveTo', 'lineTo', 'closePath', 'fill'].map(name => [name, jest.fn()]));
    ctx.measureText = text => ({width: text.length * Number(/([\d.]+)px/.exec(ctx.font)?.[1] || 30) * .5});
    const name = 'Jan Gunnar Hoff, Counterfeit, Kye Brown, Another Long Artist';
    const {bounds} = drawFestivalWordCloud(ctx, {area:{x:0,y:0,width:600,height:700},entries:[{name,details:'Friday'}],font:'Bitter',ink:'#fff',accent:'#ddd',divider:'stacked'});
    const artistLines = ctx.fillText.mock.calls.map(([text]) => text).filter(text => name.includes(text) && text.length > 8);
    expect(artistLines.length).toBeGreaterThan(1);
    expect(artistLines.join(' ')).toBe(name);
    expect(bounds[0].height).toBeGreaterThan(0);
});

test.each([.6, .9])('row whitespace stays fixed with glyph height ratio %f', ratio => {
    const ctx = Object.fromEntries(['save','restore','fillRect','fillText','strokeText','beginPath','arc','moveTo','lineTo','closePath','fill'].map(name=>[name,jest.fn()]));
    ctx.measureText = text => {
        const size=Number(/([\d.]+)px/.exec(ctx.font)?.[1] || 30);
        return {width:text.length*size*.5,actualBoundingBoxAscent:-size*.1,actualBoundingBoxDescent:size*(ratio+.1)};
    };
    const {bounds} = drawFestivalWordCloud(ctx,{area:{x:0,y:0,width:1400,height:1300},entries:['Band One','Band Two','Band Three'].map(name=>({name,details:''})),font:'Outfit',ink:'#fff',accent:'#ddd',divider:'stacked'});
    expect(bounds[1].y-(bounds[0].y+bounds[0].height)).toBeCloseTo(24);
    expect(bounds[2].y-(bounds[1].y+bounds[1].height)).toBeCloseTo(24);
});
