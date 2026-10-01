export type PosterTextEffect = 'plain' | 'outline' | 'shadow' | 'outlineShadow' | 'bannerOutline' | 'bannerOutlineShadow';
export const paintPosterText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, effect: PosterTextEffect = 'plain') => {
    if (effect === 'plain') { ctx.fillText(text, x, y); return; }
    const size = Number(/([\d.]+)px/.exec(ctx.font)?.[1] || 30);
    const rgb = String(ctx.fillStyle).match(/^#([a-f\d]{6})$/i)?.[1];
    const light = !rgb || (parseInt(rgb.slice(0,2),16)*.299 + parseInt(rgb.slice(2,4),16)*.587 + parseInt(rgb.slice(4),16)*.114) > 145;
    ctx.save();
    if (effect === 'bannerOutlineShadow') {
        ctx.strokeStyle = light ? '#111111' : '#fff8e8';
        ctx.lineWidth = Math.max(4, size * .10);
        ctx.lineJoin = 'round';
        ctx.shadowColor = light ? '#000000' : '#ffffff';
        ctx.shadowBlur = Math.max(3, size * .065);
        ctx.shadowOffsetX = Math.max(1.5, size * .035);
        ctx.shadowOffsetY = Math.max(2, size * .055);
        ctx.strokeText(text, x, y);
        // Keep the face crisp; only the outside stroke casts the shadow.
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
        ctx.fillText(text, x, y);
        ctx.restore(); return;
    }
    if (effect === 'bannerOutline') { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; }
    if (effect === 'shadow' || effect === 'outlineShadow') {
        ctx.shadowColor = light ? '#000' : '#fff'; ctx.shadowBlur = size * .045;
        ctx.shadowOffsetX = size * .025; ctx.shadowOffsetY = size * .04;
    }
    if (effect === 'outline' || effect === 'outlineShadow' || effect === 'bannerOutline') {
        ctx.strokeStyle = light ? '#171717' : '#f5f0df'; ctx.lineWidth = effect === 'bannerOutline' ? Math.max(3, size * .065) : Math.max(.7,size * .035); ctx.lineJoin = 'round';
        ctx.strokeText(text,x,y);
    }
    ctx.fillText(text,x,y); ctx.restore();
};
