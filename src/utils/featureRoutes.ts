import { qrTargetFromPath, posterMonths } from './qrUrl';

export const featureKinds = ['embed', 'calendar', 'screen', 'map', 'social'] as const;
export type FeatureKind = typeof featureKinds[number];

export type FeatureRoute = { kind: FeatureKind; slug: string; targetUrl: string; month?: number };
export const featureRouteFromPath = (pathname: string): FeatureRoute | null => {
    const match = /^\/([^/]+)_(embed|calendar|screen|map|social)(?:_([a-z]{3}))?\/?$/i.exec(pathname);
    if (!match) return null;
    const month = match[3] ? posterMonths.indexOf(match[3].toLowerCase()) : undefined;
    if (month === -1) return null;
    const targetUrl = qrTargetFromPath(`/${match[1]}_qr`);
    if (!targetUrl) return null;
    return {kind: match[2].toLowerCase() as FeatureKind, slug: decodeURIComponent(targetUrl.split('/').pop() || ''), targetUrl, ...(month === undefined ? {} : {month})};
};
