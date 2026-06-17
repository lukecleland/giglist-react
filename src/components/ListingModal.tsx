import React, { useEffect, useState } from "react";
import { TListing } from "../types/types";
import { Listing } from "./Listing/Listing";
import { PageListing } from "./PageListing/PageListing";

export const ListingModal = ({ listing }: { listing: TListing }) => {
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
                <Listing listing={listing} />
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
                            border: "10px solid #fff",
                            borderRadius: "5px",
                            overflow: "hidden",
                        }}
                    >
                        <button
                            aria-label="Close listing"
                            onClick={() => setOpen(false)}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                zIndex: 1001,
                                border: "none",
                                borderRadius: "4px",
                                background: "rgba(0, 0, 0, 0.7)",
                                color: "#fff",
                                fontSize: "22px",
                                lineHeight: 1,
                                width: "34px",
                                height: "34px",
                                cursor: "pointer",
                            }}
                        >
                            x
                        </button>
                        <PageListing listing={listing} />
                    </div>
                </div>
            )}
        </>
    );
};
