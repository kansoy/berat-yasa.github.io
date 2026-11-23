import {renderModel} from './chart.mjs';
const notebook=document.querySelector('#notebook');
const tabs=Array.from(notebook.querySelectorAll('[role=tab]'));
const panels=Array.from(notebook.querySelectorAll('[role=tabpanel]'));
const range=notebook.querySelector('input[type=range]');
const valueText=notebook.querySelector('.value');
const svg=notebook.querySelector('.notebook-plot');
const readout=notebook.querySelector('.model-result');
const lang=document.documentElement.lang;
const state=new Map(tabs.map(t=>[t.dataset.model,Number(t.dataset.initial)]));
let active=tabs[0];
function draw(){
  const id=active.dataset.model,value=state.get(id);
  const valueLabel=value.toLocaleString(lang)+active.dataset.unit;
  valueText.textContent=valueLabel;
  range.setAttribute('aria-valuetext',valueLabel);
  const model=renderModel(id,value,lang);
  svg.innerHTML=model.picture;
  readout.textContent=model.result;
}
function select(tab,focus=false){
  active=tab;
  for(const t of tabs){
    const chosen=t===active;
    t.setAttribute('aria-selected',String(chosen));t.tabIndex=chosen?0:-1;
    panels[tabs.indexOf(t)].hidden=!chosen;
  }
  const p=panels[tabs.indexOf(active)];
  for(const key of ['min','max','step']) range[key]=tab.dataset[key];
  range.value=state.get(tab.dataset.model);
  notebook.querySelector('.parameter-label').textContent=tab.dataset.label;
  notebook.querySelector('.plot-context').textContent=tab.dataset.context;
  svg.setAttribute('aria-label',p.querySelector('h3').textContent);
  svg.setAttribute('aria-describedby',p.id);
  if(focus)tab.focus();
  draw();
}
tabs.forEach((t,i)=>{
  t.addEventListener('click',()=>select(t));
  t.addEventListener('keydown',e=>{
    const end=tabs.length-1;
    const indices={Home:0,End:end,ArrowRight:(i+1)%tabs.length,ArrowLeft:(i+end)%tabs.length};
    if(e.key in indices){ e.preventDefault();select(tabs[indices[e.key]],true); }
  });
});
range.addEventListener('input',()=>{state.set(active.dataset.model,Number(range.value));draw()});
const menu=document.querySelector('.compact-nav');
menu.addEventListener('click',e=>{if(e.target.closest('a'))menu.open=false;});
document.addEventListener('click',e=>{if(menu.open&&!menu.contains(e.target))menu.open=false});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus()}});
select(active);
