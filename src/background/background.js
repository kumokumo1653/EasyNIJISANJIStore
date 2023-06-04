import { log } from 'my/lib/Log';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type == 'open_mylibrary') {
    chrome.tabs.create({ url: 'mylibrary.html' }).then((response) => {
      log(response);
      sendResponse({ result: 'success', tab: response.id });
    });
    return true;
  }
});
