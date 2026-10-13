import moment from 'moment';
import { TListing } from '../types/types';
import { gigDisplayName, gigSecondaryName } from './featureGigs';
import { backgroundTextColour } from './backgroundContrast';

export type SocialFormat = 'story' | 'square';
export type SocialPalette = 'none' | 'midnight' | 'sunset' | 'paper';
const palettes = {
    none: {base:'#111111', wash:'transparent', text:'#ffffff', accent:'#ffffff'},
    midnight: {base:'#101c27', wash:'rgba(8,20,31,.82)', text:'#fff6df', accent:'#d0f18a'},
    sunset: {base:'#a53128', wash:'rgba(81,11,15,.77)', text:'#fff1d9', accent:'#ffc96a'},
    paper: {base:'#ede4cd', wash:'rgba(238,229,204,.83)', text:'#202a27', accent:'#a1342e'},
};
const clean = (value: string) => value.replace(/&amp;/gi, '&');

export const drawSocialCard = (canvas: HTMLCanvasElement, data: {
    title: string; targetUrl: string; gigs: TListing[]; image: HTMLImageElement | null; qr: HTMLImageElement;
    format: SocialFormat; palette: SocialPalette; isVenue: boolean; isSuburb: boolean; periodLabel?: string; font?: string; invertFontColour?: boolean; autoContrast?: boolean;
}) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is unavailable');
    const width = 1080, height = data.format === 'story' ? 1920 : 1080;
    canvas.width = width; canvas.height = height;
    const palette = palettes[data.palette];
    const textColour = data.invertFontColour
        ? '#' + (0xffffff ^ parseInt(palette.text.slice(1), 16)).toString(16).padStart(6, '0')
        : palette.text;
    const font = data.font || 'Poster Grotesk';
    const fontWeight = ['Poster Grotesk', 'Oswald', 'Bitter', 'Outfit'].includes(font) ? 700 : 400;
    ctx.fillStyle = palette.base; ctx.fillRect(0,0,width,height);
    if (data.image) {
        const iw = data.image.naturalWidth || width, ih = data.image.naturalHeight || height;
        const scale = Math.max(width / iw, height / ih);
        ctx.drawImage(data.image,(width-iw*scale)/2,(height-ih*scale)/2,iw*scale,ih*scale);
    }
    if (data.palette !== 'none') {
        const shade = ctx.createLinearGradient(0,0,0,height);
        shade.addColorStop(0,palette.wash); shade.addColorStop(.48,palette.wash); shade.addColorStop(1,palette.base);
        ctx.fillStyle = shade; ctx.fillRect(0,0,width,height);
    }
    // Capture only the composed background, before any lettering or accents are drawn.
    const backgroundPixels = data.autoContrast ? ctx.getImageData(0, 0, width, height) : null;
    const setBlockColour = (x: number, y: number, w: number, h: number) => {
        ctx.fillStyle = backgroundPixels ? backgroundTextColour(backgroundPixels, x, y, w, h) : textColour;
    };
    const drawText = (text: string, x: number, y: number, maxWidth?: number) => {
        if (backgroundPixels) {
            ctx.save();
            ctx.strokeStyle = ctx.fillStyle === '#000000' ? '#ffffff' : '#000000';
            ctx.lineWidth = Math.max(2, Math.min(4, Number(/([\d.]+)px/.exec(ctx.font)?.[1] || 30) * .045));
            ctx.lineJoin = 'round';
            if (maxWidth === undefined) ctx.strokeText(text, x, y);
            else ctx.strokeText(text, x, y, maxWidth);
            ctx.restore();
        }
        if (maxWidth === undefined) ctx.fillText(text, x, y);
        else ctx.fillText(text, x, y, maxWidth);
    };
    const pad = 70;
    ctx.fillStyle = textColour; ctx.textBaseline = 'top';
    const headline = clean(data.title);
    let titleSize = data.format === 'story' ? 144 : 120;
    ctx.font = `${fontWeight} ${titleSize}px "${font}", sans-serif`;
    while (ctx.measureText(headline).width > width-pad*2 && titleSize > 36) {
        titleSize -= 3; ctx.font = `${fontWeight} ${titleSize}px "${font}", sans-serif`;
    }
    const titleTop = 70;
    setBlockColour(pad,titleTop,Math.min(ctx.measureText(headline).width,width-pad*2),titleSize*1.2);
    drawText(headline,pad,titleTop,width-pad*2);
    const spacerTop = titleTop+titleSize+18;
    ctx.fillStyle = palette.accent; ctx.fillRect(pad,spacerTop,94,8);
    const subtitleTop = spacerTop+28;
    ctx.fillStyle = textColour;
    ctx.font = '700 30px "Poster Grotesk", sans-serif';
    const subtitle = data.periodLabel || 'LIVE MUSIC · NEXT 7 DAYS';
    setBlockColour(pad,subtitleTop,Math.min(ctx.measureText(subtitle).width,width-pad*2),36);
    drawText(subtitle,pad,subtitleTop,width-pad*2);
    const listTop = subtitleTop+85;
    const footerTop = height-140;
    const listBottom = footerTop-90;
    const availableHeight = listBottom-listTop;
    const wrap = (text:string,maxWidth:number):string[] => {
        const lines:string[]=[];
        let line='';
        for (const word of text.split(/\s+/)) {
            if (ctx.measureText(word).width > maxWidth) {
                if (line) {lines.push(line);line='';}
                for (const character of word) {
                    if (line && ctx.measureText(line+character).width > maxWidth) {
                        lines.push(line);line='';
                    }
                    line+=character;
                }
                continue;
            }
            const next=line ? `${line} ${word}` : word;
            if (line && ctx.measureText(next).width > maxWidth) {lines.push(line);line=word;}
            else line=next;
        }
        if (line) lines.push(line);
        return lines;
    };
    const gigGap=36;
    const singleFont=data.format==='story'?47:37;
    const singleDetailSize=Math.round(singleFont*.6);
    const singleHeight=data.gigs.reduce((total,gig)=>{
        ctx.font=`${fontWeight} ${singleFont}px "${font}", sans-serif`;
        const nameLines=wrap(gigDisplayName(gig,data.isVenue,data.isSuburb),width-pad*2-24).length;
        ctx.font=`${singleDetailSize}px "Poster Grotesk", sans-serif`;
        const detail=`${moment(gig.date).format('ddd D MMM')} · ${gig.start || 'Time TBA'} · ${gigSecondaryName(gig,data.isVenue,data.isSuburb)}`;
        return total+nameLines*singleFont*1.12+12+wrap(detail,width-pad*2-24).length*singleDetailSize*1.25+gigGap;
    },0);
    const columns = singleHeight > availableHeight ? 2 : 1;
    const columnGap=42;
    const columnWidth=(width-pad*2-columnGap*(columns-1))/columns;
    const textWidth=columnWidth-24;
    let visibleCount=data.gigs.length;
    let fontSize=50;
    const measureRows = () => data.gigs.slice(0,visibleCount).map(gig => {
        ctx.font=`${fontWeight} ${fontSize}px "${font}", sans-serif`;
        const names=wrap(gigDisplayName(gig,data.isVenue,data.isSuburb),textWidth);
        const detailSize=Math.max(19,Math.round(fontSize*.6));
        ctx.font=`${detailSize}px "Poster Grotesk", sans-serif`;
        const detail=`${moment(gig.date).format('ddd D MMM')} · ${gig.start || 'Time TBA'} · ${gigSecondaryName(gig,data.isVenue,data.isSuburb)}`;
        const details=wrap(detail,textWidth);
        return {names,details,detailSize,height:names.length*fontSize*1.12+12+details.length*detailSize*1.25+gigGap};
    });
    let rows=measureRows();
    const fits = () => {
        const perColumn=Math.ceil(rows.length/columns);
        const reserved=visibleCount<data.gigs.length ? 38 : 0;
        return Array.from({length:columns},(_,column)=>rows.slice(column*perColumn,(column+1)*perColumn).reduce((total,row)=>total+row.height,0)).every(total=>total<=availableHeight-reserved);
    };
    while (!fits() && fontSize>24) {fontSize-=1;rows=measureRows();}
    while (!fits() && visibleCount>0) {visibleCount-=1;rows=measureRows();}
    const perColumn=Math.ceil(rows.length/columns);
    for (let column=0;column<columns;column++) {
        const x=pad+column*(columnWidth+columnGap);
        const columnRows=rows.slice(column*perColumn,(column+1)*perColumn);
        let y=listTop;
        columnRows.forEach(row=>{
            ctx.fillStyle=palette.accent;ctx.fillRect(x,y+4,3,row.height-gigGap);
            ctx.fillStyle=textColour;ctx.font=`${fontWeight} ${fontSize}px "${font}", sans-serif`;
            setBlockColour(x+24,y,textWidth,row.height-gigGap);
            row.names.forEach((line,index)=>drawText(line,x+24,y+index*fontSize*1.12));
            const detailTop=y+row.names.length*fontSize*1.12+12;
            ctx.font=`${row.detailSize}px "Poster Grotesk", sans-serif`;
            row.details.forEach((line,index)=>drawText(line,x+24,detailTop+index*row.detailSize*1.25));
            y+=row.height;
        });
    }
    const more=data.gigs.length-visibleCount;
    if (more>0) {
        ctx.fillStyle=textColour;ctx.font='700 26px "Poster Grotesk", sans-serif';
        setBlockColour(pad,listBottom-30,ctx.measureText(`+ ${more} more gigs`).width,32);
        drawText(`+ ${more} more gigs`,pad,listBottom-30);
    }
    ctx.fillStyle='#050505';ctx.fillRect(0,footerTop,width,height-footerTop);
    const footerBottom=height-40;
    ctx.fillStyle='#fff';ctx.fillRect(pad,footerBottom-148,148,148);
    ctx.drawImage(data.qr,pad+10,footerBottom-138,128,128);
    ctx.textBaseline='bottom';ctx.textAlign='right';
    ctx.fillStyle='#fff';ctx.font='39px "carbontyperegular", serif';
    const logoWidth=ctx.measureText('Giglist').width;
    ctx.fillText('Giglist',width-pad,footerBottom);
    ctx.fillStyle='#b9b9b9';ctx.font='18px "Poster Grotesk", sans-serif';
    ctx.fillText('Gigs. In a list.',width-pad,footerBottom-43);
    const copyX=pad+174;
    const copyWidth=width-pad-logoWidth-28-copyX;
    ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='700 25px "Poster Grotesk", sans-serif';
    const copyLines=wrap('Scan QR code for gig details & updates',copyWidth);
    copyLines.forEach((line,index)=>ctx.fillText(line,copyX,footerBottom-32-(copyLines.length-1-index)*29,copyWidth));
    ctx.fillStyle='#b9b9b9';ctx.font='22px "Poster Grotesk", sans-serif';
    ctx.fillText(data.targetUrl.replace(/^https?:\/\//,''),copyX,footerBottom,copyWidth);
};
