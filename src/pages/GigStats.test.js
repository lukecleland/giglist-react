import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GigStats } from './GigStats';
jest.mock('../components/GigStats/FullStats', () => ({ FullStats: () => null }));

let container;
const originalFetch = global.fetch;
const data = { currently_listed_count: 3576, all_time_count: 185505, last_month_total: 2550, total_venues: 4013 };
beforeEach(() => { container = document.createElement('div'); document.body.appendChild(container); });
afterEach(() => { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); global.fetch = originalFetch; });
const render = () => act(async () => { ReactDOM.render(<MemoryRouter><HelmetProvider><GigStats /></HelmetProvider></MemoryRouter>, container); });

test('shows live totals and preserves the previous snapshot if refresh fails', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => data }).mockRejectedValueOnce(new Error('offline'));
    await render();
    expect(container.textContent).toContain('185,505');
    expect(container.textContent).toContain('3,576');
    await act(async () => container.querySelector('button').click());
    expect(container.querySelector('[role="alert"]').textContent).toContain('last successful snapshot');
    expect(container.textContent).toContain('185,505');
    expect(container.querySelector('button').disabled).toBe(false);
});

test('rejects invalid data and allows a retry with valid zero totals', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ ...data, total_venues: -1 }) })
        .mockResolvedValueOnce({ ok: true, json: async () => Object.fromEntries(Object.keys(data).map(key => [key, 0])) });
    await render();
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
    expect(container.textContent).not.toContain('185,505');
    await act(async () => container.querySelector('button').click());
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect([...container.querySelectorAll('.gigstats-value')].map(el => el.textContent)).toEqual(['0', '0', '0', '0']);
});

test('shows a loading state and aborts the request when leaving', async () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    await render();
    expect(container.querySelector('button').disabled).toBe(true);
    const signal = global.fetch.mock.calls[0][1].signal;
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    expect(signal.aborted).toBe(true);
});
