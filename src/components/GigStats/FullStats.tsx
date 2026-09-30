import { useEffect, useState } from 'react';
import { CountPoint, FullStats as Stats, StatsLeader, formatCount, monthLabel, parseFullStats } from '../../utils/fullStats';
import './FullStats.scss';

const url = 'https://giglist.com.au/gigstatsfeed.php';

const ActivityChart = ({points, bars = false, label, monthly = false}: {points: CountPoint[]; bars?: boolean; label: string; monthly?: boolean}) => {
    const [selected, setSelected] = useState<number | null>(null);
    const max = Math.max(1, ...points.map(p => p.count));
    const ceiling = Math.ceil(max / 4) * 4;
    const step = 620 / Math.max(1, points.length);
    const x = (i: number) => 65 + step * (i + .5);
    const y = (n: number) => 220 - n / ceiling * 180;
    const title = (p: CountPoint) => monthly ? monthLabel(p.label) : p.label;
    const focus = selected === null ? null : points[selected];
    const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.count)}`).join(' ');
    return <div className="stats-chart">
        <p className="stats-chart-readout" aria-live="polite">{focus ? <><strong>{title(focus)}</strong> · {formatCount(focus.count)} gigs</> : 'Select a point to explore the counts'}</p>
        {!points.length ? <p>No activity data available.</p> : <svg viewBox="0 0 720 265" role="group" aria-label={label}>
            {[0,1,2,3,4].map(tick => <g key={tick}><line x1="65" x2="685" y1={y(ceiling * tick / 4)} y2={y(ceiling * tick / 4)} stroke="#343c45" strokeDasharray="3 6" /><text x="53" y={y(ceiling * tick / 4) + 4} textAnchor="end" fill="#aab4bf" fontSize="11">{formatCount(ceiling * tick / 4)}</text></g>)}
            {!bars && <><path d={`${path} L${x(points.length - 1)},220 L${x(0)},220 Z`} fill="#b9a4ff" opacity=".13" /><path d={path} fill="none" stroke="#b9a4ff" strokeWidth="3" /></>}
            {points.map((p, i) => <g key={p.label} role="button" tabIndex={0} aria-label={`${title(p)}: ${formatCount(p.count)} gigs`} onFocus={() => setSelected(i)} onMouseEnter={() => setSelected(i)} onClick={() => setSelected(i)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(i); } }}>
                <title>{title(p)}: {formatCount(p.count)} gigs</title>
                <rect x={65 + step * i} y="28" width={step} height="200" fill="transparent" />
                {bars ? <rect x={x(i) - step * .28} y={y(p.count)} width={step * .56} height={220 - y(p.count)} rx="4" fill={selected === i ? '#daf280' : '#72d4dc'} /> : <circle cx={x(i)} cy={y(p.count)} r={selected === i ? 7 : 4} fill={selected === i ? '#daf280' : '#b9a4ff'} />}
                <text x={x(i)} y="246" textAnchor="middle" fill="#bac3cd" fontSize="11">{monthly ? monthLabel(p.label).slice(0,3) : p.label}</text>
            </g>)}
        </svg>}
        <details><summary>View chart data</summary><table><thead><tr><th>{monthly ? 'Month' : 'Day'}</th><th>Gigs</th></tr></thead><tbody>{points.map(p => <tr key={p.label}><td>{title(p)}</td><td>{formatCount(p.count)}</td></tr>)}</tbody></table></details>
    </div>;
};

const Leaderboard = ({title, rows, tone}: {title: string; rows: StatsLeader[]; tone: string}) => {
    const max = Math.max(1, ...rows.map(row => row.count));
    return <article className={`stats-panel stats-leaders ${tone}`}><p className="gigstats-eyebrow">All-time listings</p><h3>{title}</h3>
        {!rows.length && <p>No leaderboard available.</p>}
        <ol>{rows.map((row, i) => <li key={`${row.name}-${i}`}><span className="stats-rank">{String(i + 1).padStart(2, '0')}</span><div><div className="stats-leader-label"><span>{row.name}</span><strong>{formatCount(row.count)}</strong></div><div className="stats-track"><span style={{width: `${row.count / max * 100}%`}} /></div></div></li>)}</ol>
    </article>;
};
const Winner = ({title, entry}: {title: string; entry: StatsLeader | null}) => <div className="stats-winner"><p>{title}</p><h4>{entry?.name || 'No data'}</h4>{entry && <><strong>{formatCount(entry.count)} listings</strong>{entry.tied_with.length > 0 && <small>Tied with {entry.tied_with.join(', ')}</small>}</>}</div>;

export const FullStats = ({refresh}: {refresh: number}) => {
    const [data, setData] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retry, setRetry] = useState(0);
    const [bars, setBars] = useState(false);
    const [month, setMonth] = useState('');
    useEffect(() => {
        let active = true;
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 60000);
        setLoading(true); setError('');
        (async () => {
            try {
                const response = await fetch(url, {signal: controller.signal, cache: 'no-store'});
                if (!response.ok) throw new Error('Full stats unavailable');
                const result = parseFullStats(await response.json());
                if (active) setData(result);
            } catch { if (active) setError('The deeper stats couldn’t load. Your overview is still available.'); }
            finally { window.clearTimeout(timeout); if (active) setLoading(false); }
        })();
        return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
    }, [refresh, retry]);
    const selectedAward = data?.awards.find(p => p.month === month) || data?.awards[data.awards.length - 1];
    const peak = data?.months.reduce<CountPoint | null>((best, point) => !best || point.count > best.count ? point : best, null);
    const weeklyTotal = data?.weekdays.reduce((sum, p) => sum + p.count, 0) || 0;
    const weekend = data?.weekdays.filter(p => ['Fri','Sat','Sun'].includes(p.label)).reduce((sum, p) => sum + p.count, 0) || 0;
    const share = weeklyTotal ? weekend / weeklyTotal * 100 : 0;
    const range = data?.months.length ? `${monthLabel(data.months[0].label)} – ${monthLabel(data.months[data.months.length - 1].label)}` : 'No monthly data';
    return <section className="stats-deep" aria-labelledby="stats-deep-title">
        <div className="stats-section-title"><div><p className="gigstats-eyebrow">Turn up the detail</p><h2 id="stats-deep-title">The rhythm of live music<span>↗</span></h2></div><span className="stats-scope">{data?.scope || 'Full feed'} · {data ? range : 'Deeper insights'}</span></div>
        {loading && <p className="stats-loading" role="status"><span aria-hidden="true" />{data ? 'Refreshing the deeper stats…' : 'Crunching the full archive. The charts may take a little longer…'}</p>}
        {error && <div className="gigstats-error" role="alert">{error} {data && 'Showing the previous snapshot.'} <button type="button" onClick={() => setRetry(v => v + 1)} disabled={loading}>Try again</button></div>}
        {data && <>
            <div className="stats-insights">
                <article><p>Past 12 complete months</p><strong>{formatCount(data.total)}</strong><span>gigs in the archive</span></article>
                <article><p>Average per month</p><strong>{formatCount(data.average)}</strong><span>across the same period</span></article>
                <article><p>Year on year</p><strong className={data.change !== null && data.change < 0 ? 'stats-negative' : ''}>{data.change === null ? '—' : `${data.change > 0 ? '+' : ''}${data.change.toFixed(1)}%`}</strong><span>{data.change === null ? 'No previous-year baseline' : 'vs the previous 12 months'}</span></article>
                <article><p>Busiest month</p><strong>{peak && peak.count > 0 ? monthLabel(peak.label) : '—'}</strong><span>{peak && peak.count > 0 ? `${formatCount(peak.count)} gigs · in this period` : 'No gigs in this period'}</span></article>
            </div>
            <article className="stats-panel stats-volume"><div className="stats-panel-heading"><div><p className="gigstats-eyebrow">01 / The pulse</p><h3>A year on stage</h3><p>{range} · complete calendar months</p></div><div className="stats-toggle" aria-label="Chart style"><button aria-pressed={!bars} onClick={() => setBars(false)}>Line</button><button aria-pressed={bars} onClick={() => setBars(true)}>Bars</button></div></div>
                <ActivityChart points={data.months} bars={bars} monthly label="Monthly gig counts" />
            </article>
            <div className="stats-chart-grid">
                <article className="stats-panel"><p className="gigstats-eyebrow">02 / Seven days of sound</p><h3>When the gigs happen</h3><p>Gig dates by weekday · {range}</p><ActivityChart points={data.weekdays} bars label="Gigs by weekday" /></article>
                <article className="stats-panel stats-weekend"><p className="gigstats-eyebrow">03 / Weekend energy</p><h3>Made for the weekend</h3><div className="stats-donut" style={{background: `conic-gradient(#daf280 0% ${share}%, #333d43 ${share}% 100%)`}} role="img" aria-label={`${share.toFixed(1)}% of gigs fall Friday to Sunday`}><div><strong>{weeklyTotal ? `${Math.round(share)}%` : '—'}</strong><span>Friday to Sunday</span></div></div><p><strong>{formatCount(weekend)}</strong> weekend gigs out of {formatCount(weeklyTotal)}.<br />Same 12-month period as the weekday chart.</p></article>
            </div>
            <div className="stats-section-title"><div><p className="gigstats-eyebrow">The regulars & the rooms</p><h2>Most listed</h2></div><span className="stats-scope">All-time · {data.scope}</span></div>
            <div className="stats-leader-grid"><Leaderboard title="Artists on repeat" rows={data.artists} tone="stats-purple" /><Leaderboard title="Venues keeping it live" rows={data.venues} tone="stats-cyan" /></div>
            <p className="stats-footnote">Ranked by listing count, not attendance or popularity. Artist names reflect event titles in the feed; open mic entries are excluded from artist rankings.</p>
            <article className="stats-panel stats-spotlight"><div className="stats-panel-heading"><div><p className="gigstats-eyebrow">Monthly spotlight</p><h3>Who owned the month?</h3></div>{data.awards.length > 0 && <label>Choose month<select value={selectedAward?.month || ''} onChange={e => setMonth(e.target.value)}>{data.awards.map(p => <option key={p.month} value={p.month}>{monthLabel(p.month)}</option>)}</select></label>}</div><div className="stats-winners"><Winner title="Most listed artist" entry={selectedAward?.artist || null} /><Winner title="Most listed venue" entry={selectedAward?.venue || null} /></div></article>
            <p className="stats-footnote">Changes reflect Giglist’s recorded listings and coverage, not a measure of total music industry growth.<br />Full feed: {data.scope}{data.generated && ` · Generated ${new Date(data.generated).toLocaleString('en-AU', {timeZone: 'Australia/Perth'})} AWST`}. <a href={url} target="_blank" rel="noreferrer">View full source data ↗</a></p>
        </>}
    </section>;
};
