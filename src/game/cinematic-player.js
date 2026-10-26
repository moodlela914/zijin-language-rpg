/** 遊戲播放器與可輸出的 composition 分離。 */
let cleanup=null;
export function stopCinematic(){cleanup?.();cleanup=null;}
export function playCinematic(frame,onFinish){
  stopCinematic();let timer=null,started=false;
  function start(){
    if(started||!frame.contentDocument?.querySelector('[data-composition-id]'))return;
    started=true;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animations=frame.contentDocument.getAnimations();
    for(const animation of animations){animation.currentTime=reduced?9300:0;if(!reduced)animation.play();}
    // 減少動態效果時保留任務文字，交由玩家按鈕繼續。
    if(!reduced)timer=setTimeout(onFinish,frame.contentWindow.cinematicDuration??11200);
  }
  frame.addEventListener('load',start);start();
  cleanup=()=>{clearTimeout(timer);frame.removeEventListener('load',start);};
}
export function animateEntrance(container){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const nodes=[['.quest-card',600,0],['.dialogue',520,80],['.puzzle-board',600,0],['.result-panel',650,0]];
  for(const [selector,duration,delay] of nodes){
    const node=container.querySelector(selector);
    node?.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration,delay,fill:'both',easing:'cubic-bezier(.16,1,.3,1)'});
  }
  const sparks=container.querySelectorAll('.celebration-sparks i');
  sparks.forEach((node,i)=>{
    const angle=(i/sparks.length)*Math.PI*2,x=Math.cos(angle)*150,y=Math.sin(angle)*110-65;
    node.animate([{opacity:0,transform:'translate(0,30px) scale(.3)'},{opacity:1,transform:'translate('+x*.65+'px,'+y*.6+'px) rotate('+(i*43)+'deg)',offset:.4},{opacity:0,transform:'translate('+x+'px,'+(y+80)+'px) rotate('+(i*80)+'deg)'}],{duration:1600,delay:i*30,fill:'both',easing:'cubic-bezier(.16,1,.3,1)'});
  });
  container.querySelector('.celebration-emblem img')?.animate([{opacity:0,transform:'translateY(30px) scale(.65)'},{opacity:1,transform:'translateY(0) scale(1.08)',offset:.65},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:1050,fill:'both',easing:'cubic-bezier(.16,1,.3,1)'});
}
