import {dirname,join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import puppeteer from 'puppeteer-core';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export async function render(origin, printDir) {
  const browser=await puppeteer.launch({headless:true,executablePath: process.env.CHROME_BIN || undefined, channel: process.env.CHROME_BIN ? undefined : 'chrome',args:['--allow-file-access-from-files']});
  try{
   const page=await browser.newPage();
   await page.setViewport({width:1200,height:630,deviceScaleFactor:1});
   await page.goto(origin,{waitUntil:'networkidle0'});
   await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:join(root,'site/assets/berat-portfolio.jpg'),type:'jpeg',quality:89});
   for(const lang of ['en','tr']){
    await page.goto(pathToFileURL(resolve(printDir,'cv-'+lang+'.html')).href,{waitUntil:'networkidle0'});
    await page.evaluate(()=>document.fonts.ready);
    await page.pdf({path:join(root,'site/assets/berat-yasa-cv-'+lang+'.pdf'),printBackground:true,tagged:true,preferCSSPageSize:true,displayHeaderFooter:false});
   }
  }finally{await browser.close()}
}
