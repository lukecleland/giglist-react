import { Event } from 'schema-dts';
import { helmetJsonLdProp } from 'react-schemaorg';
import { Helmet } from 'react-helmet-async';
import { TListing } from '../types/types';
import { buildEventSchema } from '../utils/eventSchema';

export const EventSchema = ({ gig }: { gig: TListing }) => {
    const event = buildEventSchema(gig);
    if (!event) return null;
    return <Helmet><script {...helmetJsonLdProp<Event>({ '@context': 'https://schema.org', ...event })} /></Helmet>;
};
