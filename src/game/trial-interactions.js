import { kindOf,modeNames,newDraft,readyTrial,evaluateTrial } from './trial-model.js?v=624f66693177';
import { backgrounds,playerPortraits,propIcons } from '../data/assets.js?v=624f66693177';
const drafts=new Map();let dispose=null;
const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,text,id='',attrs='')=>'<button data-trial="'+action+'" data-id="'+e(id)+'" '+attrs+'>'+text+'</button>';
const label=text=>e(text.length>24?text.slice(0,24)+'…':text);
export function renderTrial(q){return '<div id="trial-interactive" class="trial-shell" data-question="'+q.id+'"></div>';}
export function renderTrialFeedback(q,s){return '<div class="trial-response"><span>你的操作結果</span><p>'+e(s.feedback.response.summary)+'</p><span>正確判讀</span><p class="correct-response">'+e(q.choices.find(c=>c.id===q.answerId).text)+'</p></div>';}
export function unmountTrial(){dispose?.();dispose=null;}
export function clearTrialDrafts(){drafts.clear();}
export function mountTrial(root,q,s,{onSubmit,onOperate}){
  unmountTrial();const key=q.id+':'+s.attempts.length;
  const d=drafts.get(key)??newDraft();drafts.set(key,d);
  if(s.eliminated.includes(d.choiceId))d.choiceId=null;
  if(s.eliminated.includes(d.pick))d.pick=null;
  const k=kindOf(q),p=q.interaction;let routeTimer=null,dragX=null,lastAngle=-d.index*120;
  const disabled=id=>s.eliminated.includes(id)?'disabled':'';
  const options=(action='choose')=>q.choices.map(c=>button(action,e(c.text),c.id,'class="trial-option '+(d.choiceId===c.id?'selected':'')+'" '+disabled(c.id))).join('');
  const instruction=p?.instruction??({drag:'拖曳一枚詞牌放到御札空位，再蓋印確認。也可點詞牌、再點空位。',prism:'旋轉立體玉冊，讀過三個面，再選擇正面的解釋封冊。左右滑動或方向鍵也能旋轉。',shelf:'把待歸架的書拖到合宜的書架，再確認。也可先點書、再點書架。',maze:'沿著通道把貼紙人物帶到正確的體裁出口，再封籤。WASD／方向鍵移動，也可點出口自動尋路。',argument:'先選謬誤印記，再把能成立的反駁接到御批，完成兩段證據鏈。'}[k]??'選擇能回應情境的內容，再確認。');
  function markup(){
    let body='';
    if(k==='drag'){
      body='<div class="word-tokens">'+q.choices.map(c=>button('pick-choice','<strong>'+label(c.text.split(/[：，]/)[0])+'</strong>'+(label(c.text.split(/[：，]/)[0])===e(c.text)?'':'<small>'+e(c.text)+'</small>'),c.id,'draggable="true" data-drag="'+c.id+'" class="word-token '+(d.pick===c.id?'selected':'')+'" '+disabled(c.id))).join('')+'</div>'+button('word-slot',d.choiceId?e(q.choices.find(c=>c.id===d.choiceId).text):'將得體的應答放入此處','', 'class="letter-drop" data-drop="word"');
    }else if(k==='prism'){
      body='<div class="prism-stage" aria-label="可旋轉的立體玉冊"><div class="jade-prism" style="transform:rotateY('+(-d.index*120)+'deg)">'+q.choices.map((c,i)=>'<div class="prism-face '+(s.eliminated.includes(c.id)?'excluded':'')+'" style="transform:rotateY('+(i*120)+'deg) translateZ(72px)"><small>玉冊 '+String.fromCharCode(65+i)+'</small><p>'+e(c.text)+'</p>'+(s.eliminated.includes(c.id)?'<em>已排除的判讀</em>':'')+'</div>').join('')+'</div></div><div class="prism-controls">'+button('rotate','↶ 向左旋轉','-1','class="quiet"')+'<span>已觀察 '+d.seen.length+' / 3 面</span>'+button('rotate','向右旋轉 ↷','1','class="quiet"')+'</div><p class="current-face">正面：'+e(q.choices[d.index].text)+'</p>';
    }else if(k==='shelf'){
      const book=q.prompt.match(/《([^》]+)》/)?.[0]??'待分類卷冊';
      body='<div class="library-trial"><div class="book-source">'+button('pick-book',e(book),'book','draggable="true" data-drag="book" class="drag-book '+(d.pick?'selected':'')+'"')+'</div><div class="shelf-stack">'+q.choices.map(c=>button('shelf','<span>'+e(c.text)+'</span>'+(d.choiceId===c.id?'<small>卷冊已放入</small>':''),c.id,'class="book-shelf '+(d.choiceId===c.id?'selected':'')+'" data-drop="shelf" '+disabled(c.id))).join('')+'</div></div>';
    }else if(['sequence','couplet'].includes(k)){
      body='<div class="arrange-tokens">'+p.tokens.map(t=>button('order',e(t.text),t.id,'draggable="true" data-drag="'+t.id+'" class="sequence-token '+(d.order.includes(t.id)?'placed':'')+'"')).join('')+'</div><div class="'+(k==='couplet'?'couplet-workbench':'season-track')+'">'+p.tokens.map((_,i)=>'<div class="order-target" data-drop="order" data-index="'+i+'"><small>'+(k==='couplet'?(p.tokens.length===2?['上聯','下聯'][i]:'聯語位置 '+(i+1)):'時序 '+(i+1))+'</small>'+(d.order[i]?button('remove-order',e(p.tokens.find(t=>t.id===d.order[i]).text),d.order[i]):'<span>拖入詞牌／依序點選</span>')+'</div>').join('')+'</div>';
    }else if(k==='highlight'||k==='proofread'){
      body='<div class="annotation-paper">'+p.segments.map(segment=>button('mark',e(segment.text),segment.id,'class="text-segment '+((k==='highlight'?d.selected.includes(segment.id):d.targetId===segment.id)?'marked':'')+'" aria-pressed="'+(k==='highlight'?d.selected.includes(segment.id):d.targetId===segment.id)+'"')).join('')+'</div><p class="small">'+(k==='highlight'?'點選詞句來標註，再點一次可以取消。':'第一步：標記需校勘之處。第二步：選擇適切的修補或解釋。')+'</p>'+(k==='proofread'?'<div class="repair-options">'+options()+'</div>':'');
    }else if(k==='matching'){
      const right=[...p.pairs].reverse();
      body='<div class="matching-board"><div>'+p.pairs.map((pair,i)=>button('match-left','<small>禮單 '+(i+1)+'</small>'+e(pair.left)+(d.matches[pair.id]?'<em>已接至 '+e(p.pairs.find(x=>x.id===d.matches[pair.id]).right)+'</em>':''),pair.id,'class="match-left '+(d.pick===pair.id?'selected':'')+'" draggable="true" data-drag="'+pair.id+'"')).join('')+'</div><div class="connection-middle" aria-hidden="true">⟷</div><div>'+right.map(pair=>button('match-right',e(pair.right),pair.id,'class="match-right '+(Object.values(d.matches).includes(pair.id)?'connected':'')+'" data-drop="match"')).join('')+'</div></div><p class="small">先選左邊的賀禮，再接到右邊的題辭；也可拖曳配對。每枚題辭只能使用一次。</p>';
    }else if(k==='form'){
      body='<div class="form-tiles">'+p.tiles.map(t=>button('pick-field',e(t.text),t.id,'draggable="true" data-drag="'+t.id+'" class="word-token '+(d.pick===t.id?'selected':'')+'"')).join('')+'</div><div class="letter-form">'+p.fields.map(field=>button('field','<span>'+e(field.label)+'</span><strong>'+(p.tiles.find(t=>t.id===d.fields[field.id])?.text??'待填入')+'</strong>',field.id,'data-drop="field" class="form-field"')).join('')+'</div>';
    }else if(k==='timeline'){
      body='<div class="timeline-readout">'+e(p.ticks[d.slider].text)+'</div><input class="trial-timeline" type="range" min="0" max="'+(p.ticks.length-1)+'" step="1" value="'+d.slider+'" aria-label="年齡或時辰時間軸"><div class="timeline-ticks">'+p.ticks.map((tick,i)=>button('tick',e(tick.text),String(i),'class="'+(i===d.slider?'selected':'')+'"')).join('')+'</div><p class="small">拖動時間軸、點刻度或使用鍵盤方向鍵，把標記放在符合線索的位置。</p>';
    }else if(k==='maze'){
      body='<div class="history-maze"><div class="maze-grid">'+Array.from({length:35},(_,i)=>{const x=i%7,y=Math.floor(i/7),open=walkable(x,y),door=x===6&&[0,2,4].includes(y),choice=door?q.choices[y/2]:null;return '<div class="maze-cell '+(open?'path':'wall')+'">'+(door?button('maze-door',String.fromCharCode(65+y/2),choice.id,'class="maze-door" aria-label="前往'+e(choice.text)+'出口"'):'')+(d.maze.x===x&&d.maze.y===y?'<img class="maze-actor" src="'+playerPortraits.neutral+'" alt="史卷迷宮貼紙人物">':'')+'</div>';}).join('')+'</div><div class="maze-legends">'+q.choices.map((c,i)=>button('maze-door','<small>出口 '+String.fromCharCode(65+i)+'</small>'+e(c.text),c.id,'class="'+(d.choiceId===c.id?'selected':'')+'" '+disabled(c.id))).join('')+'</div></div><div class="maze-controls">'+[['up','↑'],['left','←'],['down','↓'],['right','→']].map(([dir,sign])=>button('maze-move',sign,dir,'class="quiet" aria-label="迷宮向'+({up:'上',down:'下',left:'左',right:'右'}[dir])+'移動"')).join('')+'</div>';
    }else if(k==='argument'){
      body='<div class="argument-stamps">'+[['dilemma','假兩難'],['cause','因果證據不足'],['meaning','偷換詞義']].map(([id,text])=>button('stamp',text,id,'class="'+(d.stamp===id?'selected':'')+'"')).join('')+'</div><div class="argument-source"><strong>御批</strong><p>'+e(q.prompt)+'</p><span>↓ 找出可成立的反駁</span></div><div class="argument-replies">'+options('connect-argument')+'</div>';
    }else body='<div class="repair-options">'+options()+'</div>';
    const ready=readyTrial(q,d)&&!(k==='prism'&&s.eliminated.includes(q.choices[d.index].id));
    return '<div class="trial-heading"><span>本關闖關形式</span><strong>'+modeNames[k]+'</strong></div><p class="trial-instruction">'+e(instruction)+'</p>'+body+(d.message?'<p class="trial-message" role="status">'+e(d.message)+'</p>':'')+'<div class="trial-submit">'+button('submit','確認應答 · 提交判讀 →','','class="primary" '+(ready?'':'disabled'))+'<small>可先調整，再確認；提交後才判定氣血。</small></div>';
  }
  function paint(focusAction,focusId){root.innerHTML=markup();if(k==='prism'){const angle=-d.index*120;if(angle!==lastAngle&&!matchMedia('(prefers-reduced-motion: reduce)').matches)root.querySelector('.jade-prism')?.animate([{transform:'rotateY('+lastAngle+'deg)'},{transform:'rotateY('+angle+'deg)'}],{duration:460,easing:'cubic-bezier(.16,1,.3,1)'});lastAngle=angle;}if(k==='matching'){const pairs=p.pairs,right=[...pairs].reverse();root.querySelector('.connection-middle').innerHTML='<svg viewBox="0 0 100 100" preserveAspectRatio="none">'+pairs.map((pair,i)=>{const j=right.findIndex(x=>x.id===d.matches[pair.id]);return j<0?'':'<path d="M 0 '+((i+.5)*100/pairs.length)+' C 45 '+((i+.5)*100/pairs.length)+', 55 '+((j+.5)*100/pairs.length)+', 100 '+((j+.5)*100/pairs.length)+'" stroke="'+['#ad824c','#6b8c66','#985c4a'][i%3]+'"/>';}).join('')+'</svg>';}if(focusAction)[...root.querySelectorAll('[data-trial]')].find(n=>n.dataset.trial===focusAction&&n.dataset.id===focusId)?.focus({preventScroll:true});}
  function assign(map,key,value){for(const existing of Object.keys(map))if(map[existing]===value)delete map[existing];map[key]=value;}
  function rotate(delta){d.index=(d.index+delta+q.choices.length)%q.choices.length;if(!d.seen.includes(d.index))d.seen.push(d.index);}
  function move(direction){const [dx,dy]={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[direction];const x=d.maze.x+dx,y=d.maze.y+dy;if(!walkable(x,y))return;d.maze={x,y};d.choiceId=x===6&&[0,2,4].includes(y)?q.choices[y/2].id:null;}
  function operate(action,id){
    if(action==='submit'){if(readyTrial(q,d)){const result=evaluateTrial(q,d);onSubmit(result.choiceId,result.response);}return;}
    onOperate?.();d.message='';
    if(action==='pick-choice'||action==='pick-field')d.pick=id;
    else if(action==='word-slot'&&d.pick){d.choiceId=d.pick;d.pick=null;}
    else if(action==='rotate')rotate(Number(id));
    else if(action==='pick-book')d.pick='book';
    else if(action==='shelf'&&d.pick){d.choiceId=id;d.pick=null;}
    else if(action==='order')d.order=d.order.includes(id)?d.order.filter(x=>x!==id):[...d.order,id];
    else if(action==='remove-order')d.order=d.order.filter(x=>x!==id);
    else if(action==='mark'){if(k==='highlight')d.selected=d.selected.includes(id)?d.selected.filter(x=>x!==id):[...d.selected,id];else d.targetId=id;}
    else if(action==='choose'||action==='connect-argument')d.choiceId=id;
    else if(action==='match-left')d.pick=id;
    else if(action==='match-right'&&d.pick){assign(d.matches,d.pick,id);d.pick=null;}
    else if(action==='field'&&d.pick){assign(d.fields,id,d.pick);d.pick=null;}
    else if(action==='tick'){d.slider=Number(id);d.adjusted=true;}
    else if(action==='stamp')d.stamp=id;
    else if(action==='maze-move')move(id);
    else if(action==='maze-door'){
      const index=q.choices.findIndex(c=>c.id===id),path=findPath(d.maze,{x:6,y:index*2});clearInterval(routeTimer);
      routeTimer=setInterval(()=>{const next=path.shift();if(!next){clearInterval(routeTimer);return;}d.maze=next;d.choiceId=next.x===6&&next.y===index*2?id:null;paint();},105);
    }
    paint(action,id);
  }
  root.addEventListener('click',event=>{const target=event.target.closest('[data-trial]');if(target&&!target.disabled)operate(target.dataset.trial,target.dataset.id);});
  root.addEventListener('dragstart',event=>{const target=event.target.closest('[data-drag]');if(!target||target.disabled)return;d.pick=target.dataset.drag;event.dataTransfer.setData('text/plain',d.pick);event.dataTransfer.effectAllowed='move';});
  root.addEventListener('dragover',event=>{if(event.target.closest('[data-drop]'))event.preventDefault();});
  root.addEventListener('drop',event=>{const target=event.target.closest('[data-drop]');if(!target||target.disabled)return;event.preventDefault();const picked=event.dataTransfer.getData('text/plain')||d.pick;const valid=k==='shelf'?picked==='book':k==='drag'?q.choices.some(c=>c.id===picked&&!s.eliminated.includes(c.id)):k==='matching'?p.pairs.some(x=>x.id===picked):k==='form'?p.tiles.some(x=>x.id===picked):p.tokens?.some(x=>x.id===picked);if(!valid)return;d.pick=picked;if(target.dataset.drop==='order'){const index=Number(target.dataset.index);d.order=d.order.filter(id=>id!==d.pick);d.order.splice(index,0,d.pick);paint();onOperate?.();}else operate({word:'word-slot',shelf:'shelf',match:'match-right',field:'field'}[target.dataset.drop],target.dataset.id);});
  root.addEventListener('input',event=>{if(event.target.matches('.trial-timeline')){d.slider=Number(event.target.value);d.adjusted=true;root.querySelector('.timeline-readout').textContent=p.ticks[d.slider].text;root.querySelector('[data-trial="submit"]').disabled=false;root.querySelectorAll('[data-trial="tick"]').forEach(node=>node.classList.toggle('selected',Number(node.dataset.id)===d.slider));}});
  root.addEventListener('pointerdown',event=>{if(k==='prism'&&event.target.closest('.prism-stage'))dragX=event.clientX;});
  root.addEventListener('pointerup',event=>{if(dragX!==null){const delta=event.clientX-dragX;dragX=null;if(Math.abs(delta)>25){rotate(delta<0?1:-1);onOperate?.();paint();}}});
  const keyboard=event=>{if(event.target.closest('input,textarea,select'))return;const key=event.key.toLowerCase();if(k==='prism'&&['arrowleft','arrowright'].includes(key)){event.preventDefault();rotate(key==='arrowright'?1:-1);onOperate?.();paint();}if(k==='maze'){const dir={w:'up',s:'down',a:'left',d:'right',arrowup:'up',arrowdown:'down',arrowleft:'left',arrowright:'right'}[key];if(dir){event.preventDefault();clearInterval(routeTimer);move(dir);onOperate?.();paint();}}};
  document.addEventListener('keydown',keyboard);paint();
  dispose=()=>{document.removeEventListener('keydown',keyboard);clearInterval(routeTimer);};
}
function walkable(x,y){return x>=0&&x<7&&y>=0&&y<5&&(y===2||x===5||(x===6&&[0,2,4].includes(y)));}
function findPath(start,target){const queue=[[start]],seen=new Set([start.x+','+start.y]);while(queue.length){const path=queue.shift(),last=path.at(-1);if(last.x===target.x&&last.y===target.y)return path.slice(1);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const next={x:last.x+dx,y:last.y+dy},key=next.x+','+next.y;if(walkable(next.x,next.y)&&!seen.has(key)){seen.add(key);queue.push([...path,next]);}}}return[];}
