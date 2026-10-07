import React, { useEffect, useRef, useState } from "react";
import "./ShareGig.scss";
import { TListing } from "../types/types";
import { buildGigUrl } from "../utils/gigUrl";

export const ShareGig = ({ listing, className = "" }: { listing: TListing; className?: string }) => {
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const firstOption = useRef<HTMLButtonElement>(null);
    const url = buildGigUrl(listing);
    const title = `${listing.artist} at ${listing.name}`.replace(/&amp;/g, "&");

    useEffect(() => {
        if (!open) return;
        firstOption.current?.focus();
        const dismiss = (event: MouseEvent) => {
            if (!root.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", dismiss);
        return () => document.removeEventListener("mousedown", dismiss);
    }, [open]);

    const share = async () => {
        if (open) { setOpen(false); return; }
        setCopied(false);
        const data = { title, url };
        const mobile = window.matchMedia?.("(pointer: coarse) and (hover: none)").matches;
        if (mobile && navigator.share && (!navigator.canShare || navigator.canShare(data))) {
            try {
                await navigator.share(data);
                return;
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") return;
            }
        }
        setOpen(true);
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch {
            window.prompt("Copy this gig link to share:", url);
        }
    };

    return <div className="gigmap-share-control" ref={root}
        onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
        }}
        onKeyDown={(event) => {
            if (open && event.key === "Escape") {
                event.stopPropagation();
                setOpen(false);
                trigger.current?.focus();
            }
        }}>
        <button ref={trigger} type="button" className={`gigmap-share ${className}`} onClick={share} aria-expanded={open}>
        <span>Share</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4" />
        </svg>
        </button>
        {open && <div className="gigmap-share-options" role="group" aria-label="Share this gig">
            <button ref={firstOption} type="button" onClick={copyLink}><span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span></button>
            <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n${url}`)}`}>Email</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>}
    </div>;
};
