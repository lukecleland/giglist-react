import { TGiglist } from "../types/types";

// Windows-1252 characters used when UTF-8 bytes were decoded as legacy text.
const windows1252 = "€\u0081‚ƒ„…†‡ˆ‰Š‹Œ\u008dŽ\u008f\u0090‘’“”•–—˜™š›œ\u009džŸ";
const legacyByte = (character: string): number => {
    const code = character.charCodeAt(0);
    if (code <= 255) return code;
    const index = windows1252.indexOf(character);
    return index < 0 ? -1 : index + 128;
};

export const repairGigText = (value: string): string => {
    let result = value;
    // Some feed values have been encoded twice. Only reverse valid UTF-8
    // sequences, leaving ordinary Unicode and incomplete sequences untouched.
    for (let pass = 0; pass < 3; pass++) {
        let repaired = "";
        for (let index = 0; index < result.length; index++) {
            const first = legacyByte(result[index]);
            const length = first >= 0xc2 && first <= 0xdf ? 2
                : first >= 0xe0 && first <= 0xef ? 3
                : first >= 0xf0 && first <= 0xf4 ? 4 : 0;
            const bytes = Array.from(result.slice(index, index + length), legacyByte);
            if (length && bytes.length === length &&
                bytes.slice(1).every((byte) => byte >= 0x80 && byte <= 0xbf)) {
                try {
                    repaired += decodeURIComponent(bytes.map((byte) => `%${byte.toString(16)}`).join(""));
                    index += length - 1;
                    continue;
                } catch {
                    // Invalid UTF-8 is not evidence of an encoding mistake.
                }
            }
            repaired += result[index];
        }
        if (repaired === result) break;
        result = repaired;
    }
    return result;
};

export const normalizeGigText = (dates: TGiglist): TGiglist =>
    dates.map((date) => ({
        ...date,
        listings: date.listings.map((gig) => ({
            ...gig,
            artist: repairGigText(gig.artist),
            name: repairGigText(gig.name),
            suburb: repairGigText(gig.suburb),
            address: repairGigText(gig.address),
        })),
    }));
