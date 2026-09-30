export type CountPoint = { label: string; count: number };
export type StatsLeader = { name: string; count: number; tied_with: string[] };
export type FullStats = {
    generated: string; scope: string; months: CountPoint[]; weekdays: CountPoint[];
    average: number; total: number; change: number | null;
    artists: StatsLeader[]; venues: StatsLeader[];
    awards: { month: string; artist: StatsLeader | null; venue: StatsLeader | null }[];
};
const count = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0;
const month = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
const leader = (value: any): StatsLeader | null => value && typeof value.name === 'string' && count(value.count)
    ? { name: value.name, count: value.count, tied_with: Array.isArray(value.tied_with) ? value.tied_with.filter((v: unknown) => typeof v === 'string') : [] } : null;
export const parseFullStats = (value: any): FullStats => {
    const months = value?.monthly_breakdown?.series;
    const weekdays = value?.weekly_distribution?.series;
    if (!Array.isArray(months) || !months.every(p => month(p?.month) && count(p?.count)) ||
        !Array.isArray(weekdays) || !weekdays.every(p => ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].includes(p?.day) && count(p?.count)) ||
        typeof value.average_per_month !== 'number' || !Number.isFinite(value.average_per_month) || value.average_per_month < 0 ||
        !count(value.highlights?.trailing_12_month_total) ||
        !(value.highlights.year_over_year_change_percent === null || (typeof value.highlights.year_over_year_change_percent === 'number' && Number.isFinite(value.highlights.year_over_year_change_percent)))) throw new Error('Invalid full stats');
    const leaders = (rows: unknown): StatsLeader[] => Array.isArray(rows) ? rows.map(leader).filter((p): p is StatsLeader => p !== null) : [];
    return {
        generated: typeof value.generated_at === 'string' && !Number.isNaN(Date.parse(value.generated_at)) ? value.generated_at : '',
        scope: typeof value.scope?.state === 'string' && value.scope.state.trim() ? value.scope.state : 'National',
        months: months.map(p => ({label: p.month, count: p.count})).sort((a, b) => a.label.localeCompare(b.label)),
        weekdays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => ({label: day, count: weekdays.find(p => p.day === day)?.count || 0})),
        average: value.average_per_month, total: value.highlights.trailing_12_month_total,
        change: value.highlights.year_over_year_change_percent,
        artists: leaders(value.awards?.all_time?.artist_leaderboard), venues: leaders(value.awards?.all_time?.venue_leaderboard),
        awards: Array.isArray(value.awards?.monthly) ? value.awards.monthly.filter((p: any) => month(p?.month)).map((p: any) => ({month: p.month, artist: leader(p.artist_most_listed), venue: leader(p.venue_most_listed)})).sort((a: any, b: any) => a.month.localeCompare(b.month)) : [],
    };
};
export const monthLabel = (key: string) => new Date(`${key}-01T12:00:00Z`).toLocaleDateString('en-AU', {month: 'short', year: 'numeric', timeZone: 'UTC'});
export const formatCount = (value: number) => value.toLocaleString('en-AU', {maximumFractionDigits: 0});
