export const qrTargetFromPath = (pathname: string): string | null => {
    const match = /^\/([^/]+)\/?$/.exec(pathname);
    if (!match) return null;
    let name: string;
    try { name = decodeURIComponent(match[1]); }
    catch { return null; }
    if (!/^.+_qr$/i.test(name) || /[/\\?#]/.test(name)) return null;
    return `https://giglist.com.au/${encodeURIComponent(name.slice(0, -3))}`;
};
