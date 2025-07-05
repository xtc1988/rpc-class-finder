import { contextBridge, ipcRenderer } from "electron";

const electronAPI = {
  csv: {
    load: () => ipcRenderer.invoke("csv:load"),
    reload: () => ipcRenderer.invoke("csv:reload"),
  },
  search: {
    rpc: (query: string) => ipcRenderer.invoke("search:rpc", query),
    suggestions: (query: string) => ipcRenderer.invoke("search:suggestions", query),
  },
  file: {
    open: (filePath: string) => ipcRenderer.invoke("file:open", filePath),
    copyPath: (filePath: string) => ipcRenderer.invoke("file:copy-path", filePath),
  },
  app: {
    getVersion: () => ipcRenderer.invoke("app:get-version"),
  },
  dialog: {
    showError: (title: string, content: string) => ipcRenderer.invoke("dialog:show-error", title, content),
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

export type ElectronAPI = typeof electronAPI;
