import {JSONparse} from '../utils/json';
import {pageMap} from "./action";

let socket = new WebSocket("ws://localhost:8080");
let url = "ws://localhost:8080";
function handleOpen() {
  console.log('WebSocket opened');
}

function handleClose() {
  console.log('WebSocket closed');
  setTimeout(initWebSocket, 5000); // 5秒后尝试重新连接
}

function handleError() {
  console.error('WebSocket error');
  setTimeout(initWebSocket, 5000); // 出现错误，5秒后尝试重新连接
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



function initWebSocket() {
    socket = new WebSocket(url);
    socket.onopen = handleOpen;
    socket.onclose = handleClose;
    socket.onmessage = handleMessage;
    socket.onerror = handleError;
}

export default initWebSocket;