export default function watchChange(name=''){
    chrome.runtime.sendMessage(
        { name, action: 'init' },
        function (response) {
          console.log('chrome.runtime.sendMessage', name, response);
          if(response.action === 'reload'){
              location.reload();
          }
        }
      );
}