import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { ShareGig } from './ShareGig';
import { buildGigUrl } from '../utils/gigUrl';

const listing = { artist: 'Band', name: 'Venue', date: '2026-10-07' };
let container;
const originalMatchMedia = window.matchMedia;
const originalShare = navigator.share;
const originalClipboard = navigator.clipboard;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    window.matchMedia = jest.fn(() => ({ matches: true }));
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: jest.fn().mockResolvedValue() } });
    act(() => { ReactDOM.render(<ShareGig listing={listing} />, container); });
});
afterEach(() => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
    window.matchMedia = originalMatchMedia;
    navigator.share = originalShare;
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: originalClipboard });
});
test('shares the gig URL through the native share menu', async () => {
    navigator.share = jest.fn().mockResolvedValue();
    await act(async () => { Simulate.click(container.querySelector('button')); });
    expect(navigator.share).toHaveBeenCalledWith({ title: 'Band at Venue', url: buildGigUrl(listing) });
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
});
test('offers copy link when native sharing is unavailable', async () => {
    navigator.share = undefined;
    await act(async () => { Simulate.click(container.querySelector('button')); });
    await act(async () => { Simulate.click(container.querySelector('.gigmap-share-options button')); });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(buildGigUrl(listing));
    expect(container.textContent).toContain('Link copied');
});
test('cancelling the share menu does not copy the link', async () => {
    navigator.share = jest.fn().mockRejectedValue(new DOMException('Cancelled', 'AbortError'));
    await act(async () => { Simulate.click(container.querySelector('button')); });
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
});

test('desktop offers sharing choices even when native sharing is supported', async () => {
    window.matchMedia = jest.fn(() => ({ matches: false }));
    navigator.share = jest.fn();
    await act(async () => { Simulate.click(container.querySelector('.gigmap-share')); });
    expect(navigator.share).not.toHaveBeenCalled();
    const options = container.querySelector('.gigmap-share-options');
    expect(document.activeElement).toBe(options.querySelector('button'));
    expect(options.textContent).toBe('Copy linkEmailFacebookWhatsApp');
    expect(new URL(options.querySelector('a[href^="mailto:"]').href).searchParams.get('body')).toContain(buildGigUrl(listing));
    expect(new URL(options.querySelector('a[href*="facebook.com"]').href).searchParams.get('u')).toBe(buildGigUrl(listing));
    expect(new URL(options.querySelector('a[href*="wa.me"]').href).searchParams.get('text')).toBe(`Band at Venue ${buildGigUrl(listing)}`);
    act(() => { Simulate.keyDown(options.querySelector('button'), { key: 'Escape' }); });
    expect(container.querySelector('.gigmap-share-options')).toBeNull();
    expect(document.activeElement).toBe(container.querySelector('.gigmap-share'));
});

test('clicking outside closes desktop sharing choices', async () => {
    window.matchMedia = jest.fn(() => ({ matches: false }));
    await act(async () => { Simulate.click(container.querySelector('.gigmap-share')); });
    act(() => { document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); });
    expect(container.querySelector('.gigmap-share-options')).toBeNull();
});
