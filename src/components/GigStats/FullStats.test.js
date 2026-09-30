import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { FullStats } from './FullStats';
import { parseFullStats } from '../../utils/fullStats';
const fixture = {
    generated_at: '2026-10-01T01:00:00+08:00', scope: {state: ''}, average_per_month: 10,
    monthly_breakdown: {series: [{month: '2026-08', count: 10}, {month: '2026-09', count: 20}]},
    weekly_distribution: {series: [{day: 'Mon', count: 10}, {day: 'Sat', count: 20}]},
    highlights: {trailing_12_month_total: 30, year_over_year_change_percent: null},
    awards: {monthly: [
        {month: '2026-08', artist_most_listed: {name: 'August Band', count: 3, tied_with: ['Other Band']}},
        {month: '2026-09', artist_most_listed: {name: 'September Band', count: 4}, venue_most_listed: {name: 'Jazz Room', count: 5}},
    ], all_time: {artist_leaderboard: [{name: 'Tour Band', count: 30}], venue_leaderboard: [{name: 'Jazz Room', count: 50}]}},
};
let container;
const originalFetch = global.fetch;
beforeEach(() => { container = document.createElement('div'); document.body.appendChild(container); });
afterEach(() => { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); global.fetch = originalFetch; });
const render = () => act(async () => { ReactDOM.render(<FullStats refresh={0} />, container); });

test('charts expose actual counts, switch modes, and select monthly winners with ties', async () => {
    global.fetch = jest.fn().mockResolvedValue({ok: true, json: async () => fixture});
    await render();
    expect(container.textContent).toContain('No previous-year baseline');
    expect(container.textContent).toContain('September Band');
    expect(container.querySelector('.stats-donut').getAttribute('aria-label')).toContain('66.7%');
    act(() => { container.querySelectorAll('.stats-toggle button')[1].click(); });
    expect(container.querySelectorAll('.stats-toggle button')[1].getAttribute('aria-pressed')).toBe('true');
    act(() => { Simulate.focus(container.querySelector('g[role="button"]')); });
    expect(container.querySelector('.stats-chart-readout').textContent).toContain('Aug 2026 · 10 gigs');
    act(() => { Simulate.change(container.querySelector('select'), {target: {value: '2026-08'}}); });
    expect(container.textContent).toContain('August Band');
    expect(container.textContent).toContain('Tied with Other Band');
});

test('failed full feed can retry without requiring overview data', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ok: true, json: async () => fixture});
    await render();
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
    await act(async () => { container.querySelector('button').click(); });
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(container.textContent).toContain('Tour Band');
});

test('zero and empty datasets render without invalid chart coordinates', async () => {
    global.fetch = jest.fn().mockResolvedValue({ok: true, json: async () => ({...fixture, monthly_breakdown: {series: []}, weekly_distribution: {series: []}, awards: {}, average_per_month: 0, highlights: {trailing_12_month_total: 0, year_over_year_change_percent: null}})});
    await render();
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
    expect(container.textContent).toContain('No leaderboard available');
    expect(container.textContent).toContain('No activity data available');
});

test('invalid chart counts are rejected rather than graphed', () => {
    expect(() => parseFullStats({...fixture, monthly_breakdown: {series: [{month: '2026-13', count: 1}]}})).toThrow();
    expect(() => parseFullStats({...fixture, weekly_distribution: {series: [{day: 'Mon', count: -1}]}})).toThrow();
});
