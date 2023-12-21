import {JSONparse} from '../utils/json';
import {pageMap} from "./action";

let url = "ws://localhost:8080";
let tryCount = 0;
let timer: string | number | NodeJS.Timeout | undefined;
function handleOpen() {
  tryCount = 0;
  console.log('WebSocket opened');
}

function handleClose() {
  console.log('WebSocket closed');
  clearTimeout(timer);
  timer = setTimeout(initWebSocket, 6E3); // 6秒后尝试重新连接
}

function handleError() {
  console.error('WebSocket error');
  clearTimeout(timer);
  timer = setTimeout(initWebSocket, 6E3); // 出现错误，6秒后尝试重新连接
}


function handleMessage (event: any) {
  const data = JSONparse(event.data) || {};
  console.log('socket.onmessage', data);
  if (data.action === "chrome-reload") {
    chrome.runtime.reload();
  }else if(data.action === "location-reload"){
    // options页面不生效
    // chrome.runtime.sendMessage({reload: true}, function(response) {
    //   console.log('reload', response);
    // });
    for(let key of Object.keys(pageMap)){
      pageMap[key]({
        action: 'reload'
      })
    }
    // options页面不生效
    // sendMsgToContentScript({reload: true}, function(response) {
    //   console.log('sendMsgToContentScript', response);
    // });
  }
};

// 确保socket是单例
let socket;
function initWebSocket() {
  try{
    tryCount++;
    if(tryCount > 20){
      // 超过 2分钟就不再重试了
      return;
    }
    socket = new WebSocket(url);
    socket.onopen = handleOpen;
    socket.onclose = handleClose;
    socket.onmessage = handleMessage;
    socket.onerror = handleError;
  }catch(e){}
}

export default initWebSocket;