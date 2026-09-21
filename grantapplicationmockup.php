<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Giglist Government Grant Application Mockup</title>
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

		.hero,
		.section,
		.card {
			border: 1px solid var(--line);
			border-radius: 16px;
			background: var(--panel);
		}

		.hero {
			padding: 24px;
			background: linear-gradient(135deg, #0d0d0d 0%, #050505 100%);
			margin-bottom: 16px;
		}

		.eyebrow {
			margin: 0;
			color: var(--muted);
			font-size: 0.82rem;
			letter-spacing: 0.09em;
			text-transform: uppercase;
			font-weight: 500;
		}

		h1 {
			margin: 8px 0 12px;
			font-size: clamp(1.5rem, 2.8vw, 2.6rem);
			text-transform: uppercase;
			letter-spacing: 0.03em;
		}

		.hero p {
			margin: 0;
			color: var(--muted);
			max-width: 90ch;
			line-height: 1.6;
		}

		.grid {
			display: grid;
			grid-template-columns: repeat(12, minmax(0, 1fr));
			gap: 14px;
			margin-bottom: 14px;
		}

		.card {
			padding: 16px;
		}

		.stat-card {
			grid-column: span 3;
		}

		.chart-card {
			grid-column: span 6;
		}

		.chart-wide {
			grid-column: span 12;
		}

		.chart-title {
			margin: 0 0 10px;
			font-size: 0.9rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			font-weight: 500;
			color: var(--muted);
		}

		canvas {
			width: 100% !important;
			height: 300px !important;
		}

		.stat-label {
			margin: 0;
			color: var(--muted);
			font-size: 0.78rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			font-weight: 500;
		}

		.stat-value {
			margin: 10px 0 0;
			font-size: clamp(1.3rem, 2.3vw, 2.1rem);
			font-weight: 700;
		}

		.section {
			padding: 18px;
			margin-bottom: 14px;
		}

		h2 {
			margin: 0 0 10px;
			font-size: 1.05rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--muted);
			font-weight: 500;
		}

		p {
			margin: 0 0 10px;
			line-height: 1.65;
		}

		.commitments {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 10px;
			margin-top: 12px;
		}

		.pill {
			border: 1px solid var(--line);
			border-radius: 12px;
			background: #0b0b0b;
			padding: 12px;
			font-size: 0.92rem;
			line-height: 1.45;
		}

		.pill strong {
			display: block;
			font-size: 0.78rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--muted);
			margin-bottom: 6px;
		}

		table {
			width: 100%;
			border-collapse: collapse;
			margin-top: 10px;
			font-size: 0.95rem;
		}

		th,
		td {
			text-align: left;
			padding: 10px 8px;
			border-bottom: 1px solid var(--line);
		}

		th {
			color: var(--muted);
			font-size: 0.78rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			font-weight: 500;
		}

		.note {
			color: var(--muted);
			font-size: 0.85rem;
			margin-top: 10px;
		}

		.footer {
			color: var(--muted);
			font-size: 0.86rem;
			margin-top: 12px;
		}

		.kpis {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 10px;
			margin-top: 12px;
		}

		.kpi {
			border: 1px solid var(--line);
			border-radius: 12px;
			padding: 12px;
			background: #0b0b0b;
		}

		.kpi .label {
			font-size: 0.78rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--muted);
		}

		.kpi .value {
			font-size: 1.35rem;
			font-weight: 700;
			margin-top: 6px;
		}

		@media (max-width: 980px) {
			.stat-card {
				grid-column: span 6;
			}

			.chart-card {
				grid-column: span 12;
			}

			.commitments {
				grid-template-columns: 1fr;
			}

			.kpis {
				grid-template-columns: 1fr;
			}
		}

		@media (max-width: 640px) {
			.wrap {
				padding: 14px;
			}

			.stat-card {
				grid-column: span 12;
			}

			canvas {
				height: 260px !important;
			}
		}
	</style>
