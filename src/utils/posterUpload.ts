export type ImagePalette = {background: string; backdrop: string; ink: string; accent: string};
export type PosterUpload = {name: string; image: HTMLImageElement; palette: ImagePalette};

export function paletteFromPixels(pixels: ArrayLike<number>): ImagePalette {
    const buckets = new Map<string, {count: number; rgb: number[]}>();
    for (let i=0; i<pixels.length; i+=4) {
        if (pixels[i+3] < 128) continue;
        const rgb=[pixels[i],pixels[i+1],pixels[i+2]];
        const key=rgb.map(value=>Math.floor(value/32)).join(',');
        const bucket=buckets.get(key);
        if(bucket) { bucket.count++; rgb.forEach((value,j)=>bucket.rgb[j]+=value); }
        else buckets.set(key,{count:1,rgb:[...rgb]});
    }
    const score = (bucket: {count: number; rgb: number[]}) => {
        const rgb = bucket.rgb.map(value => value / bucket.count);
        const max = Math.max(...rgb), min = Math.min(...rgb);
        // Prefer substantial coloured regions over large black shadows or white sky.
        return bucket.count * (.2 + (max - min) / 255 * 2) * (max < 35 || min > 235 ? .15 : 1);
    };
    const ranked=Array.from(buckets.values()).sort((a,b)=>score(b)-score(a));
    const dominant=ranked[0];
    const rgb=dominant ? dominant.rgb.map(value=>value/dominant.count) : [60,70,85];
    const colour=(values:number[])=>'#'+values.map(value=>Math.round(value).toString(16).padStart(2,'0')).join('');
    const background=colour(rgb.map(value=>value*.23));
    return {background, backdrop:background+'dd', ink:'#ffffff', accent:colour(rgb.map(value=>value*.35+255*.65))};
}

export async function readPosterUpload(file: File): Promise<PosterUpload> {
    if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG or WebP image.');
    if(file.size>5*1024*1024) throw new Error('Please choose an image 5 MB or smaller.');
    const url=URL.createObjectURL(file);
    try {
        const original=new Image();
        await new Promise<void>((resolve,reject)=>{original.onload=()=>resolve();original.onerror=()=>reject(new Error('This image could not be read. Try another file.'));original.src=url;});
        const canvas=document.createElement('canvas');
        const scale=Math.min(1,2400/Math.max(original.naturalWidth,original.naturalHeight));
        canvas.width=Math.max(1,Math.round(original.naturalWidth*scale));
        canvas.height=Math.max(1,Math.round(original.naturalHeight*scale));
        const ctx=canvas.getContext('2d');
        if(!ctx) throw new Error('Image uploads are unavailable in this browser.');
        ctx.drawImage(original,0,0,canvas.width,canvas.height);
        const image=new Image();
        await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('This image could not be prepared.'));image.src=canvas.toDataURL('image/png');});
        canvas.width=64;canvas.height=64;
        ctx.drawImage(image,0,0,64,64);
        return {name:file.name,image,palette:paletteFromPixels(ctx.getImageData(0,0,64,64).data)};
    } finally {URL.revokeObjectURL(url);}
}
