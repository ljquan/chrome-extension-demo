import { defaultStorage } from "@/config/storeKey";

export const pageMap = {} as Record<string, (data: any) => void>;

export default {
  init(sendResponse: (arg0: string) => void, name: any, value: any) {
    pageMap[name] = sendResponse;
  },
  // 使用 chrome.storage.local 存储的数据不会自动同步，它的存储容量较大，最高可达5MB。
  // 使用 chrome.storage.sync 存储的数据会根据用户的谷歌账户同步，限制在最多100KB。
  setSyncStorage(sendResponse: (arg0: string) => void, name: any, value: any) {
    return chrome.storage.sync.set({ [name]: value }, function () {
      sendResponse("set");
    });
  },
  getSyncStorage(sendResponse: (arg0: any) => void, name: string) {
    return chrome.storage.sync.get([name], (result) => {
      sendResponse(result[name] ?? defaultStorage[name]);
    });
  },
  setStorage(sendResponse: (arg0: string) => void, name: any, value: any) {
    return chrome.storage.local.set({ [name]: value }, function () {
      sendResponse("set");
    });
  },
  getStorage(sendResponse: (arg0: any) => void, name: string) {
    return chrome.storage.local.get([name], (result) => {
      sendResponse(result[name] ?? defaultStorage[name]);
    });
  },
  getCookies(sendResponse: (arg0: chrome.cookies.Cookie[]) => void, name: any) {
    return chrome.cookies.getAll({ domain: name }, (cookie) => {
      sendResponse(cookie);
    });
  },
  setCookies(sendResponse: (arg0: string) => void, name: any) {
    return chrome.cookies.getAll({ domain: name }, (all) => {
      const cookies = [] as any[];
      all.map((item) => {
        const param = {} as any;
        param.name = item.name;
        param.value = item.value;
        param.path = "/";
        chrome.cookies.set(param, function (cookie) {
          cookies.push(cookie);
        });
      });
      sendResponse("ok");
    });
  },
};
