import { contextBridge, ipcRenderer } from 'electron';
import { SearchResult, CSVUpdateResult, LogEntry } from '../shared/types';

const electronAPI = {
  searchRpcClass: (query: string): Promise<SearchResult | null> => 
    ipcRenderer.invoke('search-rpc-class', query),
  
  getSuggestions: (query: string): Promise<string[]> => 
    ipcRenderer.invoke('get-suggestions', query),
  
  updateCSVData: (): Promise<CSVUpdateResult> => 
    ipcRenderer.invoke('update-csv-data'),
  
  openFile: (filePath: string): Promise<boolean> => 
    ipcRenderer.invoke('open-file', filePath),
  
  copyToClipboard: (text: string): Promise<boolean> => 
    ipcRenderer.invoke('copy-to-clipboard', text),
  
  getLogs: (): Promise<LogEntry[]> => 
    ipcRenderer.invoke('get-logs'),
  
  selectCSVFiles: (): Promise<string[] | null> => 
    ipcRenderer.invoke('select-csv-files'),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

declare global {
  interface Window {
    electronAPI: typeof electronAPI;
  }
}