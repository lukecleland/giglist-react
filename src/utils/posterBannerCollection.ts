export const extraBannerNames = {
    'aurora-centered': 'Aurora silk', 'dunes-centered': 'Desert cut-outs',
    'jazz-centered': 'Hard bop geometry', 'vinyl-centered': 'Vinyl grooves',
    'risograph-centered': 'Risograph circles', 'terrazzo-centered': 'Confetti terrazzo',
    'memphis-centered': 'Memphis playground', 'checker-centered': 'Warped checkerboard',
    'arches-centered': 'Rainbow arches', 'prism-centered': 'Prismatic shards',
    'weave-centered': 'Woven colour', 'mountain-centered': 'Mountain woodcut',
    'ocean-centered': 'Ocean linocut', 'stars-centered': 'Midnight star chart',
    'leaves-centered': 'Tropical canopy', 'paisley-centered': 'Paisley garden',
    'halftone-centered': 'Pop halftone', 'rays-centered': 'Spotlight crossing',
    'torn-centered': 'Torn gig flyers', 'ripple-centered': 'Op-art ripples',
} as const;
type ExtraBanner = keyof typeof extraBannerNames;
// Ground, primary pigment, secondary pigment, paper. Reused for panel/date colours.
const palettes: Record<ExtraBanner, string[]> = {
    'aurora-centered':['#163951','#4fe0aa','#946de7','#d4fff3'],
    'dunes-centered':['#713d40','#e88452','#efba6d','#ffe8b0'],
    'jazz-centered':['#173961','#258fc1','#edaa43','#f9eed6'],
    'vinyl-centered':['#302549','#ad628f','#e19b61','#ffe3bb'],
    'risograph-centered':['#713858','#f46c83','#eeaf44','#fff0d0'],
    'terrazzo-centered':['#1b5352','#e69473','#83c9b0','#fff0cb'],
    'memphis-centered':['#502c71','#ed679f','#42b8cd','#ffde66'],
    'checker-centered':['#573034','#ec805f','#eaaf77','#fff0d0'],
    'arches-centered':['#334f4c','#efaa66','#bb6158','#f9e9b7'],
    'prism-centered':['#33346b','#58bed0','#c778cc','#f6d387'],
    'weave-centered':['#4f303e','#dc7766','#bead6c','#f8d8a6'],
    'mountain-centered':['#234b58','#5599a0','#8fb2a0','#ffe1a1'],
    'ocean-centered':['#173d65','#4ab1c0','#66d8c6','#e5f0c3'],
    'stars-centered':['#283357','#688bb6','#c09ddb','#fff0b0'],
    'leaves-centered':['#20453c','#6cb579','#d1ac5d','#f9e7a8'],
    'paisley-centered':['#5e315f','#d96c82','#dfa647','#ffe4a3'],
    'halftone-centered':['#3b3268','#e983b2','#ffd757','#fff1b6'],
    'rays-centered':['#31365f','#8c70d6','#47a9c1','#ffe59a'],
    'torn-centered':['#633b32','#e68143','#429492','#f8dfad'],
    'ripple-centered':['#263d55','#e58a67','#57b6ae','#f8e6b4'],
};
export const extraListingColours = Object.fromEntries(Object.entries(palettes).map(([key,p])=>[key,{backdrop:p[0]+'dd',ink:'#fff8e9',accent:p[3]}])) as Record<ExtraBanner,{backdrop:string;ink:string;accent:string}>;

