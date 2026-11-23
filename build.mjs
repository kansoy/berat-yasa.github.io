import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {name,email,profiles,topics,programming,content} from './source/content.mjs';
import {renderModel} from './site/assets/chart.mjs';

const root=dirname(fileURLToPath(import.meta.url));
const site=join(root,'site'), origin='https://beratyasa.com';
const print=process.env.CV_PRINT_DIR&&resolve(process.env.CV_PRINT_DIR);
const filenames=['style.css','notebook.mjs','chart.mjs'];
const fingerprint=createHash('sha256');
for(const f of filenames)fingerprint.update(await readFile(join(site,'assets',f)));
const version=fingerprint.update(JSON.stringify(content)).digest('hex').slice(0,10);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const pathFor=lang=>lang==='en'?'/':'/tr/';
const pdfFor=lang=>'/assets/berat-yasa-cv-'+lang+'.pdf';
const icon=k=>`<svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 32 32"><use href="/assets/icons.svg#${k}"/></svg>`;
const external=icon('external');
const brand='<img src="/assets/berat-mark.svg" width="39" height="39" alt="">';
const contact=(cls,body)=>`<!--email_off--><a class="${cls}" href="mailto:${email}">${body}</a><!--/email_off-->`;
const cvLink=(lang,cls,c)=>`<a class="${cls}" href="${pdfFor(lang)}" download>${icon('download')}${c.cv}</a>`;
function language(lang,c){
  return `<div class="languages" role="group" aria-label="${c.language}">${['en','tr'].map(l=>`<a lang="${l}" hreflang="${l}" href="${pathFor(l)}" aria-label="${l==='en'?'English':'Türkçe'}" ${lang===l?'aria-current="page"':''}>${l.toUpperCase()}</a>`).join('<span aria-hidden="true">/</span>')}</div>`;
}
function head(c,lang){
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(c.title)}</title><meta name="description" content="${esc(c.description)}"><meta name="theme-color" content="#19354a"><link rel="icon" type="image/svg+xml" href="/assets/berat-mark.svg"><link rel="canonical" href="${origin}${pathFor(lang)}"><link rel="alternate" hreflang="en" href="${origin}/"><link rel="alternate" hreflang="tr" href="${origin}/tr/"><link rel="alternate" hreflang="x-default" href="${origin}/"><meta property="og:type" content="website"><meta property="og:url" content="${origin}${pathFor(lang)}"><meta property="og:title" content="${esc(c.title)}"><meta property="og:description" content="${esc(c.description)}"><meta property="og:image" content="${origin}/assets/berat-portfolio.jpg?v=${version}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:locale" content="${lang==='en'?'en_GB':'tr_TR'}"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="/assets/fonts/fonts.css"><link rel="stylesheet" href="/assets/style.css?v=${version}"><noscript><link rel="stylesheet" href="/assets/static.css"></noscript><script type="module" src="/assets/notebook.mjs?v=${version}"></script>`;
}
function lab(c,lang){
  const first=topics[0], chart=renderModel(first.id,first.initial,lang);
  const tabs=topics.map((t,i)=>`<button role="tab" id="tab-${t.id}" aria-selected="${i===0}" aria-controls="model-${t.id}" tabindex="${i===0?'0':'-1'}" data-model="${t.id}" data-min="${t.min}" data-max="${t.max}" data-step="${t.step}" data-initial="${t.initial}" data-unit="${t.unit}" data-label="${esc(c.models[i].label)}" data-context="${esc(c.models[i].context)}">${c.models[i].tab}</button>`).join('');
  const panels=topics.map((t,i)=>`<div class="model-note" role="tabpanel" tabindex="0" aria-labelledby="tab-${t.id}" id="model-${t.id}" ${i?'hidden':''}><h3>${c.models[i].title}</h3><p>${c.models[i].text}</p><p class="equation" dir="ltr">${t.formula}</p><a class="source" href="${t.source}">${c.source} ${t.publisher} ${external}</a></div>`).join('');
  return `<section id="notebook" class="notebook"><div class="wrap"><div class="section-head"><h2>${c.notebook}</h2><p>${c.notebookIntro}</p></div><div class="lab"><div class="plot-side"><div class="tabs" role="tablist" aria-label="${c.choose}">${tabs}</div><div class="plot-top"><span class="plot-context">${c.models[0].context}</span><output class="model-result" aria-label="${c.result}" dir="ltr">${chart.result}</output></div><svg class="notebook-plot" role="img" aria-label="${c.models[0].title}" aria-describedby="model-vector" viewBox="0 0 600 284" width="600" height="284">${chart.picture}</svg><div class="range-area"><label for="knob" class="parameter-label">${c.models[0].label}</label><output for="knob" class="value">35°</output><input id="knob" type="range" min="0" max="180" step="1" value="35"></div></div><div class="notes">${panels}<noscript><p>${c.staticNote}</p></noscript></div></div></div></section>`;
}
function page(lang){
 const c=content[lang];
 const nav=`<a href="#background">${c.edu}</a><a href="#skills">${c.skills}</a><a href="#notebook">${c.notebook}</a>`;
 return `<!doctype html><html lang="${lang}"><head>${head(c,lang)}</head><body id="top"><a class="skip" href="#main">${c.skip}</a>
 <header class="mast"><div class="wrap mast-inner"><a class="brand" href="${pathFor(lang)}">${brand}<span>${name}</span></a><nav class="desktop-nav" aria-label="${c.nav}">${nav}</nav>${language(lang,c)}<a class="mast-contact" href="#contact">${c.contact} ${external}</a><details class="compact-nav"><summary>${c.menu}</summary><nav aria-label="${c.nav}">${nav}<a href="#contact">${c.contact}</a></nav></details></div></header>
 <main id="main"><section class="hero"><div class="wrap hero-inner"><div class="hero-copy"><p class="availability"><i aria-hidden="true"></i>${c.availability}</p><h1>${name}</h1><p class="discipline">${c.field}</p><p class="intro">${c.intro}</p><div class="actions">${cvLink(lang,'primary',c)}${contact('secondary',icon('mail')+c.getInTouch)}</div></div>
 <figure class="portrait"><img src="/assets/berat-yasa.webp" width="760" height="950" fetchpriority="high" alt="${c.portraitAlt}"><figcaption>${c.city}</figcaption></figure></div></section>
 <section class="education" id="background"><div class="wrap"><div class="section-head"><h2>${c.edu}</h2><p>${c.educationText}</p></div><div class="academic-row"><div class="school"><h3>${c.uni}</h3><p>${c.degree}</p></div><dl><div><dt>${c.teaching}</dt><dd>${c.english}</dd></div><div><dt>${c.finish}</dt><dd>${c.date}</dd></div></dl></div></div></section>
 <section class="skills wrap" id="skills"><div class="section-head"><h2>${c.skills}</h2><p>${c.skillsIntro}</p></div>
 <div class="skill-grid"><article><div class="skill-title">${icon('chip')}<h3>${c.programmingTitle}</h3></div><ul class="chips">${programming.map(x=>`<li>${x}</li>`).join('')}</ul><h4>${c.hardwareTitle}</h4><p>Arduino</p></article><article><div class="skill-title">${icon('scope')}<h3>${c.coursesTitle}</h3></div><ul class="course-list">${c.courses.map(x=>`<li>${x}</li>`).join('')}</ul></article><article><div class="skill-title">${icon('circuit')}<h3>${c.projectTitle}</h3></div><p>${c.projectText}</p></article></div>
 <dl class="details-grid"><div><dt>${c.toolsTitle}</dt><dd>${c.creative}. ${c.office}.</dd></div><div><dt>${c.certificates}</dt><dd>${c.certText}</dd></div><div><dt>${c.languagesTitle}</dt><dd>${c.languagesText}</dd></div></dl></section>
 ${lab(c,lang)}
 <section id="contact" class="contact"><div class="wrap contact-inner"><div><h2>${c.aspirations}</h2><p>${c.contactText}</p><p class="references">${c.references}</p></div><div class="contact-actions">${contact('email',email+' '+external)}<nav aria-label="${c.social}">${profiles.map(p=>`<a href="${p.url}" rel="me">${p.name} ${external}</a>`).join('')}</nav>${cvLink(lang,'foot-cv',c)}</div></div></section></main><footer class="wrap footer"><span>${name}</span><a href="#top">${c.back} ↑</a></footer></body></html>`;
}
function printPage(lang){
 const c=content[lang],assets=join(site,'assets');
 return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${name} | ${c.cvTitle}</title><link rel="stylesheet" href="${pathToFileURL(join(assets,'fonts/fonts.css')).href}"><style>
 @page{size:A4;margin:17mm 19mm}*{box-sizing:border-box}body{margin:0;font:10.5pt/1.45 'DM Sans',Arial,sans-serif;color:#182e40}h1,h2,h3,p,ul{margin:0}header{display:flex;justify-content:space-between;align-items:center;gap:15pt;padding-bottom:12pt;border-bottom:2.4pt solid #315b75;margin-bottom:13pt}header img{width:72pt;height:88pt;object-fit:cover;border-radius:3pt}header h1{font-size:32pt;font-weight:650;line-height:1.1;letter-spacing:-1.5pt}header p{margin-top:5pt}a{color:#265976;text-decoration:none}.social a+a{margin-left:7pt}.social{font-size:9pt}h2{font-size:14pt;color:#244c66;font-weight:650;line-height:1.17;margin:14pt 0 5pt}h3{font-size:11pt;font-weight:650;margin-bottom:2pt}p+p{margin-top:4pt}.bold{font-weight:640}.refs{border-top:.6pt solid #c3d0d7;padding-top:7pt;margin-top:14pt;font-size:9.5pt}.two{display:grid;grid-template-columns:1fr 1fr;gap:18pt}
 </style></head><body><header><div><h1>${name}</h1><p class="bold">${c.field}</p><p>${c.city} · <a href="mailto:${email}">${email}</a></p><p><a href="${origin}${pathFor(lang)}">beratyasa.com${lang==='tr'?'/tr/':''}</a></p><p class="social">${profiles.map(p=>`<a href="${p.url}">${p.url.replace('https://','').replace('www.','').replace(/\/$/,'')}</a>`).join(' ')}</p></div><img src="${pathToFileURL(join(assets,'berat-yasa.webp')).href}" alt=""></header>
 <h2>${c.cvSummary}</h2><p>${c.intro}</p><h2>${c.edu}</h2><h3>${c.uni}</h3><p>${c.degree} · ${c.finish} · ${c.date}</p><p>${c.educationText}</p><h2>${c.coursesTitle}</h2><p>${c.courses.join(' · ')}</p><h2>${c.programmingTitle}</h2><p>${programming.join(', ')}</p><p><span class="bold">${c.hardwareTitle}</span> · Arduino</p><h2>${c.cvProject}</h2><h3>${c.projectTitle}</h3><p>${c.projectText}</p><h2>${c.toolsTitle}</h2><p>${c.creative}. ${c.office}.</p><div class="two"><div><h2>${c.languagesTitle}</h2><p>${c.languagesText}</p></div><div><h2>${c.certificates}</h2><p>${c.certText}</p></div></div><p class="refs">${c.references}</p></body></html>`;
}
await mkdir(join(site,'tr'),{recursive:true});
if(print)await mkdir(print,{recursive:true});
for(const lang of ['en','tr']){
 await writeFile(join(site,lang==='en'?'index.html':'tr/index.html'),page(lang).replace(/\b(href|src|srcset)="\/(?!\/)/g, '$1="'+(lang === 'tr' ? '../' : './')));
 if(print)await writeFile(join(print,'cv-'+lang+'.html'),printPage(lang));
}
await writeFile(join(site,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url><url><loc>${origin}/tr/</loc></url></urlset>\n`);
await writeFile(join(site,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile(join(site,'404.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | ${name}</title><link rel="stylesheet" href="/assets/style.css?v=${version}"></head><body><main class="not-found">${brand}<p>404</p><h1>Page not found</h1><p><a href="/">English portfolio</a> &nbsp; <a lang="tr" href="/tr/">Türkçe portfolyo</a></p></main></body></html>`);
