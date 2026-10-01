import {nextHeaderFonts,nextListingFonts} from './posterThemes';
const original = {title:'Rye',listing:'Outfit',effect:'shadow',headerEffect:'outline'};
test('listing shuffle preserves the header font and effect', () => {
    const next = nextListingFonts(original,()=>.5);
    expect(next.title).toBe(original.title);
    expect(next.headerEffect).toBe(original.headerEffect);
    expect(next.listing).not.toBe(original.listing);
});
test('header shuffle preserves listing font and effect', () => {
    const next = nextHeaderFonts(original,()=>.5);
    expect(next.listing).toBe(original.listing);
    expect(next.effect).toBe(original.effect);
    expect(next.title).not.toBe(original.title);
});
