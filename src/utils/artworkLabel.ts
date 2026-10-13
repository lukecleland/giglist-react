const names: Record<string, string> = {
    electricguitar: 'Electric Guitar', pianoroom: 'Piano Room', travellingguitar: 'Travelling Guitar',
    sunrisepeaks: 'Sunrise Peaks', forestbridge: 'Forest Bridge', goldenmeadow: 'Golden Meadow',
    lavenderlake: 'Lavender Lake', layeredhills: 'Layered Hills', pianokeys: 'Piano Keys',
    acousticroom: 'Acoustic Room', coffeehouse: 'Coffee House', citylights: 'City Lights',
    redcanyon: 'Red Canyon', gigcrowd: 'Gig Crowd', mistcastle: 'Mist Castle',
    colourwash: 'Colour Wash', concertlights: 'Concert Lights', goldenland: 'Golden Land',
    inkflow: 'Ink Flow', purplegig: 'Purple Gig', soundstage: 'Sound Stage',
    starcloud: 'Star Cloud', sunridge: 'Sun Ridge',
};

export const artworkLabel = (key: string): string => names[key] || key
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());
