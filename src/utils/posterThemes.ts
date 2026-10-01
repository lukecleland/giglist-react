import { PosterTextEffect } from "./posterTextEffects";
export type PosterFont = "Poster Condensed" | "Poster Serif" | "Poster Grotesk" | "Bebas Neue" | "Oswald" | "Abril Fatface" | "Righteous" | "Bitter" | "Outfit" | "Rye" | "Sancreek" | "Ewert";

export type PosterTheme = {
    id: string; name: string; description: string;
    background: string; ink: string; accent: string;
    font: PosterFont;
    artwork: string[];
    layout?: "sleeve" | "window" | "frame" | "masthead" | "horizon" | "split" | "rail" | "ticket" | "cover" | "collage";
    alternate?: boolean;
};

export const posterThemes: PosterTheme[] = [
    { id: "nocturne", name: "Into the Wild / Cinematic rock", description: "Full-bleed wilderness photography, towering ivory type and tour dates fading out of the landscape.", background: "#111c1d", ink: "#f5f0dc", accent: "#d4dca0", font: "Poster Condensed", artwork: ["sunrisepeaks", "forestbridge", "lavenderlake", "layeredhills", "tropical", "goldenmeadow", "aurora", "starlit", "waterfall", "waves", "mistcastle", "leaves", "ferns", "nebula", "mountains", "forest", "ocean", "galaxy", "earth", "starcloud", "mist", "alpine", "sunridge", "canopy", "woodland", "art90316", "art87008", "art76395", "inkflow"] },
    { id: "wildflower", name: "Wildflower / Acoustic & indie folk", description: "Warm paper, expressive serif lettering and intimate acoustic, small-room or botanical imagery.", background: "#eee9dc", ink: "#272d21", accent: "#6c713f", font: "Poster Serif", artwork: ["travellingguitar", "pianoroom", "vinyl", "forestbridge", "goldenmeadow", "layeredhills", "acousticroom", "pianokeys", "microphone", "coffeehouse", "saxophone", "waterfall", "leaves", "ferns", "coast", "acoustic", "waves", "art25110", "flowers", "forest", "palms", "woodland", "canopy", "mist", "alpine", "sunridge", "art21720", "art76395", "art8980", "art129849", "paint", "pigment"] },
    { id: "xerox", name: "Feedback / DIY punk", description: "Photocopied live-show imagery, acid-yellow overprint and rough paper with tightly set dates.", background: "#eeeade", ink: "#191a18", accent: "#555944", font: "Poster Condensed", artwork: ["electricguitar", "guitarist", "drums", "vinyl", "sunrisepeaks", "tropical", "citylights", "gigcrowd", "acoustic", "mistcastle", "redcanyon", "concertlights", "crowd", "night", "forest", "purplegig", "soundstage", "earth", "canopy", "woodland", "art47398", "art90316", "art8991", "art8983", "paint", "canvas"] },
    { id: "solar", name: "Heatwave / Desert rock", description: "Vermilion paper, a widescreen desert photograph and oversized black festival lettering.", background: "#dc633e", ink: "#291c1b", accent: "#492521", font: "Poster Condensed", artwork: ["electricguitar", "guitarist", "drums", "vinyl", "sunrisepeaks", "tropical", "dunes", "redcanyon", "coast", "waves", "gigcrowd", "art8991", "desert", "palms", "mountains", "goldenland", "sunridge", "inkflow", "pigment", "art8987", "art8983", "art129849", "art87008", "art24645", "purplegig", "soundstage"] },
    { id: "bluehour", name: "Blue Hour / Jazz & dream pop", description: "Midnight-blue photography, intimate instruments and floating serif lettering for jazz rooms and dream-pop gigs.", background: "#101c37", ink: "#f0e7ea", accent: "#b8c5f1", font: "Poster Serif", artwork: ["pianoroom", "vinyl", "drums", "electricguitar", "lavenderlake", "pianokeys", "microphone", "saxophone", "acousticroom", "acoustic", "coffeehouse", "aurora", "starlit", "citylights", "mistcastle", "waves", "waterfall", "art24645", "night", "ocean", "forest", "galaxy", "nebula", "earth", "starcloud", "mist", "violet", "colourwash", "canvas", "inkflow", "art76395", "art90316", "concertlights"] },
    { id: "redroom", name: "Red Room / Post-punk", description: "A stark red-and-black photographic split, massive condensed type and an asymmetric date column.", background: "#b62924", ink: "#fff0db", accent: "#ffcfaa", font: "Poster Condensed", artwork: ["electricguitar", "guitarist", "drums", "vinyl", "sunrisepeaks", "tropical", "gigcrowd", "citylights", "acoustic", "redcanyon", "mistcastle", "art8987", "crowd", "forest", "night", "concertlights", "purplegig", "soundstage", "inkflow", "canvas", "pigment", "art8991", "art8983", "art47398", "art24645", "goldenland"] },
    {"id": "fireside", "name": "Fireside / Acoustic sessions", "description": "Record-sleeve photograph, compact title and an open schedule beneath.", "background": "#e9ddc5", "ink": "#30241c", "accent": "#795239", "font": "Poster Serif", "artwork": ["travellingguitar", "pianoroom", "vinyl", "forestbridge", "goldenmeadow", "layeredhills", "acousticroom", "acoustic", "coffeehouse", "pianokeys", "microphone", "saxophone", "coast", "leaves", "ferns"], "layout": "sleeve", "alternate": false},
    {"id": "softfocus", "name": "Soft Focus / Singer-songwriter", "description": "Framed photographic window, expressive heading and a clear date field.", "background": "#d9dfd2", "ink": "#263c34", "accent": "#506947", "font": "Poster Serif", "artwork": ["travellingguitar", "pianoroom", "vinyl", "forestbridge", "goldenmeadow", "layeredhills", "leaves", "acousticroom", "flowers", "coast", "pianokeys", "microphone", "coffeehouse", "saxophone", "acoustic"], "layout": "window", "alternate": true},
    {"id": "parlour", "name": "The Parlour / Piano evenings", "description": "Inset photography, fine double rules and a spacious club-poster title.", "background": "#251e25", "ink": "#f5e7d4", "accent": "#d5ad77", "font": "Poster Serif", "artwork": ["pianoroom", "vinyl", "drums", "electricguitar", "lavenderlake", "pianokeys", "microphone", "acousticroom", "coffeehouse", "saxophone", "travellingguitar", "forestbridge", "goldenmeadow", "layeredhills", "acoustic"], "layout": "frame", "alternate": false},
    {"id": "sundaypaper", "name": "Sunday Paper / Folk", "description": "Bold newspaper-style masthead, photo strip and tightly arranged gig dates.", "background": "#f3eee0", "ink": "#202820", "accent": "#5b6752", "font": "Poster Grotesk", "artwork": ["travellingguitar", "pianoroom", "vinyl", "forestbridge", "goldenmeadow", "layeredhills", "acoustic", "coffeehouse", "ferns", "woodland", "acousticroom", "pianokeys", "microphone", "saxophone", "coast"], "layout": "masthead", "alternate": false},
    {"id": "slowcoast", "name": "Slow Coast / Coastal acoustic", "description": "Panoramic image band with title and month held together above the dates.", "background": "#dce8e4", "ink": "#173f46", "accent": "#396b72", "font": "Poster Serif", "artwork": ["travellingguitar", "pianoroom", "vinyl", "forestbridge", "goldenmeadow", "layeredhills", "coast", "waves", "ocean", "acousticroom", "pianokeys", "microphone", "coffeehouse", "saxophone", "acoustic"], "layout": "horizon", "alternate": false},
    {"id": "amberroom", "name": "Amber Room / Soul & jazz", "description": "Offset photography and a contrasting vertical column of gig dates.", "background": "#d99943", "ink": "#261b16", "accent": "#513024", "font": "Poster Condensed", "artwork": ["pianoroom", "vinyl", "drums", "electricguitar", "lavenderlake", "saxophone", "microphone", "pianokeys", "acousticroom", "coffeehouse", "travellingguitar", "forestbridge", "goldenmeadow", "layeredhills", "acoustic"], "layout": "split", "alternate": false},
    {"id": "afterhours", "name": "After Hours / Jazz club", "description": "Strong colour rail, monochrome photography and asymmetric type.", "background": "#121d26", "ink": "#eae5d4", "accent": "#79bcb9", "font": "Poster Serif", "artwork": ["pianoroom", "vinyl", "drums", "electricguitar", "lavenderlake", "saxophone", "pianokeys", "citylights", "microphone", "acousticroom", "coffeehouse", "travellingguitar", "forestbridge", "goldenmeadow", "layeredhills"], "layout": "rail", "alternate": false},
    {"id": "bluenote", "name": "Blue Note / Modern jazz", "description": "Ticket-inspired framing, numbered edge marks and warm photographic detail.", "background": "#e5e6ce", "ink": "#123e78", "accent": "#315d81", "font": "Poster Grotesk", "artwork": ["pianoroom", "vinyl", "drums", "electricguitar", "lavenderlake", "saxophone", "pianokeys", "microphone", "acousticroom", "coffeehouse", "travellingguitar", "forestbridge", "goldenmeadow", "layeredhills", "acoustic"], "layout": "ticket", "alternate": false},
    {"id": "velvet", "name": "Velvet / Lounge sessions", "description": "Full-page imagery, floating title and a deep tonal fade beneath the listings.", "background": "#311929", "ink": "#fff0df", "accent": "#e2adad", "font": "Poster Serif", "artwork": ["pianoroom", "vinyl", "drums", "electricguitar", "lavenderlake", "microphone", "pianokeys", "saxophone", "violet", "acousticroom", "coffeehouse", "travellingguitar", "forestbridge", "goldenmeadow", "layeredhills"], "layout": "cover", "alternate": true},
    {"id": "contactsheet", "name": "Contact Sheet / Indie rock", "description": "Cropped photographic strips, contrasting title block and compact gig columns.", "background": "#eae4d4", "ink": "#232121", "accent": "#59524c", "font": "Poster Grotesk", "artwork": ["electricguitar", "guitarist", "drums", "vinyl", "sunrisepeaks", "tropical", "citylights", "acoustic", "gigcrowd", "soundstage", "concertlights", "purplegig", "inkflow", "paint", "redcanyon"], "layout": "collage", "alternate": false},
    {"id": "signal", "name": "Signal / Alternative", "description": "Strong colour rail, monochrome photography and asymmetric type.", "background": "#dcf069", "ink": "#202516", "accent": "#435128", "font": "Poster Condensed", "artwork": ["electricguitar", "guitarist", "drums", "vinyl", "sunrisepeaks", "tropical", "citylights", "concertlights", "inkflow", "gigcrowd", "purplegig", "soundstage", "paint", "redcanyon", "dunes"], "layout": "rail", "alternate": true},
    {"id": "nightdrive", "name": "Night Drive / Dream pop", "description": "Panoramic image band with title and month held together above the dates.", "background": "#131936", "ink": "#eee4f5", "accent": "#bda8eb", "font": "Poster Grotesk", "artwork": ["sunrisepeaks", "forestbridge", "lavenderlake", "layeredhills", "tropical", "goldenmeadow", "citylights", "aurora", "starlit", "night", "electricguitar", "guitarist", "drums", "vinyl", "gigcrowd"], "layout": "horizon", "alternate": true},
    {"id": "daybreak", "name": "Daybreak / Indie folk", "description": "Offset photography and a contrasting vertical column of gig dates.", "background": "#eed3bd", "ink": "#582e30", "accent": "#88524c", "font": "Poster Serif", "artwork": ["sunrisepeaks", "forestbridge", "lavenderlake", "layeredhills", "tropical", "goldenmeadow", "sunridge", "coast", "flowers", "goldenland", "acousticroom", "pianokeys", "microphone", "coffeehouse", "saxophone"], "layout": "split", "alternate": true},
    {"id": "fieldnotes", "name": "Field Notes / Roots music", "description": "Ticket-inspired framing, numbered edge marks and warm photographic detail.", "background": "#e0d5ad", "ink": "#324331", "accent": "#667043", "font": "Poster Serif", "artwork": ["travellingguitar", "pianoroom", "vinyl", "forestbridge", "goldenmeadow", "layeredhills", "acousticroom", "ferns", "forest", "pianokeys", "microphone", "coffeehouse", "saxophone", "acoustic", "coast"], "layout": "ticket", "alternate": true},
    {"id": "desertbloom", "name": "Desert Bloom / Roots rock", "description": "Framed photographic window, expressive heading and a clear date field.", "background": "#ae482f", "ink": "#fff0d2", "accent": "#f4c079", "font": "Poster Condensed", "artwork": ["sunrisepeaks", "forestbridge", "lavenderlake", "layeredhills", "tropical", "goldenmeadow", "dunes", "redcanyon", "desert", "palms", "electricguitar", "guitarist", "drums", "vinyl", "gigcrowd"], "layout": "window", "alternate": false},
    {"id": "moonlit", "name": "Moonlit / Atmospheric", "description": "Inset photography, fine double rules and a spacious club-poster title.", "background": "#111d32", "ink": "#e7eced", "accent": "#9bbdd9", "font": "Poster Grotesk", "artwork": ["sunrisepeaks", "forestbridge", "lavenderlake", "layeredhills", "tropical", "goldenmeadow", "starlit", "aurora", "nebula", "mistcastle", "electricguitar", "guitarist", "drums", "vinyl", "gigcrowd"], "layout": "frame", "alternate": true},
    {"id": "cutpaste", "name": "Cut & Paste / Garage rock", "description": "Cropped photographic strips, contrasting title block and compact gig columns.", "background": "#e5a8b7", "ink": "#291b2a", "accent": "#5c324a", "font": "Poster Condensed", "artwork": ["electricguitar", "guitarist", "drums", "vinyl", "sunrisepeaks", "tropical", "gigcrowd", "citylights", "concertlights", "paint", "purplegig", "soundstage", "inkflow", "redcanyon", "dunes"], "layout": "collage", "alternate": true},
    {"id": "loudtype", "name": "Loud Type / Live bands", "description": "Bold newspaper-style masthead, photo strip and tightly arranged gig dates.", "background": "#f0df4e", "ink": "#22211b", "accent": "#5d5029", "font": "Poster Condensed", "artwork": ["electricguitar", "guitarist", "drums", "vinyl", "sunrisepeaks", "tropical", "soundstage", "gigcrowd", "purplegig", "microphone", "citylights", "concertlights", "inkflow", "paint", "redcanyon"], "layout": "masthead", "alternate": true},
    {"id": "evergreen", "name": "Evergreen / Unplugged", "description": "Record-sleeve photograph, compact title and an open schedule beneath.", "background": "#17362c", "ink": "#f2edce", "accent": "#b9cf93", "font": "Poster Grotesk", "artwork": ["travellingguitar", "pianoroom", "vinyl", "forestbridge", "goldenmeadow", "layeredhills", "ferns", "acousticroom", "waterfall", "leaves", "pianokeys", "microphone", "coffeehouse", "saxophone", "acoustic"], "layout": "sleeve", "alternate": true},
    {"id": "ultraviolet", "name": "Ultraviolet / Psychedelic", "description": "Full-page imagery, floating title and a deep tonal fade beneath the listings.", "background": "#261944", "ink": "#f4e4ff", "accent": "#deb0ff", "font": "Poster Condensed", "artwork": ["electricguitar", "guitarist", "drums", "vinyl", "sunrisepeaks", "tropical", "inkflow", "violet", "colourwash", "art8991", "gigcrowd", "citylights", "concertlights", "purplegig", "soundstage"], "layout": "cover", "alternate": false},
];

