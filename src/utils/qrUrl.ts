export const qrTargetFromPath = (pathname: string): string | null => {
    const match = /^\/([^/]+)\/?$/.exec(pathname);
    if (!match) return null;
    let name: string;
    try { name = decodeURIComponent(match[1]); }
    catch { return null; }
    if (!/^.+_qr$/i.test(name) || /[/\\?#]/.test(name)) return null;
    return `https://giglist.com.au/${encodeURIComponent(name.slice(0, -3))}`;
};

export const posterMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
export const posterRouteFromPath = (pathname: string): { targetUrl: string; month?: number } | null => {
    const match = /^(.*)_poster(?:_([a-z]{3}))?(\/?)$/i.exec(pathname);
    if (!match) return null;
    const month = match[2] ? posterMonths.indexOf(match[2].toLowerCase()) : undefined;
    if (month === -1) return null;
    const targetUrl = qrTargetFromPath(`${match[1]}_qr${match[3]}`);
    return targetUrl ? { targetUrl, month } : null;
};
export const posterTargetFromPath = (pathname: string): string | null =>
    posterRouteFromPath(pathname)?.targetUrl || null;
