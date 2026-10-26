// 從製作清單同步的本機目錄載入；重新整理即可套用新完成的圖，不依賴遠端服務。
let catalog;
if(typeof window==='undefined'){
  const {readFile}=await import('node:fs/promises');
  catalog=JSON.parse(await readFile(new URL('../../public/assets/catalog.json',import.meta.url),'utf8'));
}else{
  catalog=await fetch('/public/assets/catalog.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('本機素材索引無法讀取');return r.json();});
}
export const allArtwork=catalog;
const url=id=>catalog.find(a=>a.id===id)?.src??null;
const chapterIds=['gate','hall','library','garden','pavilion','yikun','yanxi','medicine','jingren','cining','prison','final'];
export const backgrounds=Object.fromEntries(chapterIds.map((id,i)=>[id,url('BG-'+String(i+1).padStart(2,'0'))]));
export const characters={};
for(let i=1;i<=20;i++){
  const id='CH-'+String(i).padStart(2,'0'),neutral=url(id+'-neutral');
  if(neutral)characters[id]=Object.fromEntries(['neutral','tense','resolved'].map(exp=>[exp,url(id+'-'+exp)??neutral]));
}
export const portraits=Object.fromEntries(chapterIds.map((id,i)=>[id,characters['CH-'+String([3,4,5,6,8,10,12,13,14,15,17,18][i]).padStart(2,'0')]]).filter(([,v])=>v));
export const playerPortraits=characters['CH-01'];
export const noblePortraits=characters['CH-02']??playerPortraits;
export const needleIcon=url('PR-01');
export const propIcons=Object.fromEntries(catalog.filter(a=>a.category==='PR').map(a=>[a.id,a.src]));
export const uiArt=Object.fromEntries(catalog.filter(a=>a.category==='UI').map(a=>[a.id,a.src]));
export const extraArt=Object.fromEntries(catalog.filter(a=>a.category==='EX').map(a=>[a.id,a.src]));

