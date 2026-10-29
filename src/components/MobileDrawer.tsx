import React, { useEffect, useRef, useState } from "react";
import { Drawer } from "antd";
import { useLocation } from "react-router-dom";

// Give phone/browser Back the same meaning as the visible close button.
export function useDrawer() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const active = useRef(false);
    useEffect(() => {
        if (!open) return;
        const closeOnBack = () => { active.current = false; setOpen(false); };
        window.addEventListener("popstate", closeOnBack);
        return () => window.removeEventListener("popstate", closeOnBack);
    }, [open]);
    useEffect(() => { active.current = false; setOpen(false); }, [location.key]);
    return {
        open,
        show: () => {
            if (active.current) return;
            window.history.pushState({ ...window.history.state, idx: (window.history.state?.idx || 0) + 1, giglistDrawer: true }, "");
            active.current = true;
            setOpen(true);
        },
        close: () => {
            if (active.current) window.history.back();
            active.current = false;
            setOpen(false);
        },
    };
}

export function MobileDrawer({ open, close, title, fullScreen = false, children }: {
    open: boolean; close: () => void; title: string; fullScreen?: boolean; children: React.ReactNode;
}) {
    const hasOpened = useRef(false);
    if (open) hasOpened.current = true;
    if (!hasOpened.current) return null;
    return <Drawer open={open} onClose={close} title={title} placement="right"
        width={fullScreen ? "100%" : "min(88vw, 360px)"} destroyOnClose
        className={`mobile-drawer${fullScreen ? " mobile-event-drawer" : ""}`}
        closeIcon={<span aria-hidden="true">{fullScreen ? "←" : "×"}</span>}
        zIndex={1200}>
        {children}
    </Drawer>;
}
