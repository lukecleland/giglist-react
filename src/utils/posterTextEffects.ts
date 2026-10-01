export type PosterTextEffect = 'plain' | 'outline' | 'shadow' | 'outlineShadow';
export const paintPosterText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, effect: PosterTextEffect = 'plain') => {
    if (effect === 'plain') { ctx.fillText(text, x, y); return; }
    const size = Number(/([\d.]+)px/.exec(ctx.font)?.[1] || 30);
    const rgb = String(ctx.fillStyle).match(/^#([a-f\d]{6})$/i)?.[1];
    const light = !rgb || (parseInt(rgb.slice(0,2),16)*.299 + parseInt(rgb.slice(2,4),16)*.587 + parseInt(rgb.slice(4),16)*.114) > 145;
    ctx.save();
    if (effect === 'shadow' || effect === 'outlineShadow') {
        ctx.shadowColor = light ? '#000' : '#fff'; ctx.shadowBlur = size * .045;
        ctx.shadowOffsetX = size * .025; ctx.shadowOffsetY = size * .04;
    }
    if (effect === 'outline' || effect === 'outlineShadow') {
        ctx.strokeStyle = light ? '#171717' : '#f5f0df'; ctx.lineWidth = Math.max(.7,size * .035); ctx.lineJoin = 'round';
        ctx.strokeText(text,x,y);
    }
    ctx.fillText(text,x,y); ctx.restore();
};
