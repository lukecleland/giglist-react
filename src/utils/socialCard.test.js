import { drawSocialCard } from './socialCard';

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
                expect(y - previous.args[2] - detailSize * 1.25).toBeCloseTo(24);
            }
        });
    }
});

test.each(['story', 'square'])('%s single column spreads gigs through the available height', format => {
    const draws = [];
    const ctx = {
        fillRect: jest.fn(), drawImage: jest.fn(),
        createLinearGradient: () => ({ addColorStop: jest.fn() }),
        measureText: text => ({ width: text.length * Number(/([\d.]+)px/.exec(ctx.font)[1]) * .5 }),
        fillText: (...args) => draws.push({ args, font: ctx.font }),
    };
    drawSocialCard({ getContext: () => ctx }, {
        title: 'Perth', targetUrl: 'https://giglist.com.au/perth',
        gigs: Array.from({ length: 3 }, (_, index) => ({
            artist: `Band ${index}`, name: 'Venue', suburb: 'Perth', state: 'WA',
            date: '2026-10-02', start: '8pm',
        })),
        image: {}, qr: {}, format, palette: 'midnight', isVenue: true, isSuburb: false,
    });
    const names = draws.filter(({ args }) => args[0].startsWith('Band '));
    expect(names).toHaveLength(3);
    expect(names.every(({ args }) => args[1] === 94)).toBe(true);
    const details = draws.filter(({ args, font }) => args[1] === 94 && !font.startsWith('700 '));
    const last = details[details.length - 1];
    const detailSize = Number(/([\d.]+)px/.exec(last.font)[1]);
    const listBottom = (format === 'story' ? 1920 : 1080) - 210;
    expect(last.args[2] + detailSize * 1.25 + 24).toBeCloseTo(listBottom);
    expect(names[1].args[2] - names[0].args[2]).toBeCloseTo(names[2].args[2] - names[1].args[2]);
});
