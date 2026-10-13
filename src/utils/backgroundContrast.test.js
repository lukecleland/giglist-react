import { backgroundTextColour } from './backgroundContrast';

test.each([[0,'#ffffff'],[128,'#000000'],[255,'#000000']])('chooses high contrast text over grey %i', (shade, colour) => {
    const data=new Uint8ClampedArray(16*16*4).fill(shade);
    expect(backgroundTextColour({width:16,height:16,data},0,0,16,16)).toBe(colour);
});

test('samples each block separately and clips to the image bounds',()=>{
    const data=new Uint8ClampedArray(16*16*4);
    data.fill(255,0,16*8*4);
    const image={width:16,height:16,data};
    expect(backgroundTextColour(image,-5,-5,21,13)).toBe('#000000');
    expect(backgroundTextColour(image,0,8,16,20)).toBe('#ffffff');
});
