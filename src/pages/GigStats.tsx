import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "./GigStats.scss";

const statsUrl = "https://giglist.com.au/gigstatssimple.php";
const metrics = [
    { key: "currently_listed_count", label: "Gigs currently listed", tag: "Coming up", description: "Gigs in the current listing window, from today through the next 12 months. The day rolls over at 5am Perth time." },
    { key: "last_month_total", label: "Gigs last month", tag: "Last calendar month", description: "Gigs with an event date in the previous calendar month, using Perth time. This counts gig dates, not submission dates." },
    { key: "all_time_count", label: "Gigs all time", tag: "The full archive", description: "All gigs counted by the stats feed, including historical and future events. This is not a count of past gigs alone." },
    { key: "total_venues", label: "Venues in the directory", tag: "Our reach", description: "All venue records in the directory, including venues without a current gig listed." },
] as const;
type Stats = Record<typeof metrics[number]["key"], number>;
const validStats = (value: unknown): value is Stats => !!value && typeof value === "object" &&
    metrics.every(({ key }) => Number.isSafeInteger((value as Stats)[key]) && (value as Stats)[key] >= 0);

export const GigStats = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updated, setUpdated] = useState<Date | null>(null);
    const [request, setRequest] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;
        setLoading(true); setError("");
        const timeout = window.setTimeout(() => controller.abort(), 15000);
        (async () => {
            try {
                const response = await fetch(statsUrl, { signal: controller.signal, cache: "no-store" });
                if (!response.ok) throw new Error("Stats unavailable");
                const data: unknown = await response.json();
                if (!validStats(data)) throw new Error("Invalid stats");
                if (active) { setStats(data); setUpdated(new Date()); }
            } catch {
                if (active) setError("Stats couldn’t refresh. Please try again.");
            } finally {
                window.clearTimeout(timeout);
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
    }, [request]);

    return <div className="gigstats-page">
        <Helmet>
            <title>Gigstats | Giglist</title>
            <meta name="robots" content="noindex, follow" />
            <link rel="canonical" href="https://giglist.com.au/gigstats" />
        </Helmet>
        <header className="gigstats-nav">
            <Link className="gigstats-logo" to="/" aria-label="Giglist home">Giglist</Link>
            <span>By the numbers</span>
            <Link className="gigstats-back" to="/">Back to gigs <span aria-hidden="true">↗</span></Link>
        </header>
        <main className="gigstats-content">
            <section className="gigstats-heading">
                <div><p className="gigstats-eyebrow">The live music picture</p><h1>Gigstats<span>.</span></h1>
                    <p className="gigstats-intro">Gigs, venues and the community behind them.<br />A snapshot of live music on Giglist.</p></div>
                <div className="gigstats-controls">
                    <button type="button" disabled={loading} onClick={() => setRequest((value) => value + 1)}>
                        <span aria-hidden="true">↻</span> {loading ? "Refreshing…" : "Refresh stats"}
                    </button>
                    <p role="status">{loading ? "Loading the latest counts" : updated ? `Last fetched ${updated.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" })}` : "Waiting for stats"}</p>
                </div>
            </section>
            {error && <div className="gigstats-error" role="alert">{error}{stats && " Showing the last successful snapshot."}</div>}
            <section className="gigstats-cards" aria-label="Giglist statistics" aria-busy={loading}>
                {metrics.map((metric, index) => <article className={`gigstats-card gigstats-card--${index}`} key={metric.key}>
                    <p className="gigstats-tag"><span aria-hidden="true">0{index + 1}</span>{metric.tag}</p>
                    <p className={`gigstats-value${!stats && loading ? " gigstats-skeleton" : ""}`}>{stats ? stats[metric.key].toLocaleString("en-AU") : "—"}</p>
                    <h2>{metric.label}</h2>
                </article>)}
            </section>
            <section className="gigstats-details" aria-labelledby="gigstats-details-title">
                <div className="gigstats-details-heading"><p className="gigstats-eyebrow">Behind the numbers</p><h2 id="gigstats-details-title">What we’re counting</h2>
                    <p>These are Giglist’s records, not a census of every live show in Australia. Each total has its own scope.</p></div>
                <dl>{metrics.map((metric) => <div key={metric.key}><dt>{metric.label}</dt><dd>{metric.description}</dd></div>)}</dl>
            </section>
            <footer className="gigstats-footer"><span>Gigs. In a list. In numbers.</span><a href={statsUrl} target="_blank" rel="noreferrer">View source data ↗</a></footer>
        </main>
    </div>;
};
