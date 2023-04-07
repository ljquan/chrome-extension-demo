// 向页面注入JS
function injectCustomJs(jsPath) {
  jsPath = jsPath || 'vendor/inject.ts';
  const temp = document.createElement('script');
  temp.setAttribute('type', 'text/javascript');
  // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
  temp.src = chrome.runtime.getURL(jsPath);
  // eslint-disable-next-line func-names
  temp.onload = function () {
    // 放在页面不好看，执行完后移除掉
    this.parentNode.removeChild(this);
  };
  document.body.appendChild(temp);
}
console.log('这是content script');
injectCustomJs();
document.addEventListener('DOMContentLoaded', () => {
  // 注入自定义JS
  console.log('========');
  injectCustomJs();
});
