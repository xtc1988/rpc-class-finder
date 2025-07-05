import { shell, clipboard } from "electron";
import * as fs from "fs";
import * as path from "path";

export class FileHandler {
  async openFile(filePath: string): Promise<void> {
    try {
      if (\!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const result = await shell.openPath(filePath);
      if (result) {
        throw new Error(`Failed to open file: ${result}`);
      }
    } catch (error) {
      console.error("File open error:", error);
      throw new Error(`ファイルを開けませんでした: ${error.message}`);
    }
  }

  async copyToClipboard(text: string): Promise<void> {
    try {
      clipboard.writeText(text);
    } catch (error) {
      console.error("Clipboard copy error:", error);
      throw new Error(`クリップボードへのコピーに失敗しました: ${error.message}`);
    }
  }

  async openContainingFolder(filePath: string): Promise<void> {
    try {
      const folderPath = path.dirname(filePath);
      if (\!fs.existsSync(folderPath)) {
        throw new Error(`Folder not found: ${folderPath}`);
      }

      const result = await shell.openPath(folderPath);
      if (result) {
        throw new Error(`Failed to open folder: ${result}`);
      }
    } catch (error) {
      console.error("Folder open error:", error);
      throw new Error(`フォルダを開けませんでした: ${error.message}`);
    }
  }

  isValidPath(filePath: string): boolean {
    try {
      const normalizedPath = path.normalize(filePath);
      return fs.existsSync(normalizedPath);
    } catch (error) {
      return false;
    }
  }

  getFileStats(filePath: string): fs.Stats |  null {
    try {
      if (\!this.isValidPath(filePath)) {
        return null;
      }
      return fs.statSync(filePath);
    } catch (error) {
      console.error("File stats error:", error);
      return null;
    }
  }
}
