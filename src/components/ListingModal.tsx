import React, { useEffect, useState } from "react";
import { TListing } from "../types/types";
import { Listing } from "./Listing/Listing";
import { PageListing } from "./PageListing/PageListing";

export const ListingModal = ({ listing, children }: { listing: TListing; children?: React.ReactNode }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    return (
        <>
            <div
                role="button"
                tabIndex={0}
                onClick={() => setOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpen(true);
                    }
                }}
                style={{ cursor: "pointer" }}
            >
                {children || <Listing listing={listing} />}
            </div>

            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 1000,
                        backgroundColor: "rgba(0, 0, 0, 0.72)",
                        overflowY: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px",
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "1200px",
                            border: "4px solid #fff",
                            borderRadius: "20px",
                            overflow: "hidden",
                        }}
                    >
                        <button
                            aria-label="Close listing"
                            onClick={() => setOpen(false)}
                            style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                zIndex: 1001,
                                border: "none",
                                borderRadius: "50%",
                                background: "#fff",
                                color: "#111",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 0,
                                width: "32px",
                                height: "32px",
                                boxShadow: "0 1px 5px #0006",
                                cursor: "pointer",
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" focusable="false">
                                <path d="m6 6 12 12M18 6 6 18" />
                            </svg>
                        </button>
                        <PageListing listing={listing} />
                    </div>
                </div>
            )}
        </>
    );
};
