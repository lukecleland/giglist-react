export type PosterTheme = {
    id: string; name: string; description: string;
    background: string; ink: string; accent: string;
    font: "Poster Condensed" | "Poster Serif" | "Poster Grotesk";
    artwork: string[];
};

export const posterThemes: PosterTheme[] = [
    { id: "nocturne", name: "Into the Wild / Cinematic rock", description: "Full-bleed wilderness photography, towering ivory type and tour dates fading out of the landscape.", background: "#111c1d", ink: "#f5f0dc", accent: "#d4dca0", font: "Poster Condensed", artwork: ["nebula", "mountains", "forest", "ocean", "galaxy", "earth", "starcloud", "mist", "alpine", "sunridge", "canopy", "woodland", "art90316", "art87008", "art76395", "inkflow"] },
    { id: "wildflower", name: "Wildflower / Indie folk", description: "Oversized editorial serif, warm paper and a tall botanical photograph beside an intimate gig schedule.", background: "#eee9dc", ink: "#272d21", accent: "#6c713f", font: "Poster Serif", artwork: ["art25110", "flowers", "forest", "palms", "woodland", "canopy", "mist", "alpine", "sunridge", "art21720", "art76395", "art8980", "art129849", "paint", "pigment"] },
    { id: "xerox", name: "Feedback / DIY punk", description: "Photocopied live-show imagery, acid-yellow overprint and rough paper with tightly set dates.", background: "#eeeade", ink: "#191a18", accent: "#555944", font: "Poster Condensed", artwork: ["concertlights", "crowd", "night", "forest", "purplegig", "soundstage", "earth", "canopy", "woodland", "art47398", "art90316", "art8991", "art8983", "paint", "canvas"] },
    { id: "solar", name: "Heatwave / Desert rock", description: "Vermilion paper, a widescreen desert photograph and oversized black festival lettering.", background: "#dc633e", ink: "#291c1b", accent: "#492521", font: "Poster Condensed", artwork: ["art8991", "desert", "palms", "mountains", "goldenland", "sunridge", "inkflow", "pigment", "art8987", "art8983", "art129849", "art87008", "art24645", "purplegig", "soundstage"] },
    { id: "bluehour", name: "Blue Hour / Dream pop", description: "Immersive blue photography, floating serif lettering and a quiet midnight-blue tour programme.", background: "#101c37", ink: "#f0e7ea", accent: "#b8c5f1", font: "Poster Serif", artwork: ["art24645", "night", "ocean", "forest", "galaxy", "nebula", "earth", "starcloud", "mist", "violet", "colourwash", "canvas", "inkflow", "art76395", "art90316", "concertlights"] },
    { id: "redroom", name: "Red Room / Post-punk", description: "A stark red-and-black photographic split, massive condensed type and an asymmetric date column.", background: "#b62924", ink: "#fff0db", accent: "#ffcfaa", font: "Poster Condensed", artwork: ["art8987", "crowd", "forest", "night", "concertlights", "purplegig", "soundstage", "inkflow", "canvas", "pigment", "art8991", "art8983", "art47398", "art24645", "goldenland"] },
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

export type PosterFonts = { title: PosterTheme['font']; listing: PosterTheme['font'] };
export const posterFontPairings: PosterFonts[] = [
    {title: 'Poster Condensed', listing: 'Poster Grotesk'},
    {title: 'Poster Serif', listing: 'Poster Grotesk'},
    {title: 'Poster Grotesk', listing: 'Poster Grotesk'},
    {title: 'Poster Condensed', listing: 'Poster Serif'},
    {title: 'Poster Serif', listing: 'Poster Serif'},
    {title: 'Poster Grotesk', listing: 'Poster Serif'},
];
export const nextPosterFonts = (current: PosterFonts, random = Math.random): PosterFonts => {
    const choices = posterFontPairings.filter((pair) => pair.title !== current.title || pair.listing !== current.listing);
    return choices[Math.floor(random() * choices.length)];
};
