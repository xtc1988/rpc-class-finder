import { app, BrowserWindow, ipcMain, dialog, shell } from "electron";
import * as path from "path";
import { CsvManager } from "./csv-manager";
import { FileHandler } from "./file-handler";

class App {
  private mainWindow: BrowserWindow |  null = null;
  private csvManager: CsvManager;
  private fileHandler: FileHandler;

  constructor() {
    this.csvManager = new CsvManager();
    this.fileHandler = new FileHandler();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    app.whenReady().then(() => {
      this.createWindow();
      this.setupIpcHandlers();
    });

    app.on("window-all-closed", () => {
      if (process.platform \!== "darwin") {
        app.quit();
      }
    });

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
      },
      titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
      show: false,
    });

    const isDev = process.env.NODE_ENV === "development";
    const url = isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../renderer/index.html")}`;

    this.mainWindow.loadURL(url);

    this.mainWindow.once("ready-to-show", () => {
      this.mainWindow?.show();
    });

    if (isDev) {
      this.mainWindow.webContents.openDevTools();
    }
  }

  private setupIpcHandlers(): void {
    ipcMain.handle("csv:load", async () => {
      try {
        const data = await this.csvManager.loadCsvData();
        return { success: true, data };
      } catch (error) {
        console.error("CSV load error:", error);
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle("csv:reload", async () => {
      try {
        const data = await this.csvManager.reloadCsvData();
        return { success: true, data };
      } catch (error) {
        console.error("CSV reload error:", error);
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle("search:rpc", async (_, query: string) => {
      try {
        const result = await this.csvManager.searchRpc(query);
        return { success: true, result };
      } catch (error) {
        console.error("Search error:", error);
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle("search:suggestions", async (_, query: string) => {
      try {
        const suggestions = await this.csvManager.getSuggestions(query);
        return { success: true, suggestions };
      } catch (error) {
        console.error("Suggestions error:", error);
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle("file:open", async (_, filePath: string) => {
      try {
        await this.fileHandler.openFile(filePath);
        return { success: true };
      } catch (error) {
        console.error("File open error:", error);
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle("file:copy-path", async (_, filePath: string) => {
      try {
        await this.fileHandler.copyToClipboard(filePath);
        return { success: true };
      } catch (error) {
        console.error("Copy path error:", error);
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle("app:get-version", () => {
      return app.getVersion();
    });

    ipcMain.handle("dialog:show-error", async (_, title: string, content: string) => {
      if (this.mainWindow) {
        await dialog.showMessageBox(this.mainWindow, {
          type: "error",
          title,
          message: content,
        });
      }
    });
  }
}

new App();
