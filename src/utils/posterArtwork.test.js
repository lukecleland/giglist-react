import {posterArtwork, posterImageSource} from './posterArtwork';
import {posterThemes, nextPosterArtwork} from './posterThemes';

test('all curated artwork is reachable and shuffle avoids immediate repeats', () => {
    const reachable = new Set();
    for (const theme of posterThemes) {
        expect(theme.artwork.length).toBeGreaterThanOrEqual(15);
        expect(new Set(theme.artwork).size).toBe(theme.artwork.length);
        for (const key of theme.artwork) {
            expect(posterArtwork[key]).toBeTruthy();
            reachable.add(key);
            expect(nextPosterArtwork(theme.id, key, () => 0)).not.toBe(key);
        }
    }
    expect([...reachable].sort()).toEqual(Object.keys(posterArtwork).sort());
});


test('local development proxies venue uploads while production and other images retain their URL', () => {
    const photo = 'https://giglist.com.au/wp-content/uploads/2021/08/Ellington-Jazz-Club.jpg';
    expect(posterImageSource(photo, true)).toBe('/wp-content/uploads/2021/08/Ellington-Jazz-Club.jpg');
    expect(posterImageSource(photo, false)).toBe(photo);
    const external = 'https://upload.wikimedia.org/photo.jpg';
    expect(posterImageSource(external, true)).toBe(external);
    expect(posterImageSource('/static/media/image.jpg', true)).toBe('/static/media/image.jpg');
});
