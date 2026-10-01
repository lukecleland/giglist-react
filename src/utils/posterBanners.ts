import { PosterFonts } from './posterThemes';

export const bannerNames = {
    'glass-centered': 'Stained glass',
    'western-centered': 'Western engraving',
    'botanical-centered': 'Botanical folk',
    'sunburst-centered': 'Sunburst print',
    'waves-centered': 'Psychedelic ribbons',
    'mosaic-centered': 'Modernist mosaic',
    'paper-centered': 'Cut-paper collage',
    'orbit-centered': 'Cosmic orbits',
    'scallop-centered': 'Art deco fans',
    'contour-centered': 'Contour engraving',
    'floral-centered': 'Flower power',
    'lightning-centered': 'Electric zigzag',
} as const;
export type ArtworkBanner = keyof typeof bannerNames;
export const isArtworkBanner = (value: string): value is ArtworkBanner => value in bannerNames;

// Listing panels take their colours from the selected illustration, not the
// independently selected page theme. Dark shades keep translucent panels legible.
export const bannerListingColours: Record<ArtworkBanner, {backdrop: string; ink: string; accent: string}> = {
    'glass-centered': {backdrop: '#643b70dd', ink: '#fff7e7', accent: '#f6c94c'},
    'western-centered': {backdrop: '#59371fdd', ink: '#fff7e7', accent: '#f0c38a'},
    'botanical-centered': {backdrop: '#164d43dd', ink: '#fff7e7', accent: '#f5da86'},
    'sunburst-centered': {backdrop: '#743022dd', ink: '#fff7e7', accent: '#f6c94c'},
    'waves-centered': {backdrop: '#643b70dd', ink: '#fff7e7', accent: '#f6c94c'},
    'mosaic-centered': {backdrop: '#194758dd', ink: '#fff7e7', accent: '#f6c94c'},
    'paper-centered': {backdrop: '#713222dd', ink: '#fff7e7', accent: '#f5e7c6'},
    'orbit-centered': {backdrop: '#202f64dd', ink: '#fff7e7', accent: '#f6c94c'},
    'scallop-centered': {backdrop: '#643b70dd', ink: '#fff7e7', accent: '#f6c94c'},
    'contour-centered': {backdrop: '#793945dd', ink: '#fff0ce', accent: '#ffc99d'},
    'floral-centered': {backdrop: '#633b59dd', ink: '#fff7e7', accent: '#ffd4df'},
    'lightning-centered': {backdrop: '#243983dd', ink: '#fff7e7', accent: '#f6c94c'},
};

export const bannerFonts = (header: string, current: PosterFonts): PosterFonts => {
    const pairs: Partial<Record<ArtworkBanner, Pick<PosterFonts, 'title' | 'headerEffect'>>> = {
        'glass-centered': {title: 'Sancreek', headerEffect: 'outlineShadow'},
        'western-centered': {title: 'Rye', headerEffect: 'shadow'},
        'botanical-centered': {title: 'Poster Serif', headerEffect: 'plain'},
        'sunburst-centered': {title: 'Righteous', headerEffect: 'outlineShadow'},
    };
    return isArtworkBanner(header) ? {...current, ...pairs[header]} : current;
};

