export async function fetchJsonAsset(url,{fetcher=fetch,timeoutMs=8000}={}){
  const controller=new AbortController();let timer;
  try{
    return await Promise.race([
      Promise.resolve().then(()=>fetcher(url,{cache:'no-store',signal:controller.signal})).then(response=>{if(!response.ok)throw Error('Asset index unavailable');return response.json();}),
      new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error('Asset index timeout'));},timeoutMs);})
    ]);
  }finally{clearTimeout(timer);}
}
function loadImage(url){
  return new Promise((resolve,reject)=>{
    const image=new Image();
    image.onload=()=>image.decode?image.decode().catch(()=>{}).then(resolve):resolve();
    image.onerror=()=>reject(Error('Image unavailable'));
    image.src=url;
  });
}
export async function preloadAssets(urls,{load=loadImage,onProgress=()=>{},concurrency=3,timeoutMs=8000}={}){
  const queue=[...new Set(urls.filter(Boolean))],failed=[];
  let cursor=0,completed=0;
  const progress=()=>onProgress({completed,total:queue.length,percent:queue.length?Math.round(completed/queue.length*100):100});
  progress();
  async function worker(){
    while(cursor<queue.length){
      const url=queue[cursor++];let timer;
      try{await Promise.race([Promise.resolve().then(()=>load(url)),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('timeout')),timeoutMs);})]);}
      catch{failed.push(url);}
      finally{clearTimeout(timer);completed++;progress();}
    }
  }
  await Promise.all(Array.from({length:Math.min(concurrency,queue.length)},worker));
  return {loaded:queue.length-failed.length,failed};
}
