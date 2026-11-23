const tau = Math.PI * 2;
const locale = (lang, value, digits=2) => Number(value).toLocaleString(lang, {maximumFractionDigits:digits}).replace('-', '−');
const axisText = {
  en: { time:'Time (s)', volts:'Voltage (V)', amps:'Current (mA)', resistance:'Sensor resistance (kΩ)', output:'Output (V)', current:'Current', voltage:'Output', period:'Period' },
  tr: { time:'Zaman (s)', volts:'Gerilim (V)', amps:'Akım (mA)', resistance:'Sensör direnci (kΩ)', output:'Çıkış (V)', current:'Akım', voltage:'Çıkış', period:'Periyot' }
};
const minX=54, maxX=564, minY=31, maxY=233;
const line=(x1,y1,x2,y2,kind)=>`<line class="${kind}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const label=(x,y,word,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}">${word}</text>`;
const dot=(x,y)=>`<circle class="selected" cx="${x}" cy="${y}" r="5.5"/>`;
function curve(x,y,lo,hi,fn,style='trace') {
  const points=[];
  for(let i=0;i<=320;i++){
    const t=lo+(hi-lo)*i/320;
    points.push((i?'L':'M')+x(t).toFixed(2)+' '+y(fn(t)).toFixed(2));
  }
  return `<path class="${style}" d="${points.join(' ')}"/>`;
}
function grid(x,y,xt,yt,xLabel,yLabel,lang) {
  let marks=xt.map(v=>line(x(v),minY,x(v),maxY,'gridline')+label(x(v),maxY+19,locale(lang,v))).join('');
  marks+=yt.map(v=>line(minX,y(v),maxX,y(v),'gridline')+label(minX-10,y(v)+4,locale(lang,v),'end')).join('');
  marks+=label(minX,17,yLabel,'start')+label(maxX,275,xLabel,'end');
  return marks;
}
export function renderModel(id, value, lang) {
  const l=axisText[lang], f=v=>locale(lang,v);
  let picture='', result='';
  if(id==='vector'){
    const scale=15.5, ox=(minX+maxX)/2, oy=maxY-13;
    const x=v=>ox+v*scale, y=v=>oy-v*scale;
    const theta=value*Math.PI/180, a=10*Math.cos(theta), b=10*Math.sin(theta);
    const tip=[x(a),y(b)];
    const head=(r,delta)=>[tip[0]-r*Math.cos(theta+delta),tip[1]+r*Math.sin(theta+delta)].join(',');
    picture=grid(x,y,[-15,-10,-5,0,5,10,15],[0,5,10],'Fₓ (N)','Fᵧ (N)',lang);
    picture+=line(minX,y(0),maxX,y(0),'axis')+line(x(0),minY,x(0),maxY,'axis');
    picture+=`<path class="guide" d="M${x(-10)} ${y(0)}A155 155 0 0 1 ${x(10)} ${y(0)}"/>`;
    picture+=line(x(a),y(0),x(a),y(b),'projection')+line(x(0),y(b),x(a),y(b),'projection');
    picture+=line(x(0),y(0),...tip,'trace')+`<polygon class="arrowhead" points="${tip.join(',')} ${head(14,.39)} ${head(14,-.39)}"/>`;
    result=`Fₓ = ${f(Math.abs(a)<.001?0:a)} N   ·   Fᵧ = ${f(Math.abs(b)<.001?0:b)} N`;
  } else {
    const divider=id==='divider', sine=id==='sine';
    const xmax=sine?1:divider?15:5, ymin=sine?-1.2:0, ymax=sine?1.2:5;
    const x=v=>minX+v/xmax*(maxX-minX),y=v=>maxY-(v-ymin)/(ymax-ymin)*(maxY-minY);
    const xs=sine?[0,.25,.5,.75,1]:divider?[0,3,6,9,12,15]:[0,1,2,3,4,5];
    const ys=sine?[-1,-.5,0,.5,1]:[0,1,2,3,4,5];
    picture=grid(x,y,xs,ys,sine?l.time:divider?l.resistance:l.volts,sine?l.volts:divider?l.output:l.amps,lang);
    picture+=line(minX,y(0),maxX,y(0),'axis')+line(minX,minY,minX,maxY,'axis');
    const voltsAt=r=>25/(r+5);
    const response=sine?t=>Math.sin(tau*value*t):divider?voltsAt:v=>v;
    picture+=curve(x,y,0,xmax,response);
    if(sine){
      const period=1/value;
      picture+=line(x(period),minY,x(period),maxY,'projection')+dot(x(period),y(0));
      result=l.period+' = '+f(period*1000)+' ms';
    } else {
      const v=response(value);
      picture+=line(x(value),y(0),x(value),y(v),'projection')+line(x(0),y(v),x(value),y(v),'projection')+dot(x(value),y(v));
      result=(divider?l.voltage:l.current)+' = '+f(v)+(divider?' V':' mA');
    }
  }
  return {picture,result};
}
