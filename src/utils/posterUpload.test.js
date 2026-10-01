import {paletteFromPixels, readPosterUpload} from './posterUpload';

test('dominant opaque colour drives a dark panel and lighter matching accent', () => {
    const palette=paletteFromPixels([200,50,20,255,200,50,20,255,0,0,255,255,0,255,0,0]);
    expect(palette.background).toBe('#2e0c05');
    expect(palette.accent).toBe('#ecb7ad');
    expect(palette.backdrop).toBe('#2e0c05dd');
    expect(palette.ink).toBe('#ffffff');
});
test('transparent images have a usable neutral fallback',()=>{
    expect(paletteFromPixels([255,0,0,0]).backdrop).toMatch(/^#[a-f0-9]{6}dd$/);
});
test('invalid and oversized uploads fail before allocating object URLs',async()=>{
    await expect(readPosterUpload(new File(['bad'],'file.txt',{type:'text/plain'}))).rejects.toThrow('JPG');
    await expect(readPosterUpload({type:'image/png',size:5*1024*1024+1})).rejects.toThrow('5 MB');
});