export function drawExtraBanner(ctx: CanvasRenderingContext2D, style: string, y: number, height: number): boolean {
    if (!(style in extraBannerNames)) return false;
    const p=palettes[style as ExtraBanner];
    ctx.save();ctx.translate(0,y);ctx.scale(1.6,height/240);
    ctx.fillStyle=p[0];ctx.fillRect(0,0,1000,240);
    const poly=(points:number[][],colour:string)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=colour;ctx.fill();};
    const ellipse=(x:number,y:number,rx:number,ry:number,colour:string,angle=0)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,angle,0,Math.PI*2);ctx.fillStyle=colour;ctx.fill();};
    const line=(points:number[][],colour:string,width=3)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=colour;ctx.lineWidth=width;ctx.stroke();};
    const noise=(i:number)=>Math.abs(Math.sin(i*127.1+31.7)*43758.5453)%1;
    switch(style) {
        case 'aurora-centered':
            for(let i=0;i<45;i++){const points=[];for(let x=0;x<=1000;x+=10)points.push([x,90+Math.sin(x/155+i*.08)*65+i*3]);line(points,p[1+i%3],5);}break;
        case 'dunes-centered':
            for(let row=0;row<7;row++){const points=[[0,240]];for(let x=0;x<=1000;x+=10)points.push([x,20+row*33+Math.sin(x/210+row*.8)*35]);points.push([1000,240]);poly(points,p[row%4]);}break;
        case 'jazz-centered':
            for(let i=0;i<12;i++){poly([[i*95-30,0],[i*95+30,0],[i*95+105,240],[i*95+35,240]],p[1+i%3]);if(i%2===0)ellipse(i*95,140,47,80,p[0]);}break;
        case 'vinyl-centered':
            for(const x of [100,500,900]){for(let r=190;r>5;r-=9){ctx.beginPath();ctx.arc(x,120,r,0,Math.PI*2);ctx.strokeStyle=p[r%3+1];ctx.lineWidth=2;ctx.stroke();}ellipse(x,120,30,30,p[2]);ellipse(x,120,5,5,p[3]);}break;
        case 'risograph-centered':
            for(let i=0;i<16;i++)ellipse(i*90-70,60+(i%3)*70,105,105,p[1+i%3]);
            for(let i=0;i<1600;i++)ellipse(noise(i)*1000,noise(i+2000)*240,1,1,p[0]);break;
        case 'terrazzo-centered':
            ctx.fillStyle=p[3];ctx.fillRect(0,0,1000,240);
            for(let i=0;i<140;i++){const x=noise(i)*1000,y=noise(i+150)*240,r=7+noise(i+300)*24;poly([[x-r,y],[x+r,y-r],[x+r*.6,y+r],[x-r*.5,y+r*.3]],p[i%3]);}break;
        case 'memphis-centered':
            for(let i=0;i<32;i++){const x=(i%8)*140-10,y=Math.floor(i/8)*80;
                if(i%3===0)ellipse(x,y,34,34,p[1]);else if(i%3===1)poly([[x,y-30],[x+55,y+30],[x-30,y+30]],p[3]);else line([[x-30,y],[x-15,y-20],[x,y],[x+15,y-20],[x+30,y]],p[2],9);}break;
        case 'checker-centered':
            for(let row=-1;row<7;row++)for(let col=0;col<18;col++){const x=col*60,wave=Math.sin(col*.65)*22;poly([[x,row*48+wave],[x+60,row*48+Math.sin((col+1)*.65)*22],[x+60,(row+1)*48+Math.sin((col+1)*.65)*22],[x,(row+1)*48+wave]],p[(row+col+20)%2?1:3]);}break;
        case 'arches-centered':
            for(const x of [0,330,660,990])for(let r=230;r>0;r-=30){ctx.beginPath();ctx.arc(x,240,r,Math.PI,Math.PI*2);ctx.strokeStyle=p[Math.floor(r/30)%4];ctx.lineWidth=30;ctx.stroke();}break;
        case 'prism-centered':
            for(let i=0;i<17;i++)poly([[500,120],[i*90-250,i%2?0:240],[(i+2)*90-250,i%2?240:0]],p[1+i%3]);break;
        case 'weave-centered':
            for(let i=-5;i<25;i++){line([[i*60,0],[i*60+240,240]],p[1+i%2+((i%2)<0?2:0)],22);}
            for(let i=0;i<7;i++){ctx.fillStyle=p[i%2?3:2];ctx.fillRect(0,i*40,1000,14);}break;
        case 'mountain-centered':
            ellipse(760,55,48,48,p[3]);
            for(let row=0;row<4;row++){const points=[[0,240]];for(let x=-80;x<=1100;x+=80)points.push([x,70+row*36-noise(x+row*80)*85]);points.push([1000,240]);poly(points,p[row%3]);}break;
        case 'ocean-centered':
            for(let row=-2;row<17;row++){const points=[];for(let x=0;x<=1000;x+=8)points.push([x,row*20+Math.sin(x/60+row*.35)*20]);line(points,p[1+((row+3)%3)],7);}break;
        case 'stars-centered':
            for(let i=0;i<90;i++){const x=noise(i)*1000,y=noise(i+500)*240,r=2+noise(i+90)*5;poly([[x-r,y],[x,y-r*2],[x+r,y],[x,y+r*2]],p[3]);if(i%4===0)line([[x,y],[noise(i+1)*1000,noise(i+501)*240]],p[1],1);}break;
        case 'leaves-centered':
            for(let i=0;i<18;i++){const x=i*65,cy=i%2?180:45;line([[x-40,cy+70],[x+40,cy-70]],p[3],2);for(let j=-3;j<4;j++){ellipse(x+j*10-14,cy-j*18,25,10,p[1+i%2],-.6);ellipse(x+j*10+14,cy-j*18,25,10,p[2],.5);}}break;
        case 'paisley-centered':
            for(let i=0;i<14;i++){const x=i*80,y=i%2?165:70;for(let r=50;r>5;r-=10)ellipse(x,y,r,r*1.5,p[Math.floor(r/10)%4],.5);line([[x+15,y-45],[x+55,y-85],[x+65,y-55]],p[3],6);}break;
        case 'halftone-centered':
            ctx.fillStyle=p[2];ctx.fillRect(0,0,1000,240);
            for(let x=0;x<1000;x+=18)for(let y=0;y<240;y+=18)ellipse(x,y,2+6*(1+Math.sin(x/90+y/80))/2,2+6*(1+Math.sin(x/90+y/80))/2,p[0]);break;
        case 'rays-centered':
            for(let i=0;i<12;i++)poly([[i%2?1000:0,i*24],[1000-i*65,0],[i*85,240]],p[1+i%3]);break;
        case 'torn-centered':
            for(let i=-1;i<7;i++){const points=[[i*190-40,0],[i*190+200,0]];for(let y=0;y<=260;y+=12)points.push([i*190+150+noise(y+i*37)*25,y]);points.push([i*190-40,260]);poly(points,p[(i+5)%4]);for(let j=0;j<8;j++)line([[i*190+10,j*32],[i*190+95,j*32]],p[(i+6)%4],5);}break;
        case 'ripple-centered':
            for(let r=650;r>0;r-=16){ctx.beginPath();ctx.ellipse(500,120,r,r*.48,0,0,Math.PI*2);ctx.strokeStyle=p[Math.floor(r/16)%4];ctx.lineWidth=16;ctx.stroke();}break;
    }
    ctx.restore();return true;
}
