<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Gig Stats Example</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
  <style>
    :root {
      --bg: #050505;
      --panel: #0e0e0e;
      --ink: #f7f7f7;
      --muted: #bdbdbd;
      --line: #2a2a2a;
      --accent: #ffffff;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: 'Space Grotesk', sans-serif;
      background:
        radial-gradient(circle at 5% 5%, #1a1a1a 0%, transparent 40%),
        radial-gradient(circle at 92% 12%, #121212 0%, transparent 35%),
        var(--bg);
      color: var(--ink);
    }

    .wrap {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .hero {
      border: 1px solid var(--line);
      background: linear-gradient(135deg, #0d0d0d 0%, #050505 100%);
      padding: 22px;
      border-radius: 16px;
      margin-bottom: 18px;
    }

    .hero h1 {
      margin: 0;
      font-size: clamp(1.4rem, 2.4vw, 2.3rem);
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .hero p {
      margin: 8px 0 0;
      color: var(--muted);
    }

    .meta {
      margin-top: 10px;
      font-size: 0.92rem;
      color: var(--muted);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 14px;
    }

    .card {
      border: 1px solid var(--line);
      background: var(--panel);
      border-radius: 14px;
      padding: 16px;
    }

    .metric {
      grid-column: span 3;
    }

    .metric h3 {
      margin: 0;
      color: var(--muted);
      font-size: 0.85rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 500;
    }

    .metric .value {
      margin-top: 10px;
      font-size: clamp(1.35rem, 2.8vw, 2.2rem);
      font-weight: 700;
    }

    .chart-lg {
      grid-column: span 12;
    }

    .spotlight {
      grid-column: span 6;
    }

    .spotlight h3 {
      margin: 0;
      color: var(--muted);
      font-size: 0.85rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 500;
    }

    .spotlight .name {
      margin-top: 10px;
      font-size: clamp(1.15rem, 2.2vw, 1.7rem);
      font-weight: 700;
    }

    .spotlight .sub {
      margin-top: 6px;
      color: var(--muted);
      font-size: 0.92rem;
      line-height: 1.4;
    }

    .chart-half {
      grid-column: span 6;
    }

    .chart-title {
      margin: 0 0 12px;
      font-size: 0.95rem;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: var(--muted);
    }

    canvas {
      width: 100% !important;
      height: 320px !important;
    }

    .status {
      margin-top: 14px;
      font-size: 0.9rem;
      color: var(--muted);
    }

    .error {
      border-color: #6d2020;
      background: #1b0d0d;
      color: #ffdede;
    }

    @media (max-width: 960px) {
      .metric,
      .chart-half {
        grid-column: span 6;
      }
    }

    @media (max-width: 640px) {
      .wrap {
        padding: 14px;
      }

      .metric,
      .chart-half,
      .chart-lg {
        grid-column: span 12;
      }

      canvas {
        height: 280px !important;
      }
    }
  </style>
</head>
<body>
  <main class="wrap">
    <section class="hero">
      <h1>Gig Stats Intelligence</h1>
      <p>Example frontend consuming the gig stats JSON feed.</p>
      <div class="meta" id="meta">Loading...</div>
    </section>

    <section class="grid" id="dashboard" hidden>
      <article class="card metric">
        <h3>All Time Count</h3>
        <div class="value" id="allTimeCount">-</div>
      </article>

      <article class="card metric">
        <h3>Avg Per Month</h3>
        <div class="value" id="averagePerMonth">-</div>
      </article>

      <article class="card metric">
        <h3>Last Month Total</h3>
        <div class="value" id="lastMonthTotal">-</div>
      </article>

      <article class="card metric">
        <h3>Total Venues</h3>
        <div class="value" id="totalVenues">-</div>
      </article>

      <article class="card spotlight">
        <h3>All Time Artist Winner</h3>
        <div class="name" id="allTimeArtistName">-</div>
        <div class="sub" id="allTimeArtistMeta">-</div>
      </article>

      <article class="card spotlight">
        <h3>All Time Venue Winner</h3>
        <div class="name" id="allTimeVenueName">-</div>
        <div class="sub" id="allTimeVenueMeta">-</div>
      </article>

      <article class="card chart-lg">
        <h2 class="chart-title">Monthly Volume</h2>
        <canvas id="volumeLine"></canvas>
      </article>

      <article class="card chart-half">
        <h2 class="chart-title">Monthly Volume Trend</h2>
        <canvas id="last12Bar"></canvas>
      </article>

      <article class="card chart-half">
        <h2 class="chart-title">Day Of Week Distribution</h2>
        <canvas id="weekdayBar"></canvas>
      </article>

      <article class="card chart-half">
        <h2 class="chart-title">Most Listed Artists</h2>
        <canvas id="artistWins"></canvas>
      </article>

      <article class="card chart-half">
        <h2 class="chart-title">Most Listed Venues</h2>
        <canvas id="venueWins"></canvas>
      </article>
    </section>

    <section class="card error" id="errorBox" hidden>
      <strong>Could not load stats</strong>
      <div id="errorMsg" class="status"></div>
    </section>

    <p class="status">Data source: ./gigstatsfeed.php</p>
  </main>

  <script>
    const palette = {
      text: '#f7f7f7',
      muted: '#bdbdbd',
      grid: '#262626',
      line: '#ffffff',
      bar: '#bfbfbf',
      barDim: '#7a7a7a'
    };

    const numberFormat = new Intl.NumberFormat('en-AU');

    function formatNum(value) {
      return numberFormat.format(Number(value || 0));
    }

    function baseChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: palette.text,
              font: { family: 'Space Grotesk' }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: palette.muted, maxRotation: 0 },
            grid: { color: palette.grid }
          },
          y: {
            ticks: { color: palette.muted },
            grid: { color: palette.grid }
          }
        }
      };
    }

    function describeWinner(entry, withLocationId = false) {
      if (!entry || !entry.name) {
        return { name: 'No winner', meta: 'No data available' };
      }

      const ties = Array.isArray(entry.tied_with) ? entry.tied_with.filter(Boolean) : [];
      const parts = [`${formatNum(entry.count)} listings`];
      if (withLocationId && entry.location_id) {
        parts.push(`Location #${entry.location_id}`);
      }
      if (ties.length) {
        parts.push(`Tied with: ${ties.join(', ')}`);
      }

      return {
        name: entry.name,
        meta: parts.join(' | ')
      };
    }

    function render(data) {
      const series = data.monthly_breakdown.series || [];
      const labels = series.map((p) => p.month);
      const counts = series.map((p) => p.count);

      document.getElementById('allTimeCount').textContent = formatNum(data.all_time_count);
      document.getElementById('averagePerMonth').textContent = Math.floor(Number(data.average_per_month || 0));
      document.getElementById('lastMonthTotal').textContent = formatNum(data.last_month_total);
      document.getElementById('totalVenues').textContent = formatNum(data.total_venues);

      const latest = series.length ? series[series.length - 1] : null;
      const scopeState = data.scope?.state && String(data.scope.state).trim() !== ''
        ? data.scope.state
        : 'National';
      const metaBits = [
        `Generated: ${data.generated_at || 'n/a'}`,
        `Scope: ${scopeState} (${data.scope?.schema || 'n/a'})`
      ];
      if (latest) {
        metaBits.push(`Latest month: ${latest.month} (${formatNum(latest.count)} gigs)`);
      }
      document.getElementById('meta').textContent = metaBits.join(' | ');

      const allTimeArtist = describeWinner(data.awards?.all_time?.artist_most_listed, false);
      const allTimeVenue = describeWinner(data.awards?.all_time?.venue_most_listed, true);
      document.getElementById('allTimeArtistName').textContent = allTimeArtist.name;
      document.getElementById('allTimeArtistMeta').textContent = allTimeArtist.meta;
      document.getElementById('allTimeVenueName').textContent = allTimeVenue.name;
      document.getElementById('allTimeVenueMeta').textContent = allTimeVenue.meta;

      const chartLine = new Chart(document.getElementById('volumeLine'), {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Gigs listed',
            data: counts,
            borderColor: palette.line,
            backgroundColor: 'rgba(255,255,255,0.08)',
            tension: 0.25,
            pointRadius: 0,
            borderWidth: 2,
            fill: true
          }]
        },
        options: baseChartOptions()
      });

      const last12 = series.slice(-12);
      const chartLast12 = new Chart(document.getElementById('last12Bar'), {
        type: 'bar',
        data: {
          labels: last12.map((m) => m.month),
          datasets: [{
            label: 'Monthly gigs',
            data: last12.map((m) => m.count),
            backgroundColor: palette.bar,
            borderWidth: 0
          }]
        },
        options: baseChartOptions()
      });

      const weekdaySeries = data.weekly_distribution?.series || [];
      const chartWeekday = new Chart(document.getElementById('weekdayBar'), {
        type: 'bar',
        data: {
          labels: weekdaySeries.map((d) => d.day),
          datasets: [{
            label: 'Gig count',
            data: weekdaySeries.map((d) => d.count),
            backgroundColor: ['#6f6f6f', '#7a7a7a', '#868686', '#919191', '#9d9d9d', '#e3e3e3', '#ffffff'],
            borderWidth: 0
          }]
        },
        options: {
          ...baseChartOptions(),
          plugins: {
            legend: { display: false }
          }
        }
      });

      const topArtistLeaderboard = data.awards?.all_time?.artist_leaderboard || [];
      const topVenueLeaderboard = data.awards?.all_time?.venue_leaderboard || [];

      const chartArtistWins = new Chart(document.getElementById('artistWins'), {
        type: 'bar',
        data: {
          labels: topArtistLeaderboard.map((entry) => entry.name),
          datasets: [{
            label: 'Listings',
            data: topArtistLeaderboard.map((entry) => entry.count),
            backgroundColor: palette.bar,
            borderWidth: 0
          }]
        },
        options: {
          ...baseChartOptions(),
          indexAxis: 'y',
          plugins: { legend: { display: false } }
        }
      });

      const chartVenueWins = new Chart(document.getElementById('venueWins'), {
        type: 'bar',
        data: {
          labels: topVenueLeaderboard.map((entry) => entry.name),
          datasets: [{
            label: 'Listings',
            data: topVenueLeaderboard.map((entry) => entry.count),
            backgroundColor: palette.barDim,
            borderWidth: 0
          }]
        },
        options: {
          ...baseChartOptions(),
          indexAxis: 'y',
          plugins: { legend: { display: false } }
        }
      });

      // Keep references to avoid lint complaints if strict tooling is later added.
      window.__gigCharts = [chartLine, chartLast12, chartWeekday, chartArtistWins, chartVenueWins];
    }

    async function init() {
      const dashboard = document.getElementById('dashboard');
      const errorBox = document.getElementById('errorBox');
      try {
        const res = await fetch('./gigstatsfeed.php', { credentials: 'same-origin' });
        const data = await res.json();

        if (!res.ok || !data || data.error) {
          throw new Error(data?.message || `HTTP ${res.status}`);
        }

        render(data);
        dashboard.hidden = false;
      } catch (err) {
        errorBox.hidden = false;
        document.getElementById('errorMsg').textContent = err.message || 'Unknown error';
      }
    }

    init();
  </script>
</body>
</html>
