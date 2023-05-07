import { log } from './Log';
import { getCookies } from './HttpRequest';
export const sendMessage = async function (messageObj, tab = null) {
  if (tab === null) {
    const response = await chrome.runtime.sendMessage(messageObj);
    return response;
  } else {
    const response = await chrome.tabs.sendMessage(tab.id, messageObj);
    return response;
  }
};

export const sendCredential = async function (tab = null) {
  const response = await getCookies().then((cookies) => {
    sendMessage({ type: 'send_credential', credential: cookies }, tab);
  });
  return response;
};

//TODO メッセージの受信の一元化
