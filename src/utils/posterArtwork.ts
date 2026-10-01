import electricguitar from '../assets/posters/electricguitar.jpg';
import guitarist from '../assets/posters/guitarist.jpg';
import vinyl from '../assets/posters/vinyl.jpg';
import drums from '../assets/posters/drums.jpg';
import pianoroom from '../assets/posters/pianoroom.jpg';
import travellingguitar from '../assets/posters/travellingguitar.jpg';
import tropical from '../assets/posters/tropical.jpg';
import sunrisepeaks from '../assets/posters/sunrisepeaks.jpg';
import forestbridge from '../assets/posters/forestbridge.jpg';
import goldenmeadow from '../assets/posters/goldenmeadow.jpg';
import lavenderlake from '../assets/posters/lavenderlake.jpg';
import layeredhills from '../assets/posters/layeredhills.jpg';
import pianokeys from '../assets/posters/pianokeys.jpg';
import acousticroom from '../assets/posters/acousticroom.jpg';
import microphone from '../assets/posters/microphone.jpg';
import saxophone from '../assets/posters/saxophone.jpg';
import coffeehouse from '../assets/posters/coffeehouse.jpg';
import aurora from '../assets/posters/aurora.jpg';
import starlit from '../assets/posters/starlit.jpg';
import waves from '../assets/posters/waves.jpg';
import waterfall from '../assets/posters/waterfall.jpg';
import citylights from '../assets/posters/citylights.jpg';
import coast from '../assets/posters/coast.jpg';
import dunes from '../assets/posters/dunes.jpg';
import redcanyon from '../assets/posters/redcanyon.jpg';
import leaves from '../assets/posters/leaves.jpg';
import ferns from '../assets/posters/ferns.jpg';
import gigcrowd from '../assets/posters/gigcrowd.jpg';
import acoustic from '../assets/posters/acoustic.jpg';
import mistcastle from '../assets/posters/mistcastle.jpg';
import alpine from '../assets/posters/alpine.jpg';
import art129849 from '../assets/posters/art129849.jpg';
import art21720 from '../assets/posters/art21720.jpg';
import art24645 from '../assets/posters/art24645.jpg';
import art25110 from '../assets/posters/art25110.jpg';
import art47398 from '../assets/posters/art47398.jpg';
import art76395 from '../assets/posters/art76395.jpg';
import art87008 from '../assets/posters/art87008.jpg';
import art8980 from '../assets/posters/art8980.jpg';
import art8983 from '../assets/posters/art8983.jpg';
import art8987 from '../assets/posters/art8987.jpg';
import art8991 from '../assets/posters/art8991.jpg';
import art90316 from '../assets/posters/art90316.jpg';
import canopy from '../assets/posters/canopy.jpg';
import canvas from '../assets/posters/canvas.jpg';
import colourwash from '../assets/posters/colourwash.jpg';
import concertlights from '../assets/posters/concertlights.jpg';
import crowd from '../assets/posters/crowd.jpg';
import desert from '../assets/posters/desert.jpg';
import earth from '../assets/posters/earth.jpg';
import flowers from '../assets/posters/flowers.jpg';
import forest from '../assets/posters/forest.jpg';
import galaxy from '../assets/posters/galaxy.jpg';
import goldenland from '../assets/posters/goldenland.jpg';
import inkflow from '../assets/posters/inkflow.jpg';
import mist from '../assets/posters/mist.jpg';
import mountains from '../assets/posters/mountains.jpg';
import nebula from '../assets/posters/nebula.jpg';
import night from '../assets/posters/night.jpg';
import ocean from '../assets/posters/ocean.jpg';
import paint from '../assets/posters/paint.jpg';
import palms from '../assets/posters/palms.jpg';
import pigment from '../assets/posters/pigment.jpg';
import purplegig from '../assets/posters/purplegig.jpg';
import soundstage from '../assets/posters/soundstage.jpg';
import starcloud from '../assets/posters/starcloud.jpg';
import sunridge from '../assets/posters/sunridge.jpg';
import violet from '../assets/posters/violet.jpg';
import woodland from '../assets/posters/woodland.jpg';

export const posterArtwork: Record<string, string> = {electricguitar, guitarist, vinyl, drums, pianoroom, travellingguitar, tropical, sunrisepeaks, forestbridge, goldenmeadow, lavenderlake, layeredhills, pianokeys, acousticroom, microphone, saxophone, coffeehouse, aurora, starlit, waves, waterfall, citylights, coast, dunes, redcanyon, leaves, ferns, gigcrowd, acoustic, mistcastle, alpine, art129849, art21720, art24645, art25110, art47398, art76395, art87008, art8980, art8983, art8987, art8991, art90316, canopy, canvas, colourwash, concertlights, crowd, desert, earth, flowers, forest, galaxy, goldenland, inkflow, mist, mountains, nebula, night, ocean, paint, palms, pigment, purplegig, soundstage, starcloud, sunridge, violet, woodland};

export const posterImageSource = (src: string, development = process.env.NODE_ENV === 'development'): string => {
    if (!development) return src;
    try {
        const url = new URL(src);
        if (['giglist.com.au', 'www.giglist.com.au'].includes(url.hostname) &&
            url.pathname.startsWith('/wp-content/uploads/') && /\.(jpe?g|png|webp|gif)$/i.test(url.pathname)) {
            return url.pathname + url.search;
        }
    } catch { /* Bundled and relative image URLs already use the local origin. */ }
    return src;
};

export const loadPosterImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
    const image = new Image();
    const timer = window.setTimeout(() => reject(new Error('Image timeout')), 10000);
    image.crossOrigin = 'anonymous';
    image.onload = () => { window.clearTimeout(timer); resolve(image); };
    image.onerror = () => { window.clearTimeout(timer); reject(new Error('Image unavailable')); };
    image.src = posterImageSource(src);
});

