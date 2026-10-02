import QRCode from 'react-qr-code';

export const FeatureFooter = ({url,compact=false}: {url:string;compact?:boolean}) =>
    <footer className={`feature-footer ${compact?'feature-footer-compact':''}`}>
        <div className="feature-footer-qr"><QRCode value={url} size={92} bgColor="#fff" fgColor="#000" /></div>
        <div className="feature-footer-copy"><strong>Scan QR code for gig details &amp; updates</strong><span>{url.replace(/^https?:\/\//,'')}</span></div>
        <div className="feature-footer-brand"><span>Gigs. In a list.</span><b>Giglist</b></div>
    </footer>;
