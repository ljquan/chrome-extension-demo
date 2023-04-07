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
