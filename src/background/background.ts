import initWebSocket from './socket';
import actionFun from "./action";

initWebSocket();
function sendMsgToContentScript(message, callback?: Function) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log('tabs', tabs)
    const id = tabs?.[0]?.id;
    if(id){
      chrome.tabs.sendMessage(id, message, function (response) {
        if (callback) callback(response);
      });
    }
  });
}

// eslint-disable-next-line no-undef
chrome.runtime.onInstalled.addListener(() => {
  const color = '#3aa757';
  // eslint-disable-next-line no-undef
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
  // eslint-disable-next-line no-undef
  chrome.storage.local.set({
    color
  });
});


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const { name, action, value } = message;
  console.log('background get message', name, action, value)
  if(action in actionFun){
    actionFun[action](sendResponse, name, value);
  }else{
    sendResponse('default');
  }
  return true;
});