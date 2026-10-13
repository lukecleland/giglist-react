// Choose the higher-contrast black/white ink from the background beneath a text block.
export const backgroundTextColour = (image: ImageData, x: number, y: number, width: number, height: number): string => {
    const linear = (channel: number) => {
        const value = channel / 255;
        return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
    };
    const left = Math.max(0, Math.floor(x)), top = Math.max(0, Math.floor(y));
    const right = Math.min(image.width, Math.ceil(x + width)), bottom = Math.min(image.height, Math.ceil(y + height));
    let luminance = 0, count = 0;
    // Sample a bounded grid so dense social cards remain responsive.
    const stepX = Math.max(1, Math.floor((right - left) / 32));
    const stepY = Math.max(1, Math.floor((bottom - top) / 16));
    for (let row = top; row < bottom; row += stepY) {
        for (let column = left; column < right; column += stepX) {
            const offset = (row * image.width + column) * 4;
            luminance += .2126 * linear(image.data[offset]) + .7152 * linear(image.data[offset + 1]) + .0722 * linear(image.data[offset + 2]);
            count++;
        }
    }
    if (!count) return '#ffffff';
    const average = luminance / count;
    return (average + .05) / .05 >= 1.05 / (average + .05) ? '#000000' : '#ffffff';
};