</head>
<body>
	<main class="wrap">
		<section class="hero">
			<p class="eyebrow">Grant Request Mockup</p>
			<h1>Giglist Community Live Music Access Program</h1>
			<p>
				Giglist seeks operational support to maintain and scale a demonstrated public-interest digital service that improves live music
				discoverability for audiences, artists and venues across Australia. Over the past 10 years, a two-person team has delivered and
				maintained this platform independently, providing consistent community access to local live music information.
			</p>
		</section>

		<section class="grid" id="giglistStats">
			<article class="card stat-card">
				<p class="stat-label">Giglist Listings (All Time)</p>
				<p class="stat-value" id="allTimeCount">-</p>
			</article>
			<article class="card stat-card">
				<p class="stat-label">Average Listings Per Month</p>
				<p class="stat-value" id="averagePerMonth">-</p>
			</article>
			<article class="card stat-card">
				<p class="stat-label">Last Month Listings</p>
				<p class="stat-value" id="lastMonthTotal">-</p>
			</article>
			<article class="card stat-card">
				<p class="stat-label">Venues Represented</p>
				<p class="stat-value" id="totalVenues">-</p>
			</article>
		</section>

		<section class="section">
			<h2>Need And Public Value</h2>
			<p>
				Live music is a measurable contributor to Australia’s economic and social outcomes. A widely cited national benchmark
				(University of Tasmania / Live Music Office, 2014) estimated that live music activity generated approximately $15.7 billion
				in annual value to the Australian community. Within this context, Giglist functions as low-cost digital infrastructure that
				supports participation, improves audience discovery pathways, increases event visibility and contributes to local venue activation.
			</p>
			<div class="commitments">
				<div class="pill">
					<strong>Current Funding Status</strong>
					Giglist is currently unfunded and has operated without ongoing government or institutional subsidy.
				</div>
				<div class="pill">
					<strong>Community Service</strong>
					Giglist provides a direct community service by improving access to local live music information through a single public platform.
				</div>
				<div class="pill">
					<strong>Track Record</strong>
					Giglist has operated continuously for 10 years and is built and maintained by a two-person team.
				</div>
			</div>
		</section>

		<section class="section">
			<h2>National Fiscal Context (Australia)</h2>
			<p>
				The table below provides an indicative state and territory context for the widely cited $15.7 billion annual live music value
				estimate and can be used to frame jurisdictional relevance within a funding application.
			</p>
			<table aria-label="Indicative state live music fiscal contribution">
				<thead>
					<tr>
						<th>State / Territory</th>
						<th>Estimated Annual Value (AUD)</th>
					</tr>
				</thead>
				<tbody>
					<tr><td>New South Wales</td><td>$5.0 billion</td></tr>
					<tr><td>Victoria</td><td>$4.2 billion</td></tr>
					<tr><td>Queensland</td><td>$2.4 billion</td></tr>
					<tr><td>Western Australia</td><td>$1.7 billion</td></tr>
					<tr><td>South Australia</td><td>$1.1 billion</td></tr>
					<tr><td>Tasmania</td><td>$0.4 billion</td></tr>
					<tr><td>Australian Capital Territory</td><td>$0.5 billion</td></tr>
					<tr><td>Northern Territory</td><td>$0.4 billion</td></tr>
				</tbody>
			</table>
		</section>

		<section class="grid">
			<article class="card chart-card">
				<h3 class="chart-title">Indicative State Economic Value (Billions AUD)</h3>
				<canvas id="stateValueChart"></canvas>
			</article>
			<article class="card chart-card">
				<h3 class="chart-title">Giglist Monthly Listings (Live Feed)</h3>
				<canvas id="gigVolumeChart"></canvas>
			</article>
		</section>

		<section class="section">
			<h2>Funding Request: $250,000 Over 5 Years</h2>
			<p>
				Giglist requests a total of <strong>$250,000</strong> in staged operational funding over five years, equal to an average of
				<strong>$50,000 per year</strong>. This investment will stabilise a proven, currently unfunded service and enable strategic growth
				for audiences, artists and venues.
			</p>
			<table aria-label="Proposed five year budget allocation">
				<thead>
					<tr>
						<th>Investment Category</th>
						<th>5 Year Amount (AUD)</th>
						<th>Purpose</th>
					</tr>
				</thead>
				<tbody>
					<tr><td>Continued operation</td><td>$90,000</td><td>Part-time staffing effort for platform maintenance, moderation, and support.</td></tr>
					<tr><td>Office costs</td><td>$20,000</td><td>Administration, software subscriptions, accounting, and compliance overheads.</td></tr>
					<tr><td>Travel</td><td>$15,000</td><td>Regional outreach, venue engagement, and stakeholder meetings across states.</td></tr>
					<tr><td>Server hosting</td><td>$35,000</td><td>Hosting, backup, uptime monitoring, security hardening, and scaling capacity.</td></tr>
					<tr><td>Advertising</td><td>$25,000</td><td>Audience growth campaigns and artist/venue onboarding communications.</td></tr>
					<tr><td>Expansion</td><td>$45,000</td><td>Feature development, accessibility improvements, and broader geographic coverage.</td></tr>
					<tr><td>Measurement and reporting</td><td>$20,000</td><td>Impact tracking dashboards, analytics, and acquittal/reporting delivery.</td></tr>
				</tbody>
			</table>
		</section>

		<section class="grid">
			<article class="card chart-card">
				<h3 class="chart-title">Funding Split By Category</h3>
				<canvas id="budgetSplitChart"></canvas>
			</article>
			<article class="card chart-card">
				<h3 class="chart-title">Planned Annual Spend (5 Years)</h3>
				<canvas id="yearlySpendChart"></canvas>
			</article>
		</section>

		<section class="section">
			<h2>Program Outcomes And Delivery</h2>
			<p>
				Giglist requests strategic operational investment to secure continuity and scale of an established community-facing service.
				The platform aligns with common program criteria across cultural grants by demonstrating: public benefit (improved access to live music
				information), sector impact (greater visibility for artists and venues), delivery capability (10 years of continuous operation by a
				dedicated two-person team), and value for money (high public utility delivered with minimal resourcing). In a national context where
				live music has been valued at approximately $15.7 billion annually, support for Giglist would strengthen local cultural participation,
				improve audience pathways to events and help sustain the live music ecosystem across metropolitan and regional communities.
			</p>
			<p>
				Requested support would be applied to platform reliability, data quality, venue and artist coverage expansion, and improved access features.
				Proposed reporting can include baseline and post-funding metrics such as listing volume, active venue count, geographic coverage and
				audience reach indicators, ensuring transparent acquittal against funded outcomes.
			</p>
			<div class="kpis">
				<div class="kpi">
					<div class="label">Service Continuity</div>
					<div class="value">5 Year Stability</div>
				</div>
				<div class="kpi">
					<div class="label">Coverage Target</div>
					<div class="value">+40% Venue Reach</div>
				</div>
				<div class="kpi">
					<div class="label">Audience Discovery</div>
					<div class="value">+60% Event Views</div>
				</div>
			</div>
			<p class="footer" id="feedMeta">Live Giglist metrics source: ./gigstatsfeed.php</p>
		</section>
	</main>

	<script>
		const nf = new Intl.NumberFormat('en-AU');
		const palette = {
			text: '#f7f7f7',
			muted: '#bdbdbd',
			grid: '#262626',
			strong: '#ffffff',
			dim: '#9a9a9a',
			dim2: '#747474'
		};

		function fmt(value) {
			return nf.format(Number(value || 0));
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

		function renderStaticCharts() {
			new Chart(document.getElementById('stateValueChart'), {
				type: 'bar',
				data: {
					labels: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
					datasets: [{
						label: 'Value (AUD billions)',
						data: [5.0, 4.2, 2.4, 1.7, 1.1, 0.4, 0.5, 0.4],
						backgroundColor: ['#ffffff', '#e5e5e5', '#cccccc', '#b5b5b5', '#9d9d9d', '#8a8a8a', '#7b7b7b', '#6d6d6d'],
						borderWidth: 0
					}]
				},
				options: baseChartOptions()
			});

			new Chart(document.getElementById('budgetSplitChart'), {
				type: 'doughnut',
				data: {
					labels: [
						'Continued operation',
						'Office costs',
						'Travel',
						'Server hosting',
						'Advertising',
						'Expansion',
						'Measurement/reporting'
					],
					datasets: [{
						data: [90000, 20000, 15000, 35000, 25000, 45000, 20000],
						backgroundColor: ['#ffffff', '#e7e7e7', '#d4d4d4', '#bdbdbd', '#a8a8a8', '#939393', '#7d7d7d'],
						borderColor: '#0e0e0e',
						borderWidth: 1
					}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: palette.text,
								font: { family: 'Space Grotesk' }
							}
						}
					}
				}
			});

			new Chart(document.getElementById('yearlySpendChart'), {
				type: 'bar',
				data: {
					labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
					datasets: [{
						label: 'Annual spend (AUD)',
						data: [50000, 50000, 50000, 50000, 50000],
						backgroundColor: ['#ffffff', '#dfdfdf', '#c4c4c4', '#acacac', '#959595'],
						borderWidth: 0
					}]
				},
				options: baseChartOptions()
			});
		}

		function renderLiveGigChart(data) {
			const monthly = data && data.monthly_breakdown && Array.isArray(data.monthly_breakdown.series)
				? data.monthly_breakdown.series
				: [];

			const labels = monthly.map((m) => m.month);
			const values = monthly.map((m) => Number(m.count || 0));

			new Chart(document.getElementById('gigVolumeChart'), {
				type: 'line',
				data: {
					labels: labels,
					datasets: [{
						label: 'Listings',
						data: values,
						borderColor: palette.strong,
						backgroundColor: 'rgba(255,255,255,0.10)',
						tension: 0.25,
						pointRadius: 2,
						fill: true,
						borderWidth: 2
					}]
				},
				options: baseChartOptions()
			});
		}

		async function loadStats() {
			try {
				const res = await fetch('./gigstatsfeed.php');
				const data = await res.json();

				document.getElementById('allTimeCount').textContent = fmt(data.all_time_count);
				document.getElementById('averagePerMonth').textContent = fmt(Math.floor(Number(data.average_per_month || 0)));
				document.getElementById('lastMonthTotal').textContent = fmt(data.last_month_total);
				document.getElementById('totalVenues').textContent = fmt(data.total_venues);

				const scopeState = data.scope && data.scope.state && String(data.scope.state).trim() !== ''
					? data.scope.state
					: 'National';
				const schema = data.scope && data.scope.schema ? data.scope.schema : 'n/a';
				const generatedAt = data.generated_at || 'n/a';

				document.getElementById('feedMeta').textContent =
					'Live Giglist metrics source: ./gigstatsfeed.php | Generated: ' + generatedAt + ' | Scope: ' + scopeState + ' (' + schema + ')';

				renderLiveGigChart(data);
			} catch (error) {
				document.getElementById('feedMeta').textContent =
					'Live Giglist metrics source unavailable. Keep mockup text and replace stats manually if feed is offline.';

				renderLiveGigChart({ monthly_breakdown: { series: [] } });
			}
		}

		renderStaticCharts();
		loadStats();
	</script>
</body>
</html>
