/** 不同闖關操作轉成相同評量紀錄，介面不決定知識正誤。 */
export const modeNames={drag:'御札填詞',prism:'立體玉冊',shelf:'藏書歸架',sequence:'節令時序',highlight:'詩箋標註',matching:'賀禮連線',couplet:'楹聯拼接',proofread:'脈案校勘',form:'書信組裝',timeline:'年齒時辰軸',maze:'史卷迷宮',argument:'御前證據鏈',choice:'語文辨析'};
export const kindOf=q=>q.interaction?.kind??({gate:'drag',hall:'prism',library:'shelf',prison:'maze',final:'argument'}[q.chapterId]??'choice');
export const argumentStamp=q=>({'logic-false-dilemma':'dilemma','logic-causal-leap':'cause','logic-equivocation':'meaning'}[q.id]);
export function newDraft(){return{choiceId:null,order:[],selected:[],matches:{},fields:{},pick:null,targetId:null,index:0,seen:[0],slider:0,adjusted:false,stamp:null,maze:{x:0,y:2},message:''};}
export function readyTrial(q,d){
  const p=q.interaction,k=kindOf(q);
  if(k==='sequence'||k==='couplet')return d.order.length===p.tokens.length;
  if(k==='highlight')return d.selected.length>0;
  if(k==='matching')return p.pairs.every(pair=>d.matches[pair.id]);
  if(k==='form')return p.fields.every(field=>d.fields[field.id]);
  if(k==='timeline')return d.adjusted;
  if(k==='proofread')return !!d.targetId&&!!d.choiceId;
  if(k==='argument')return !!d.choiceId&&!!d.stamp;
  if(k==='prism')return d.seen.length===q.choices.length;
  return !!d.choiceId;
}
export function evaluateTrial(q,d){
  const p=q.interaction,k=kindOf(q),text=id=>p?.tokens?.find(x=>x.id===id)?.text??p?.tiles?.find(x=>x.id===id)?.text??id;
  let correct=false,summary='',value=null;
  if(['sequence','couplet'].includes(k)){value=[...d.order];correct=JSON.stringify(value)===JSON.stringify(p.solution);summary=value.map(text).join(' → ');}
  else if(k==='highlight'){value=[...d.selected];correct=new Set(value).size===value.length&&value.length===p.targetIds.length&&value.every(id=>p.targetIds.includes(id));summary=p.segments.filter(x=>value.includes(x.id)).map(x=>x.text).join('、');}
  else if(k==='matching'){value={...d.matches};correct=p.pairs.every(pair=>value[pair.id]===pair.id);summary=p.pairs.map(pair=>pair.left+' → '+(p.pairs.find(x=>x.id===value[pair.id])?.right??'未配對')).join('；');}
  else if(k==='form'){value={...d.fields};correct=p.fields.every(field=>value[field.id]===p.solution[field.id]);summary=p.fields.map(field=>field.label+'：'+text(value[field.id])).join('；');}
  else if(k==='timeline'){value=p.ticks[d.slider]?.id;correct=value===p.solutionId;summary=p.ticks[d.slider]?.text??'';}
  else if(k==='proofread'){value={targetId:d.targetId,choiceId:d.choiceId};correct=value.targetId===p.targetId&&d.choiceId===q.answerId;summary='標記「'+(p.segments.find(x=>x.id===d.targetId)?.text??'')+'」；'+(q.choices.find(c=>c.id===d.choiceId)?.text??'');}
  else if(k==='argument'){value={stamp:d.stamp,choiceId:d.choiceId};correct=d.choiceId===q.answerId&&d.stamp===argumentStamp(q);summary=({dilemma:'假兩難',cause:'因果證據不足',meaning:'偷換詞義'}[d.stamp]??'')+'；'+(q.choices.find(c=>c.id===d.choiceId)?.text??'');}
  else{value=k==='prism'?q.choices[d.index]?.id:d.choiceId;correct=value===q.answerId;summary=q.choices.find(c=>c.id===value)?.text??'';}
  const direct=['drag','prism','shelf','maze','choice'].includes(k);
  return{choiceId:direct?value:correct?q.answerId:(q.choices.find(c=>c.id!==q.answerId)?.id),response:{kind:k,value,summary},correct};
}
