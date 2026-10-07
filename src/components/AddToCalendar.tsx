import React from "react";
import { Icon } from "semantic-ui-react";
import { TListing } from "../types/types";
import { calendarIcs } from "../utils/calendarFeed";
import { buildGigUrl, slugifySegment } from "../utils/gigUrl";

export const AddToCalendar = ({ listing, className }: { listing: TListing; className?: string }) => (
    <a
        className={className}
        href={`data:text/calendar;charset=utf-8,${encodeURIComponent(calendarIcs(listing.artist, buildGigUrl(listing), [listing]))}`}
        download={`${slugifySegment(`${listing.artist}-${listing.date}`)}.ics`}
    >
        <span>Add to calendar</span><Icon name="calendar alternate outline" />
    </a>
);
