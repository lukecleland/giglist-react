import { useEffect, useMemo, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import QRCode from 'react-qr-code';
import axios from 'axios';
import moment from 'moment';
import { Helmet } from 'react-helmet-async';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { mapStyles } from '../styles/mapStyles';
import { TListing, TGiglist } from '../types/types';
import { normalizeGigText } from '../utils/normalizeGigText';
import { getTourProfile } from '../utils/tourProfile';
import { featureGigs, gigDateLabel, gigDisplayName, gigSecondaryName } from '../utils/featureGigs';
import { FeatureRoute } from '../utils/featureRoutes';
import { posterMonths } from '../utils/qrUrl';
import { calendarIcs } from '../utils/calendarFeed';
import { buildGigPath } from '../utils/gigUrl';
import { posterArtwork, loadPosterImage } from '../utils/posterArtwork';
import { drawSocialCard, SocialFormat, SocialPalette } from '../utils/socialCard';
import { FeatureFooter } from './FeatureFooter';
import './FeaturePages.scss';

const periodLabel = (route: FeatureRoute) => route.month === undefined ? 'Live music · coming up' : `Live music in ${moment().month(route.month).format('MMMM')}`;
const clean = (value: string) => value.replace(/&amp;/gi, '&');

const useFeatureFeed = (slug: string, month?: number) => {
    const [dates,setDates] = useState<TGiglist>([]);
    const [status,setStatus] = useState<'loading'|'ready'|'error'>('loading');
    useEffect(() => {
        let active = true;
        const refresh = () => axios.get('https://giglist.com.au/feed_national.php',{timeout:15000})
            .then(response => {if(active){setDates(normalizeGigText(response.data as TGiglist));setStatus('ready');}})
            .catch(() => {if(active) setStatus(previous => previous === 'ready' ? 'ready' : 'error');});
        void refresh();
        const timer = window.setInterval(refresh,10*60*1000);
        return () => {active=false;window.clearInterval(timer);};
        // Keep a live screen and subscription preview fresh without refetching on every render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[slug]);
    const profile = useMemo(() => getTourProfile(dates,slug),[dates,slug]);
    const gigs = useMemo(() => featureGigs(dates,slug,month).filter(gig => gig.date >= moment().format('YYYY-MM-DD')),[dates,slug,month]);
    return {profile,gigs,status};
};

const ListingLink = ({gig,title,sub}: {gig:TListing;title:string;sub:string}) =>
    <a className="feature-gig" href={buildGigPath(gig)}>
        <time dateTime={gig.date}>{gigDateLabel(gig)}</time>
        <strong>{title}</strong>
        <span>{sub}</span>
    </a>;

const EmbedView = ({route,gigs,profile}: {route:FeatureRoute;gigs:TListing[];profile:ReturnType<typeof getTourProfile>}) => {
    const embedded = new URLSearchParams(window.location.search).has('embed');
    const themes=['giglist','night','paper','colour'] as const;
    type EmbedTheme = typeof themes[number];
    const initialTheme=new URLSearchParams(window.location.search).get('theme');
    const [theme,setTheme]=useState<EmbedTheme>(themes.includes(initialTheme as EmbedTheme)?initialTheme as EmbedTheme:'giglist');
    const iframeHeight = 240 + Math.min(gigs.length,10)*73;
    const snippet = `<iframe src="${route.targetUrl}_embed${route.month === undefined ? '' : '_'+posterMonths[route.month]}?embed=1&theme=${theme}" title="${profile.title.replace(/"/g,'&quot;')} gigs" loading="lazy" style="width:100%;height:${iframeHeight}px;border:0"></iframe>`;
    const [copied,setCopied] = useState(false);
    return <div className={`feature-embed ${embedded ? 'feature-embed-only' : ''}`}>
        {!embedded && <div className="feature-tools"><h1>Embed {profile.title} gigs</h1><p>Put this live gig list on your website. It updates as Giglist adds shows.</p><label htmlFor="embed-theme">Theme</label><select id="embed-theme" value={theme} onChange={event=>{setTheme(event.target.value as EmbedTheme);setCopied(false);}}><option value="giglist">Giglist</option><option value="night">Night</option><option value="paper">Paper</option><option value="colour">Colour</option></select><label htmlFor="embed-code">Copy this code</label><textarea id="embed-code" readOnly value={snippet} /><button onClick={() => {void navigator.clipboard?.writeText(snippet).then(() => setCopied(true));}}>{copied?'Copied':'Copy embed code'}</button></div>}
        <section className={`feature-embed-card feature-embed-${theme}`} aria-label={`${profile.title} upcoming gigs`}>
            <header><div className="feature-embed-kicker"><span className="feature-embed-logo">Giglist</span><small>{periodLabel(route).toUpperCase()}</small></div><h2>{profile.title}</h2></header>
            {gigs.length ? gigs.slice(0,10).map((gig,index) => <ListingLink key={`${gig.id}-${index}`} gig={gig} title={gigDisplayName(gig,profile.isVenue,profile.isSuburb)} sub={gigSecondaryName(gig,profile.isVenue,profile.isSuburb)} />) : <p className="feature-empty">No upcoming gigs listed.</p>}
            <a className="feature-embed-more" href={route.targetUrl} target="_blank" rel="noopener noreferrer">See all gigs on Giglist ↗</a>
            <FeatureFooter url={route.targetUrl} compact />
        </section>
    </div>;
};

const CalendarView = ({route,gigs,title}: {route:FeatureRoute;gigs:TListing[];title:string}) => {
    const [downloadUrl,setDownloadUrl] = useState('');
    useEffect(() => {
        const calendarTitle=route.month === undefined ? title : `${title} · ${moment().month(route.month).format('MMMM')}`;
        const url=URL.createObjectURL(new Blob([calendarIcs(calendarTitle,route.targetUrl,gigs)],{type:'text/calendar;charset=utf-8'}));
        setDownloadUrl(url);
        return () => URL.revokeObjectURL(url);
    },[gigs,route.targetUrl,route.month,title]);
    const feedUrl=`https://giglist.com.au/calendar.php?slug=${encodeURIComponent(route.slug)}${route.month === undefined ? '' : '&month='+posterMonths[route.month]}`;
    return <div className="feature-standard"><header><small>NEVER MISS A GIG</small><h1>{title} calendar</h1><p>{periodLabel(route)}</p><p>Subscribe to keep upcoming gigs in your calendar, or download a snapshot.</p></header>
        <div className="feature-actions"><a href={feedUrl.replace(/^https:/,'webcal:')}>Subscribe to calendar</a><a href={downloadUrl||'#'} download={`giglist-${route.slug}.ics`}>Download .ics</a></div>
        <p className="feature-hint">For Google Calendar, add this feed URL under “From URL”: <code>{feedUrl}</code></p>
        <div className="feature-calendar-list">{gigs.length?gigs.slice(0,30).map((gig,index)=><ListingLink key={`${gig.id}-${index}`} gig={gig} title={clean(gig.artist)} sub={clean(gig.name)}/>):<p>No upcoming gigs listed.</p>}</div><FeatureFooter url={route.targetUrl} />
    </div>;
};

const ScreenView = ({route,gigs,profile}: {route:FeatureRoute;gigs:TListing[];profile:ReturnType<typeof getTourProfile>}) => {
    const [page,setPage] = useState(0);
    const upcoming = gigs.filter(gig=>gig.date >= moment().format('YYYY-MM-DD'));
    const pages=Math.max(1,Math.ceil(upcoming.length/6));
    useEffect(()=>{const timer=window.setInterval(()=>setPage(current=>(current+1)%pages),12000);return()=>window.clearInterval(timer);},[pages]);
    return <div className="feature-screen"><div className="feature-screen-top"><span>{periodLabel(route).toUpperCase()}</span><span className="feature-screen-brand">Giglist</span></div><h1>{profile.title}</h1>
        <div className="feature-screen-list">{upcoming.length?upcoming.slice(page*6,page*6+6).map((gig,index)=><ListingLink key={`${gig.id}-${index}`} gig={gig} title={gigDisplayName(gig,profile.isVenue,profile.isSuburb)} sub={gigSecondaryName(gig,profile.isVenue,profile.isSuburb)}/>):<p>More live music coming soon.</p>}</div>
        <div className="feature-screen-page">{page+1} / {pages}</div><FeatureFooter url={route.targetUrl} />
    </div>;
};

const MapView = ({route,gigs,profile}: {route:FeatureRoute;gigs:TListing[];profile:ReturnType<typeof getTourProfile>}) => {
    const futureDates=Array.from(new Set(gigs.filter(gig=>gig.date>=moment().format('YYYY-MM-DD')).map(gig=>gig.date))).sort();
    const [selectedDate,setSelectedDate]=useState('');
    const date=selectedDate||futureDates[0]||'';
    const [selected,setSelected]=useState<string|null>(null);
    const mapRef=useRef<google.maps.Map|null>(null);
    const points=useMemo(()=>{
        const grouped=new Map<string,{position:{lat:number;lng:number};gigs:TListing[]}>();
        gigs.filter(gig=>gig.date===date).forEach(gig=>{
            const lat=Number(gig.lat),lng=Number(gig.lng);
            if(!gig.lat||!gig.lng||!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180||!lat&&!lng)return;
            const key=`${lat},${lng}`;
            const point=grouped.get(key)||{position:{lat,lng},gigs:[]};point.gigs.push(gig);grouped.set(key,point);
        });
        return Array.from(grouped.entries()).map(([key,value])=>({key,...value}));
    },[gigs,date]);
    const {isLoaded,loadError}=useJsApiLoader({id:'google-map-script',googleMapsApiKey:'AIzaSyDTkZauLKxFmJ3qW2jKsgjLvgt30kqJ3AM'});
    const fitPoints = (map: google.maps.Map) => {
        if(!points.length)return;
        if(points.length===1){map.setCenter(points[0].position);map.setZoom(14);return;}
        const bounds=new window.google.maps.LatLngBounds();points.forEach(point=>bounds.extend(point.position));map.fitBounds(bounds,48);
    };
    useEffect(()=>{
        const map=mapRef.current;if(map)fitPoints(map);
        // Refit when the selected day changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[points,isLoaded]);
    const selectedPoint=points.find(point=>point.key===selected);
    return <div className="feature-map"><header><h1>{profile.title} gig map{route.month === undefined ? '' : ' · '+moment().month(route.month).format('MMMM')}</h1><a href={route.targetUrl}>View all gigs ↗</a></header><div className="feature-map-date"><label htmlFor="feature-map-day">Show gigs on</label><select id="feature-map-day" value={date} onChange={event=>{setSelectedDate(event.target.value);setSelected(null);}}>{futureDates.map(day=><option key={day} value={day}>{moment(day).format('dddd D MMM YYYY')}</option>)}</select><span>{points.length} venue{points.length===1?'':'s'}</span></div>
        <div className="feature-map-canvas">{loadError?<p role="alert">The map couldn’t load.</p>:!isLoaded?<p>Loading map…</p>:!points.length?<p>No mapped venues for this date.</p>:<GoogleMap mapContainerStyle={{width:'100%',height:'100%'}} onLoad={map=>{mapRef.current=map;fitPoints(map);}} onUnmount={()=>{mapRef.current=null;}} options={{styles:mapStyles,zoomControl:true,disableDefaultUI:true}} center={points[0].position} zoom={12}>{points.map(point=><Marker key={point.key} position={point.position} onClick={()=>setSelected(point.key)}/>)}</GoogleMap>}
            {isLoaded&&selectedPoint&&<div className="feature-map-selected"><button aria-label="Close venue details" onClick={()=>setSelected(null)}>×</button>{selectedPoint.gigs.map((gig,index)=><ListingLink key={`${gig.id}-${index}`} gig={gig} title={clean(gig.artist)} sub={clean(gig.name)}/>)}</div>}</div>
        <FeatureFooter url={route.targetUrl} compact />
    </div>;
};

const SocialView = ({route,gigs,profile}: {route:FeatureRoute;gigs:TListing[];profile:ReturnType<typeof getTourProfile>}) => {
    const [format,setFormat]=useState<SocialFormat>('story');
    const [palette,setPalette]=useState<SocialPalette>('midnight');
    const [imageKey,setImageKey]=useState('concertlights');
    const [png,setPng]=useState('');
    const canvasRef=useRef<HTMLCanvasElement>(null);
    const start=moment().startOf('day'),end=start.clone().add(7,'days');
    const weekly=useMemo(()=>route.month === undefined ? gigs.filter(gig=>moment(gig.date).isSameOrAfter(start)&&moment(gig.date).isBefore(end)) : gigs,[gigs,route.month]);
    useEffect(()=>{
        let cancelled=false;
        const render=async()=>{
            try{
                const image=await loadPosterImage(posterArtwork[imageKey]);
                const qrMarkup=renderToStaticMarkup(<QRCode value={route.targetUrl} size={128} bgColor="#fff" fgColor="#000" />);
                const qr=new Image();
                qr.src=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrMarkup)}`;
                await qr.decode();
                await Promise.all([document.fonts.load('700 42px "Poster Grotesk"'),document.fonts.load('39px "carbontyperegular"')]);
                if(cancelled||!canvasRef.current)return;
                drawSocialCard(canvasRef.current,{title:profile.title,targetUrl:route.targetUrl,gigs:weekly,image,qr,periodLabel:route.month === undefined ? undefined : periodLabel(route).toUpperCase(),format,palette,isVenue:profile.isVenue,isSuburb:profile.isSuburb});
                setPng(canvasRef.current.toDataURL('image/png'));
            }catch{if(!cancelled)setPng('');}
        };void render();return()=>{cancelled=true;};
    },[format,palette,imageKey,profile.title,profile.isVenue,profile.isSuburb,route.targetUrl,route.month,weekly]);
    const images=['concertlights','gigcrowd','acousticroom','electricguitar','citylights','pianoroom','microphone','sunrisepeaks'];
    return <div className="feature-social"><header><h1>{profile.title} social card</h1><p>{route.month === undefined ? 'Share the next seven days of live music.' : periodLabel(route)+'.'}</p></header><div className="feature-social-controls"><label><select aria-label="Size" value={format} onChange={event=>setFormat(event.target.value as SocialFormat)}><option value="story">Story · 1080 × 1920</option><option value="square">Square · 1080 × 1080</option></select></label><label><select aria-label="Colour" value={palette} onChange={event=>setPalette(event.target.value as SocialPalette)}><option value="midnight">Midnight</option><option value="sunset">Sunset</option><option value="paper">Paper</option></select></label><button onClick={()=>setImageKey(current=>images[(images.indexOf(current)+1)%images.length])}>Shuffle image</button>{png&&<a download={`giglist-${route.slug}-${format}.png`} href={png}>Download PNG</a>}</div><canvas ref={canvasRef} className="feature-social-canvas" aria-label={`${profile.title} live music social graphic`} /><FeatureFooter url={route.targetUrl} /></div>;
};

export const FeaturePage = ({route}: {route:FeatureRoute}) => {
    const {profile,gigs,status}=useFeatureFeed(route.slug,route.month);
    useEffect(()=>{document.body.classList.add('feature-body');return()=>document.body.classList.remove('feature-body');},[]);
    if(status==='loading')return <div className="feature-status" role="status">Loading gigs…</div>;
    if(status==='error')return <div className="feature-status" role="alert">Gigs couldn’t load. Refresh to try again.</div>;
    const title=`${profile.title} ${route.kind} | Giglist`;
    return <><Helmet><title>{title}</title><meta name="robots" content={route.kind==='embed'||route.kind==='screen'?'noindex, follow':'index, follow'}/></Helmet>
        {route.kind==='embed'?<EmbedView route={route} gigs={gigs} profile={profile}/>:route.kind==='calendar'?<CalendarView route={route} gigs={gigs} title={profile.title}/>:route.kind==='screen'?<ScreenView route={route} gigs={gigs} profile={profile}/>:route.kind==='map'?<MapView route={route} gigs={gigs} profile={profile}/>:<SocialView route={route} gigs={gigs} profile={profile}/>}
    </>;
};
