try{await import('./main.js');}
catch(error){
  console.error(error);
  const message=document.querySelector('#boot-detail');
  if(message)message.textContent='暫時無法讀取遊戲，請確認連線後重新載入。';
  const retry=document.querySelector('#boot-retry');
  if(retry){retry.hidden=false;retry.addEventListener('click',()=>location.reload());}
}