export const randomPosterTheme = (current: string, random = Math.random): string => {
    const choices = posterThemes.filter((theme) => theme.id !== current);
    return choices[Math.floor(random() * choices.length)].id;
};

export const nextPosterArtwork = (themeId: string, current: string, random = Math.random): string => {
    const theme = posterThemes.find((item) => item.id === themeId) || posterThemes[0];
    const choices = theme.artwork.filter((name) => name !== current);
    return choices[Math.floor(random() * choices.length)] || theme.artwork[0];
};

export type PosterFonts = { title: PosterTheme['font']; listing: PosterTheme['font']; effect?: PosterTextEffect; headerEffect?: PosterTextEffect };
export const posterFontPairings: PosterFonts[] = [
    {title: 'Poster Condensed', listing: 'Poster Grotesk'},
    {title: 'Poster Serif', listing: 'Poster Grotesk'},
    {title: 'Poster Grotesk', listing: 'Poster Grotesk'},
    {title: 'Poster Condensed', listing: 'Poster Serif'},
    {title: 'Poster Serif', listing: 'Poster Serif'},
    {title: 'Poster Grotesk', listing: 'Poster Serif'},
    {title: 'Bebas Neue', listing: 'Outfit'},
    {title: 'Oswald', listing: 'Poster Grotesk'},
    {title: 'Abril Fatface', listing: 'Outfit'},
    {title: 'Righteous', listing: 'Poster Grotesk'},
    {title: 'Bitter', listing: 'Outfit'},
    {title: 'Outfit', listing: 'Bitter'},
    {title: 'Bebas Neue', listing: 'Bitter'},
    {title: 'Oswald', listing: 'Outfit'},
    {title: 'Abril Fatface', listing: 'Bitter'},
    {title: 'Righteous', listing: 'Outfit'},
    {title: 'Bitter', listing: 'Poster Grotesk'},
    {title: 'Outfit', listing: 'Outfit'},
    {title: 'Rye', listing: 'Rye'},
    {title: 'Sancreek', listing: 'Sancreek'},
    {title: 'Ewert', listing: 'Ewert'},
    {title: 'Rye', listing: 'Outfit'},
    {title: 'Sancreek', listing: 'Bitter'},
];
export const nextPosterFonts = (current: PosterFonts, random = Math.random): PosterFonts => {
    const choices = posterFontPairings.filter((pair) => pair.title !== current.title || pair.listing !== current.listing);
    const pair = choices[Math.floor(random() * choices.length)];
    const effects: PosterTextEffect[] = ['plain', 'outline', 'shadow', 'outlineShadow'];
    return {...pair, effect: effects[Math.floor(random() * effects.length)], headerEffect: effects[Math.floor(random() * effects.length)]};
};

const posterFontFamilies = Array.from(new Set(posterFontPairings.flatMap(pair => [pair.title, pair.listing])));
const shuffledEffect = (random: () => number): PosterTextEffect =>
    (['plain', 'outline', 'shadow', 'outlineShadow'] as PosterTextEffect[])[Math.floor(random() * 4)];
export const nextListingFonts = (current: PosterFonts, random = Math.random): PosterFonts => {
    const choices = posterFontFamilies.filter(font => font !== current.listing);
    return {...current, listing: choices[Math.floor(random() * choices.length)], effect: shuffledEffect(random)};
};
export const nextHeaderFonts = (current: PosterFonts, random = Math.random): PosterFonts => {
    const choices = posterFontFamilies.filter(font => font !== current.title);
    return {...current, title: choices[Math.floor(random() * choices.length)], headerEffect: shuffledEffect(random)};
};
