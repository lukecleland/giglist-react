import moment from 'moment';
import { TListing } from '../types/types';
import { gigDisplayName, gigSecondaryName } from './featureGigs';

export type SocialFormat = 'story' | 'square';
export type SocialPalette = 'midnight' | 'sunset' | 'paper';
const palettes = {
    midnight: {base:'#101c27', wash:'rgba(8,20,31,.82)', text:'#fff6df', accent:'#d0f18a'},
    sunset: {base:'#a53128', wash:'rgba(81,11,15,.77)', text:'#fff1d9', accent:'#ffc96a'},
    paper: {base:'#ede4cd', wash:'rgba(238,229,204,.83)', text:'#202a27', accent:'#a1342e'},
};
const clean = (value: string) => value.replace(/&amp;/gi, '&');

export const drawSocialCard = (canvas: HTMLCanvasElement, data: {
    title: string; targetUrl: string; gigs: TListing[]; image: HTMLImageElement; qr: HTMLImageElement;
    format: SocialFormat; palette: SocialPalette; isVenue: boolean; isSuburb: boolean; periodLabel?: string;
}) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is unavailable');
    const width = 1080, height = data.format === 'story' ? 1920 : 1080;
    canvas.width = width; canvas.height = height;
    const palette = palettes[data.palette];
    ctx.fillStyle = palette.base; ctx.fillRect(0,0,width,height);
    const iw = data.image.naturalWidth || width, ih = data.image.naturalHeight || height;
    const scale = Math.max(width / iw, height / ih);
    ctx.drawImage(data.image,(width-iw*scale)/2,(height-ih*scale)/2,iw*scale,ih*scale);
    const shade = ctx.createLinearGradient(0,0,0,height);
    shade.addColorStop(0,palette.wash); shade.addColorStop(.48,palette.wash); shade.addColorStop(1,palette.base);
    ctx.fillStyle = shade; ctx.fillRect(0,0,width,height);
    const pad = 70;
    ctx.fillStyle = palette.text; ctx.textBaseline = 'top';
    const headline = clean(data.title);
    let titleSize = data.format === 'story' ? 108 : 88;
    ctx.font = `700 ${titleSize}px "Poster Grotesk", sans-serif`;
    while (ctx.measureText(headline).width > width-pad*2 && titleSize > 36) {
        titleSize -= 3; ctx.font = `700 ${titleSize}px "Poster Grotesk", sans-serif`;
    }
    const titleTop = 70;
    ctx.fillText(headline,pad,titleTop,width-pad*2);
    const spacerTop = titleTop+titleSize+18;
    ctx.fillStyle = palette.accent; ctx.fillRect(pad,spacerTop,94,8);
    const subtitleTop = spacerTop+28;
    ctx.fillStyle = palette.text;
    ctx.font = '700 30px "Poster Grotesk", sans-serif';
    ctx.fillText(data.periodLabel || 'LIVE MUSIC · NEXT 7 DAYS',pad,subtitleTop,width-pad*2);
    const listTop = subtitleTop+85;
    const footerTop = height-140;
    const listBottom = footerTop-36;
    const availableHeight = listBottom-listTop;
    const wrap = (text:string,maxWidth:number):string[] => {
        const lines:string[]=[];
        let line='';
        for (const word of text.split(/\s+/)) {
            const next=line ? `${line} ${word}` : word;
            if (line && ctx.measureText(next).width > maxWidth) {lines.push(line);line=word;}
            else line=next;
        }
        if (line) lines.push(line);
        return lines;
    };
    const singleFont=data.format==='story'?47:37;
    const singleDetailSize=Math.round(singleFont*.6);
    const singleHeight=data.gigs.reduce((total,gig)=>{
        ctx.font=`700 ${singleFont}px "Poster Grotesk", sans-serif`;
        const nameLines=wrap(gigDisplayName(gig,data.isVenue,data.isSuburb),width-pad*2-24).length;
        ctx.font=`${singleDetailSize}px "Poster Grotesk", sans-serif`;
        const detail=`${moment(gig.date).format('ddd D MMM')} · ${gig.start || 'Time TBA'} · ${gigSecondaryName(gig,data.isVenue,data.isSuburb)}`;
        return total+nameLines*singleFont*1.12+12+wrap(detail,width-pad*2-24).length*singleDetailSize*1.25+24;
    },0);
    const columns = singleHeight > availableHeight ? 2 : 1;
    const columnGap=42;
    const columnWidth=(width-pad*2-columnGap*(columns-1))/columns;
    const textWidth=columnWidth-24;
    let visibleCount=data.gigs.length;
    let fontSize=columns===2 ? (data.format==='story'?36:30) : (data.format==='story'?47:37);
    const measureRows = () => data.gigs.slice(0,visibleCount).map(gig => {
        ctx.font=`700 ${fontSize}px "Poster Grotesk", sans-serif`;
        const names=wrap(gigDisplayName(gig,data.isVenue,data.isSuburb),textWidth);
        const detailSize=Math.max(19,Math.round(fontSize*.6));
        ctx.font=`${detailSize}px "Poster Grotesk", sans-serif`;
        const detail=`${moment(gig.date).format('ddd D MMM')} · ${gig.start || 'Time TBA'} · ${gigSecondaryName(gig,data.isVenue,data.isSuburb)}`;
        const details=wrap(detail,textWidth);
        return {names,details,detailSize,height:names.length*fontSize*1.12+12+details.length*detailSize*1.25+24};
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
        let y=listTop;
        rows.slice(column*perColumn,(column+1)*perColumn).forEach(row=>{
            ctx.fillStyle=palette.accent;ctx.fillRect(x,y+4,3,row.height-24);
            ctx.fillStyle=palette.text;ctx.font=`700 ${fontSize}px "Poster Grotesk", sans-serif`;
            row.names.forEach((line,index)=>ctx.fillText(line,x+24,y+index*fontSize*1.12,textWidth));
            const detailTop=y+row.names.length*fontSize*1.12+12;
            ctx.font=`${row.detailSize}px "Poster Grotesk", sans-serif`;
            row.details.forEach((line,index)=>ctx.fillText(line,x+24,detailTop+index*row.detailSize*1.25,textWidth));
            y+=row.height;
        });
    }
    const more=data.gigs.length-visibleCount;
    if (more>0) {
        ctx.fillStyle=palette.text;ctx.font='700 26px "Poster Grotesk", sans-serif';
        ctx.fillText(`+ ${more} more gigs`,pad,listBottom-30);
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
