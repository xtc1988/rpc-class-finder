declare global {
  interface Window {
    electronAPI: import("../main/preload").ElectronAPI;
  }
}

export {};
