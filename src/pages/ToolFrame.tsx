import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { FeatureFooter } from './FeatureFooter';
import { searchSlugFromPath } from '../utils/searchUrl';
import './FeaturePages.scss';
import './ToolFrame.scss';

export const ToolFrame = ({title,url,children}: {title:string;url:string;children:ReactNode}) => {
    const slug = searchSlugFromPath(new URL(url, 'https://giglist.com.au').pathname);
    const backUrl = slug ? `/gigwidgets?for=${encodeURIComponent(slug)}` : '/gigwidgets';
    return (
    <div className="tool-frame">
        <header className="tool-header"><Link className="tool-back" to={backUrl} aria-label="Back to tools">← Back</Link><h1>{title}</h1></header>
        <div className="tool-content">{children}</div>
        <FeatureFooter url={url} />
    </div>);
};