// Full-colour original vector artwork; text outlines provide contrast.
export function drawArtworkBanner(ctx: CanvasRenderingContext2D, style: ArtworkBanner, y: number, height: number, field: string, ink: string, accent: string) {
    ctx.save();
    ctx.beginPath(); ctx.rect(0, y, 1600, height); ctx.clip();
    const colours = ['#f6c94c', '#ea593e', '#276d88', '#f5e7c6', '#643b70'];
    ctx.fillStyle = accent; ctx.fillRect(0, y, 1600, height);
    const path = (points: number[][], color: string, stroke = field, weight = 4) => {
        ctx.beginPath(); points.forEach(([x, py], i) => i ? ctx.lineTo(x, py) : ctx.moveTo(x, py));
        ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = weight; ctx.stroke();
    };
    const rule = (x: number, py: number, width: number, color = accent, weight = 2) => {
        ctx.fillStyle = color; ctx.fillRect(x, py, width, weight);
    };
    if (style === 'glass-centered' || style === 'sunburst-centered') {
        // Radial fragments, not a borrowed festival logo or raster image.
        for (let i = 0; i < 36; i++) {
            const a = i * Math.PI / 18, b = (i + 1) * Math.PI / 18;
            path([[800, y + height * .7], [800 + Math.cos(a) * 2000, y + height * .7 + Math.sin(a) * 2000], [800 + Math.cos(b) * 2000, y + height * .7 + Math.sin(b) * 2000]], colours[i % colours.length], field, style === 'glass-centered' ? 7 : 0);
        }
        if (style === 'glass-centered') {
            for (const x of [27, 1573]) {
                for (let py = y + 24; py < y + height; py += 44) {
                    path([[x, py - 15], [x + 17, py], [x, py + 15], [x - 17, py]], ink);
                }
            }
        }

    } else if (style === 'waves-centered') {
        for (let row = -3; row < 14; row++) {
            const points = [];
            for (let x = 0; x <= 1600; x += 12) points.push([x, y + row * height / 8 + Math.sin(x / 150 + row * .55) * height * .25]);
            for (let x = 1600; x >= 0; x -= 12) points.push([x, y + (row + 1) * height / 8 + Math.sin(x / 150 + (row + 1) * .55) * height * .25]);
            path(points, colours[(row + 15) % colours.length], field, 1);
        }
    } else if (style === 'mosaic-centered' || style === 'paper-centered') {
        const tile = style === 'mosaic-centered' ? 110 : 240;
        for (let row = 0; row < height / tile + 1; row++) for (let col = 0; col < 1600 / tile; col++) {
            const x = col * tile, py = y + row * tile;
            path([[x,py],[x+tile,py],[x+tile,py+tile],[x,py+tile]],colours[(row+col)%5],field,style === 'mosaic-centered' ? 4 : 0);
            path([[x,py],[x+tile,py+tile*.2],[x+tile*.35,py+tile]],colours[(row+col+2)%5],field,0);
        }
    } else if (style === 'orbit-centered') {
        ctx.fillStyle = '#283d83'; ctx.fillRect(0,y,1600,height);
        for (let i = 0; i < 16; i++) {
            ctx.beginPath(); ctx.ellipse(800,y+height/2,100+i*58,25+i*18,-.25,0,Math.PI*2);
            ctx.strokeStyle = colours[i%5]; ctx.lineWidth = i%3 === 0 ? 10 : 3; ctx.stroke();
        }
    } else if (style === 'scallop-centered') {
        for (let row = -1; row < height/95; row++) for (let col = -1; col < 11; col++) {
            const x = col*170+(row%2)*85, py = y+row*95;
            for (let r = 80; r > 0; r -= 16) {
                ctx.beginPath(); ctx.arc(x,py,r,0,Math.PI); ctx.fillStyle=colours[(r/16+row+6)%5]; ctx.fill();
            }
        }
    } else if (style === 'contour-centered') {
        ctx.fillStyle='#df754c'; ctx.fillRect(0,y,1600,height);
        for (let row = -8; row < height/13+8; row++) {
            ctx.beginPath();
            for(let x=0;x<=1600;x+=8) {
                const py=y+row*13+Math.sin(x/130+row*.12)*45+Math.cos(x/310)*25;
                if(x===0)ctx.moveTo(x,py);else ctx.lineTo(x,py);
            }
            ctx.strokeStyle=row%3===0?'#fff0ce':'#793945';ctx.lineWidth=3;ctx.stroke();
        }
    } else if (style === 'floral-centered') {
        ctx.fillStyle='#ef9eae';ctx.fillRect(0,y,1600,height);
        for(let x=70;x<1600;x+=180) {
            const cy=y+height*(x%360<180?.35:.7);
            for(let petal=0;petal<8;petal++) {
                const angle=petal*Math.PI/4;
                ctx.beginPath();ctx.ellipse(x+Math.cos(angle)*38,cy+Math.sin(angle)*38,34,17,angle,0,Math.PI*2);ctx.fillStyle=colours[Math.floor(x/180)%5];ctx.fill();
            }
            ctx.beginPath();ctx.arc(x,cy,19,0,Math.PI*2);ctx.fillStyle='#f6c94c';ctx.fill();
        }
    } else if (style === 'lightning-centered') {
        ctx.fillStyle='#304eb7';ctx.fillRect(0,y,1600,height);
        for(let x=-200;x<1800;x+=210) path([[x,y],[x+140,y],[x+30,y+height*.55],[x+140,y+height*.55],[x-60,y+height],[x+5,y+height*.4],[x-80,y+height*.4]],colours[(Math.floor((x+200)/210))%5],field,3);
    } else if (style === 'western-centered') {
        ctx.fillStyle='#d59651';ctx.fillRect(0,y,1600,height);
        accent=field; ink=field;
        ctx.strokeStyle = accent;
        for (const inset of [12, 20]) { ctx.lineWidth = inset === 12 ? 3 : 1; ctx.strokeRect(inset, y + inset, 1600 - inset * 2, height - inset * 2); }
        for (let x = 40; x < 1580; x += 24) {
            path([[x,y+9],[x+5,y+15],[x,y+21],[x-5,y+15]], accent, field, 1);
        }
        for (const x of [35, 1565]) {
            for (const py of [y+37, y+height-37]) {
                ctx.beginPath(); ctx.arc(x,py,13,0,Math.PI*2); ctx.strokeStyle=accent; ctx.lineWidth=2; ctx.stroke();
                path([[x,py-8],[x+8,py],[x,py+8],[x-8,py]], ink, field, 1);
            }
        }
        rule(240,y+height-10,1120,accent,1);
    } else {
        ctx.fillStyle='#247969';ctx.fillRect(0,y,1600,height);
        accent='#f5da86';
        rule(70,y+14,1460,accent,1); rule(70,y+height-10,1460,accent,1);
        for (const right of [false, true]) {
            const x = right ? 1570 : 30;
            ctx.beginPath(); ctx.moveTo(x,y+18); ctx.lineTo(x,y+height-18); ctx.strokeStyle=accent; ctx.lineWidth=2; ctx.stroke();
            for (let py=y+34; py<y+height-22; py+=25) {
                ctx.beginPath(); ctx.ellipse(x-10,py,6,14,-.55,0,Math.PI*2); ctx.ellipse(x+10,py+8,6,14,.55,0,Math.PI*2); ctx.fillStyle=accent; ctx.fill();
            }
        }
    }
    ctx.restore();
}
