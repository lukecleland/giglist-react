// Builds a self-contained contact sheet from the production renderer.
// Open the output in a browser; ?count=200&photo=1 exercises dense venues.
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const QR = require('react-qr-code').default;
const root = path.resolve(__dirname, '..');
const out = process.argv[2] || '/tmp/giglist-poster-themes.html';
const modules = ['posterDesign', 'posterThemes', 'searchUrl'].map((name) => {
    const js = ts.transpileModule(fs.readFileSync(path.join(root, 'src/utils', name + '.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 } }).outputText;
    return `${JSON.stringify('./' + name)}: function(require,exports,module){${js}}`;
}).join(',');
const fonts = [
    ['carbontyperegular', 'src/styles/font/carbon_2-webfont.woff2', '400'],
    ['Poster Condensed', 'src/styles/font/poster/Anton-Regular.ttf', '400'],
    ['Poster Serif', 'src/styles/font/poster/DMSerifDisplay-Regular.ttf', '400'],
    ['Poster Grotesk', 'src/styles/font/poster/SpaceGrotesk[wght].ttf', '300 700'],
].map(([name, file, weight]) => `@font-face{font-family:"${name}";font-weight:${weight};src:url(data:font/${file.endsWith('woff2') ? 'woff2' : 'ttf'};base64,${fs.readFileSync(path.join(root, file)).toString('base64')})}`).join('\n');
const qr = Buffer.from(renderToStaticMarkup(React.createElement(QR, { value: 'https://giglist.com.au/claytonbolger', size: 1120 }))).toString('base64');
const moment = fs.readFileSync(require.resolve('moment/min/moment.min.js'), 'utf8');
const photoPath = process.argv[3];
const artworkData = Object.fromEntries(fs.readdirSync(path.join(root, 'src/assets/posters')).filter(f => f.endsWith('.jpg')).map(f => [f.slice(0,-4), 'data:image/jpeg;base64,' + fs.readFileSync(path.join(root, 'src/assets/posters', f)).toString('base64')]));
const photoData = photoPath ? 'data:image/jpeg;base64,' + fs.readFileSync(photoPath).toString('base64') : '';
fs.writeFileSync(out, `<!doctype html><meta charset="utf-8"><title>Giglist poster theme proofs</title><style>${fonts}
body{background:#888;margin:20px;font:14px Arial;color:#111}main{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}figure{margin:0}img{width:100%;display:block}figcaption{padding:6px 0;font-weight:bold}h1{font-size:20px}</style><h1>Giglist poster theme proofs</h1><main></main><script>${moment}</script><script>
const modules={${modules}},cache={};function require(id){if(id==='moment')return {default:window.moment};if(!cache[id]){cache[id]={exports:{}};modules[id](require,cache[id].exports,cache[id]);}return cache[id].exports;}
(async()=>{
const p=new URLSearchParams(location.search); if(p.get('theme'))document.querySelector('main').style.gridTemplateColumns='1fr'; const count=Number(p.get('count')||9), hasPhoto=p.has('photo');
await Promise.all(['60px carbontyperegular','100px "Poster Condensed"','100px "Poster Serif"','400 40px "Poster Grotesk"','700 40px "Poster Grotesk"'].map(f=>document.fonts.load(f)));
const qr=new Image();qr.src='data:image/svg+xml;base64,${qr}';await qr.decode();
let photo=null;if(hasPhoto && ${JSON.stringify(photoData)}){photo=new Image();photo.src=${JSON.stringify(photoData)};await photo.decode();}
const names=['Araluen Botanic Park','Indian Ocean Brewing Company','Shoalwater Tavern','Bridge Garden Bar','Henley Brook Tavern','8 Knots Tavern','Brabham Hotel','South Beach Hotel','Bassendean Hotel'];
const gigs=Array.from({length:count},(_,i)=>({artist:'Clayton Bolger & The Midnight Specials',name:names[i%names.length],suburb:['Roleystone','Mindarie','Shoalwater','Mandurah','Henley Brook','East Fremantle','Brabham','South Fremantle','Bassendean'][i%9],state:'WA',date:'2026-10-'+String(i%28+1).padStart(2,'0'),start:'8:30PM'}));
const {posterThemes,drawPoster}=require('./posterDesign');window.posterProofs=[];
const artworkData=${JSON.stringify(artworkData)},artImages={};
await Promise.all(Object.entries(artworkData).map(async([name,src])=>{const img=new Image();img.src=src;await img.decode();artImages[name]=img;}));
for(const theme of posterThemes.filter(t=>!p.get('theme')||t.id===p.get('theme'))){const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=2000;
const art=artImages[p.get('art')||theme.artwork[0]];
const result=drawPoster(canvas.getContext('2d'),{theme:theme.id,title:p.get('title')||(hasPhoto?'The Windsor Hotel':'Clayton Bolger'),targetUrl:'https://giglist.com.au/claytonbolger',qr,photo,artwork:art,gigs,month:9,isVenue:hasPhoto});
window.posterProofs.push({theme:theme.id,...result});const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption');img.src=canvas.toDataURL('image/png');img.alt=theme.name;caption.textContent=theme.name;figure.append(img,caption);document.querySelector('main').append(figure);}
await Promise.all([...document.images].map(i=>i.decode()));document.body.dataset.ready='true';
})().catch(error=>{document.body.dataset.error=error.message;document.body.append(error.stack)});
</script>`);
console.log(out);
