import {createGame,report,pauseGame,chapterQuestions,playableChapters} from './engine.js?v=624f66693177';
import {questions} from '../data/questions.js?v=624f66693177';
import {isValidSave,SAVE_KEY} from './storage.js?v=624f66693177';

export const HISTORY_BACKUP_KEY='zijin-language-rpg:before-import:v1';
export const MAX_HISTORY_BYTES=2*1024*1024;
const FORMAT='zijin-language-rpg-history';
const clone=value=>JSON.parse(JSON.stringify(value));
const fail=()=>{throw Error('檔案不是可讀取的紫禁語文弈歷程，或內容不完整。請使用遊戲匯出的 JSON。');};
function canonicalState(value){
  if(!value||typeof value!=='object'||Array.isArray(value))fail();
  const state=Object.fromEntries(Object.keys(createGame()).map(key=>[key,value[key]]));
  if(!isValidSave(state)||state.attempts.length>10000||state.reviews.length>10000)fail();
  return clone(state);
}
export function createHistoryExport(state,now=Date.now()){
  const snapshot=canonicalState(pauseGame(state,now));
  return {...report(state),format:FORMAT,formatVersion:1,state:snapshot};
}
function fromLegacyReport(data,now){
  if(data.title!=='紫禁語文弈・學習歷程'||!Array.isArray(data.attempts)||!Array.isArray(data.completed)||data.attempts.length>10000)fail();
  const state=createGame();
  state.attempts=data.attempts.map(a=>{
    const q=questions.find(q=>q.id===a?.questionId);
    if(!q||typeof a.correct!=='boolean'||!Number.isFinite(a.at))fail();
    return {...a,usedHint:a.usedHint??false,strategy:a.strategy??'gentle',expired:a.expired??false,points:a.points??0,
      choiceId:a.choiceId===undefined?(a.correct?q.answerId:q.choices.find(c=>c.id!==q.answerId).id):a.choiceId};
  });
  const ids=playableChapters.map(c=>c.id);
  if(data.completed.length>ids.length||data.completed.some((id,i)=>id!==ids[i]))fail();
  for(const id of data.completed){
    if(!chapterQuestions(id).every(q=>state.attempts.some(a=>a.questionId===q.id)))break;
    state.completed.push(id);
  }
  state.score=data.score??0;
  state.reviews=data.reviews??[];
  state.puzzleLog=data.puzzleLog??[];
  if(state.completed.length===ids.length){
    state.phase='ending';state.completedAt=now;
    state.ending=state.reviews.length?'勤學補拙・端敬貴人策書':'文德定鼎・熹貴妃即位策書';
  }
  return canonicalState(state);
}
export function parseHistoryImport(text,now=Date.now()){
  if(typeof text!=='string'||new TextEncoder().encode(text).byteLength>MAX_HISTORY_BYTES)throw Error('歷程檔案過大，請選擇 2 MB 以內的 JSON。');
  let data;
  try{data=JSON.parse(text.replace(/^\uFEFF/,''));}catch{fail();}
  if(!data||typeof data!=='object'||Array.isArray(data))fail();
  if(data.format!==undefined){
    if(data.format!==FORMAT||data.formatVersion!==1)throw Error('不支援這個歷程檔案版本，請使用目前遊戲匯出的 JSON。');
    return {mode:'full',state:canonicalState(pauseGame(canonicalState(data.state),now)),message:'可還原完整旅程、作答與道具。題中倒數將以暫停狀態恢復。'};
  }
  if(data.version===2)return {mode:'full',state:canonicalState(pauseGame(canonicalState(data),now)),message:'可還原這份旅程備份。'};
  return {mode:'legacy',state:fromLegacyReport(data,now),message:'舊版檔可還原作答及已完成關卡；未記錄的道具、氣血與題中狀態會重新準備，從地圖續玩。'};
}
export function applyHistoryImport(storage,current,incoming,{expectedSerialized=JSON.stringify(current)}={}){
  let previousBackup=null,backupWritten=false;
  try{
    const latest=storage.getItem(SAVE_KEY);
    if(latest&&latest!==expectedSerialized)return {ok:false,message:'另一個分頁已更新旅程。請取消本次匯入，先讀取最新進度。'};
    const next=canonicalState(incoming),backup=canonicalState(pauseGame(current));
    previousBackup=storage.getItem(HISTORY_BACKUP_KEY)??null;
    storage.setItem(HISTORY_BACKUP_KEY,JSON.stringify(backup));
    backupWritten=true;
    storage.setItem(SAVE_KEY,JSON.stringify(next));
    return {ok:true,state:next};
  }catch{
    if(backupWritten&&previousBackup!==null){try{storage.setItem(HISTORY_BACKUP_KEY,previousBackup);}catch{}}
    return {ok:false,message:'無法儲存匯入資料，原旅程未被取代。請先匯出備份或確認瀏覽器儲存空間。'};
  }
}
export function readHistoryBackup(storage){
  try{const raw=storage.getItem(HISTORY_BACKUP_KEY);return raw?canonicalState(JSON.parse(raw)):null;}catch{return null;}
}
