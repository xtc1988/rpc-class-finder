import { FileHandler } from "../file-handler";
import { shell, clipboard } from "electron";
import * as fs from "fs";
import * as path from "path";

jest.mock("electron", () => ({
  shell: {
    openPath: jest.fn(),
  },
  clipboard: {
    writeText: jest.fn(),
  },
}));

jest.mock("fs");
jest.mock("path");

const mockShell = shell as jest.Mocked<typeof shell>;
const mockClipboard = clipboard as jest.Mocked<typeof clipboard>;
const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe("FileHandler", () => {
  let fileHandler: FileHandler;

  beforeEach(() => {
    fileHandler = new FileHandler();
    jest.clearAllMocks();
    
    // Mock path.dirname
    mockPath.dirname.mockImplementation((filePath) => {
      const lastSep = filePath.lastIndexOf("/");
      return lastSep > 0 ? filePath.substring(0, lastSep) : filePath;
    });
    
    // Mock path.normalize
    mockPath.normalize.mockImplementation((filePath) => filePath);
  });

  describe("openFile", () => {
    it("opens file successfully when file exists", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockShell.openPath.mockResolvedValue("");
      
      await fileHandler.openFile("/test/file.js");
      
      expect(mockShell.openPath).toHaveBeenCalledWith("/test/file.js");
    });

    it("throws error when file does not exist", async () => {
      mockFs.existsSync.mockReturnValue(false);
      
      await expect(fileHandler.openFile("/test/nonexistent.js"))
        .rejects.toThrow("File not found: /test/nonexistent.js");
    });

    it("throws error when shell.openPath returns error", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockShell.openPath.mockResolvedValue("Error opening file");
      
      await expect(fileHandler.openFile("/test/file.js"))
        .rejects.toThrow("Failed to open file: Error opening file");
    });
  });

  describe("copyToClipboard", () => {
    it("copies text to clipboard successfully", async () => {
      await fileHandler.copyToClipboard("test text");
      
      expect(mockClipboard.writeText).toHaveBeenCalledWith("test text");
    });

    it("throws error when clipboard operation fails", async () => {
      mockClipboard.writeText.mockImplementation(() => {
        throw new Error("Clipboard error");
      });
      
      await expect(fileHandler.copyToClipboard("test text"))
        .rejects.toThrow("クリップボードへのコピーに失敗しました: Clipboard error");
    });
  });

  describe("openContainingFolder", () => {
    it("opens containing folder successfully", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockShell.openPath.mockResolvedValue("");
      
      await fileHandler.openContainingFolder("/test/folder/file.js");
      
      expect(mockPath.dirname).toHaveBeenCalledWith("/test/folder/file.js");
      expect(mockShell.openPath).toHaveBeenCalledWith("/test/folder");
    });

    it("throws error when folder does not exist", async () => {
      mockFs.existsSync.mockReturnValue(false);
      
      await expect(fileHandler.openContainingFolder("/test/folder/file.js"))
        .rejects.toThrow("Folder not found: /test/folder");
    });
  });

  describe("isValidPath", () => {
    it("returns true for valid existing path", () => {
      mockFs.existsSync.mockReturnValue(true);
      
      const result = fileHandler.isValidPath("/test/file.js");
      
      expect(result).toBe(true);
      expect(mockPath.normalize).toHaveBeenCalledWith("/test/file.js");
    });

    it("returns false for non-existing path", () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const result = fileHandler.isValidPath("/test/nonexistent.js");
      
      expect(result).toBe(false);
    });

    it("returns false when path.normalize throws error", () => {
      mockPath.normalize.mockImplementation(() => {
        throw new Error("Invalid path");
      });
      
      const result = fileHandler.isValidPath("invalid//path");
      
      expect(result).toBe(false);
    });
  });

  describe("getFileStats", () => {
    it("returns file stats for valid file", () => {
      const mockStats = {
        isFile: () => true,
        isDirectory: () => false,
        size: 1024,
      } as fs.Stats;
      
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue(mockStats);
      
      const result = fileHandler.getFileStats("/test/file.js");
      
      expect(result).toEqual(mockStats);
    });

    it("returns null for invalid path", () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const result = fileHandler.getFileStats("/test/nonexistent.js");
      
      expect(result).toBeNull();
    });

    it("returns null when statSync throws error", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockImplementation(() => {
        throw new Error("Stat error");
      });
      
      const result = fileHandler.getFileStats("/test/file.js");
      
      expect(result).toBeNull();
    });
  });
});