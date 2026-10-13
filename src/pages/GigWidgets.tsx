import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Icon, SemanticICONS } from 'semantic-ui-react';
import { TGiglist } from '../types/types';
import { normalizeGigText } from '../utils/normalizeGigText';
import { compactName } from '../utils/searchUrl';
import { searchWidgetSubjects, widgetSubjects, WidgetSubject } from '../utils/widgetSearch';
import { FeatureFooter } from './FeatureFooter';
import './FeaturePages.scss';
import './GigWidgets.scss';

const tools: {suffix: string; name: string; description: string; icon: SemanticICONS}[] = [
    {suffix:'_poster',name:'Poster',description:'Create a printable gig poster with your own style and imagery.',icon:'file image outline'},
    {suffix:'_qr',name:'QR Code',description:'Make a QR graphic that links straight to the latest gigs.',icon:'qrcode'},
    {suffix:'_social',name:'Social Card',description:'Create a story or square graphic ready to share.',icon:'images outline'},
    {suffix:'_embed',name:'Website Embed',description:'Add an updating gig list to your website.',icon:'code'},
    {suffix:'_calendar',name:'Calendar',description:'Browse dates and add upcoming gigs to your calendar.',icon:'calendar alternate outline'},
    {suffix:'_screen',name:'Venue Screen',description:'Display upcoming gigs on a full-screen rotating board.',icon:'desktop'},
    {suffix:'_map',name:'Gig Map',description:'Explore the gigs and venues on an interactive map.',icon:'map outline'},
    {suffix:'',name:'Gig Listings',description:'Open the shareable page with all matching gigs.',icon:'list'},
];

const rememberedSubjects = new Map<string, WidgetSubject>();

export const GigWidgets = () => {
    const [params,setParams] = useSearchParams();
    const [dates,setDates] = useState<TGiglist>([]);
    const [status,setStatus] = useState<'loading'|'ready'|'error'>('loading');
    const [retry,setRetry] = useState(0);
    const [query,setQuery] = useState('');
    const [message,setMessage] = useState('');
    const heading = useRef<HTMLHeadingElement>(null);
    const input = useRef<HTMLInputElement>(null);
    const subjects = useMemo(()=>widgetSubjects(dates),[dates]);
    const results = useMemo(()=>searchWidgetSubjects(subjects,query),[subjects,query]);
    const selectedSlug = params.get('for') || '';
    const selected = subjects.find(subject=>subject.slug===selectedSlug) || (status!=='ready' ? rememberedSubjects.get(selectedSlug) : undefined);
    useEffect(()=>{
        document.body.classList.add('gigwidgets-body');
        return ()=>document.body.classList.remove('gigwidgets-body');
    },[]);
    useEffect(()=>{
        const controller=new AbortController();
        setStatus('loading');
        axios.get('https://giglist.com.au/feed_national.php',{timeout:15000,signal:controller.signal})
            .then(({data})=>{if(!controller.signal.aborted){setDates(normalizeGigText(data));setStatus('ready');}})
            .catch(()=>{if(!controller.signal.aborted)setStatus('error');});
        return ()=>controller.abort();
    },[retry]);
    useEffect(()=>{
        if(selected){
            rememberedSubjects.set(selected.slug,selected);
            heading.current?.focus();
        }
    },[selected]);
    const select = (subject: WidgetSubject) => {setMessage('');setParams({for:subject.slug});};
    const submit = (event: FormEvent) => {
        event.preventDefault();
        const exact=results.find(subject=>subject.slug===compactName(query));
        if(exact)select(exact);
        else if(results.length===1)select(results[0]);
        else setMessage(results.length ? 'Choose a match below.' : 'No matches found. Try another name or location.');
    };
    const reset = () => {setParams({});setQuery('');setMessage('');requestAnimationFrame(()=>input.current?.focus());};
    return <div className="gigwidgets-page">
        <Helmet><title>Gigwidgets | Giglist</title><link rel="canonical" href="https://giglist.com.au/gigwidgets" /><meta name="description" content="Create posters, QR codes, social cards and more for your artist, venue, suburb or city." /></Helmet>
        <header className="gigwidgets-header"><Link to="/gigwidgets" onClick={()=>{setQuery('');setMessage('');}}>Gigwidgets</Link></header>
        <main className={`gigwidgets-main${selectedSlug&&selected?' has-selection':''}`}>
            {selectedSlug&&selected ? <div className="gigwidgets-tools">
                <button className="gigwidgets-back" onClick={reset}>← New search</button>
                <p className="gigwidgets-kicker">{selected.kind}</p>
                <h1 ref={heading} tabIndex={-1}>{selected.name}</h1>
                <p className="gigwidgets-intro">Choose a tool to get started.</p>
                <p className="gigwidgets-alpha-note">* Please note, these experimental tools are new and in alpha development.</p>
                <nav className="gigwidgets-cards" aria-label={`Tools for ${selected.name}`}>
                    {tools.filter(tool=>selected.kind!=='Venue'||tool.suffix!=='_map').map(tool=><Link key={tool.name} to={`/${encodeURIComponent(selected.slug)}${tool.suffix}`} className="gigwidgets-card">
                        <Icon name={tool.icon} aria-hidden="true" /><h2>{tool.name}</h2><p>{tool.description}</p><span aria-hidden="true">Open tool ↗</span>
                    </Link>)}
                </nav>
            </div> : selectedSlug && status!=='ready' ? <div className="gigwidgets-loading">
                <p role="status">{status==='error'?'Tools couldn’t load. Please try again.':'Loading tools…'}</p>
                {status==='error'&&<button className="gigwidgets-retry" onClick={()=>setRetry(value=>value+1)}>Retry</button>}
            </div> : <div className="gigwidgets-search">
                <form onSubmit={submit}>
                    <label htmlFor="gigwidgets-query">Search for your Artist Name / Venue / Suburb / City</label>
                    <div className="gigwidgets-search-row"><input ref={input} id="gigwidgets-query" type="search" placeholder="Start typing a name or location…" autoComplete="off" value={query} onChange={event=>{setQuery(event.target.value);setMessage('');}} aria-describedby="gigwidgets-search-status" /><button type="submit" disabled={status!=='ready'||compactName(query).length<2}>Search</button></div>
                </form>
                <div id="gigwidgets-search-status" role="status">
                    {status==='loading'?'Loading artists and locations…':status==='error'?'Search couldn’t load. Please try again.':message||(selectedSlug?'That name is no longer available. Search again below.':compactName(query).length>=2 ? results.length ? `${results.length} matches`:'No matches found. Try another name or location.':'')}
                </div>
                {status==='error'&&<button className="gigwidgets-retry" onClick={()=>setRetry(value=>value+1)}>Retry</button>}
                {status==='ready'&&results.length>0&&<ul className="gigwidgets-results" aria-label="Search results">{results.slice(0,20).map(subject=><li key={subject.slug}><button onClick={()=>select(subject)}><span>{subject.name}</span><small>{subject.kind}</small></button></li>)}</ul>}
                {status==='ready'&&results.length>20&&<p className="gigwidgets-hint">Showing the first 20 matches. Keep typing to narrow your search.</p>}
            </div>}
        </main>
        <FeatureFooter url={selectedSlug&&selected ? `https://giglist.com.au/${selected.slug}` : 'https://giglist.com.au/gigwidgets'} />
    </div>;
};
