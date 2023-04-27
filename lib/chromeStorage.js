export const getStorage = (key) => {
  return chrome.storage.local.get(key);
};

export const setStorage = (key, value) => {
  chrome.storage.local.set({ [key]: value });
};
