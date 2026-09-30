import React from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { StaticRouter } from "react-router-dom/server";
import { UtilityPageMetadata } from "./UtilityPageMetadata";

test.each(["/location", "/supporters", "/editor", "/location/"])("excludes utility page %s from indexing", (path) => {
    const context = {};
    const previous = HelmetProvider.canUseDOM;
    HelmetProvider.canUseDOM = false;
    try {
        renderToString(<HelmetProvider context={context}><StaticRouter location={path}><UtilityPageMetadata /></StaticRouter></HelmetProvider>);
        expect(context.helmet.meta.toString()).toContain('content="noindex, follow"');
        expect(context.helmet.title.toString()).toContain("Giglist");
    } finally { HelmetProvider.canUseDOM = previous; }
});

test.each(["/", "/search", "/gigmap", "/store", "/about", "/submit", "/claytonbulger", "/gig-artist-venue-date"])("preserves indexing of public content %s", (path) => {
    const context = {};
    const previous = HelmetProvider.canUseDOM;
    HelmetProvider.canUseDOM = false;
    try {
        renderToString(<HelmetProvider context={context}><StaticRouter location={path}><UtilityPageMetadata /></StaticRouter></HelmetProvider>);
        expect(context.helmet?.meta.toString() || "").not.toContain("noindex");
    } finally { HelmetProvider.canUseDOM = previous; }
});
