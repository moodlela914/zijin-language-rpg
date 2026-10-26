import test from 'node:test';
import assert from 'node:assert/strict';
import {preloadAssets,fetchJsonAsset} from '../src/game/asset-loader.js';

test('必要素材去重並回報進度，失敗圖片不阻止進入遊戲',async()=>{
  const seen=[],progress=[];
  const result=await preloadAssets(['map','player','map',null,'broken'],{load:async url=>{seen.push(url);if(url==='broken')throw Error('offline');},onProgress:p=>progress.push(p),concurrency:2});
  assert.equal(seen.length,3);assert.equal(result.loaded,2);assert.deepEqual(result.failed,['broken']);
  assert.equal(progress.at(-1).percent,100);assert.equal(progress.at(-1).total,3);
});
test('無回應的圖片會逾時完成，載入頁不會永久卡住',async()=>{
  const result=await preloadAssets(['stalled'],{load:()=>new Promise(()=>{}),timeoutMs:15});
  assert.deepEqual(result.failed,['stalled']);
});
test('素材索引與回應內容也受逾時保護，不會卡在初始化',async()=>{
  await assert.rejects(fetchJsonAsset('catalog',{fetcher:()=>new Promise(()=>{}),timeoutMs:15}),/timeout/);
  await assert.rejects(fetchJsonAsset('catalog',{fetcher:async()=>({ok:true,json:()=>new Promise(()=>{})}),timeoutMs:15}),/timeout/);
});
