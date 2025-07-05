import { CsvManager } from "../csv-manager";
import * as fs from "fs";
import * as path from "path";

jest.mock("fs");
jest.mock("path");

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe("CsvManager", () => {
  let csvManager: CsvManager;

  beforeEach(() => {
    csvManager = new CsvManager();
    jest.clearAllMocks();
    
    // Mock path.join to return predictable paths
    mockPath.join.mockImplementation((...args) => args.join("/"));
    
    // Mock process.cwd()
    jest.spyOn(process, "cwd").mockReturnValue("/mock/cwd");
  });

  describe("loadCsvData", () => {
    it("loads CSV data successfully", async () => {
      const mockRpcCsv = "rpc_name,rpc_class\ntestRI,jp.co.testRIclass";
      const mockJsCsv = "rpc_name,js_class,file_path\ntestRI,test_js,test\\common\\test_js.js";
      
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync
        .mockReturnValueOnce(mockRpcCsv)
        .mockReturnValueOnce(mockJsCsv);
      
      const result = await csvManager.loadCsvData();
      
      expect(result.rpcMappings).toHaveLength(1);
      expect(result.rpcMappings[0]).toEqual({
        rpcName: "testRI",
        rpcClass: "jp.co.testRIclass",
      });
      
      expect(result.jsMappings).toHaveLength(1);
      expect(result.jsMappings[0]).toEqual({
        rpcName: "testRI",
        jsClass: "test_js",
        filePath: "test\\common\\test_js.js",
      });
    });

    it("throws error when RPC mappings file does not exist", async () => {
      mockFs.existsSync.mockReturnValueOnce(false);
      
      await expect(csvManager.loadCsvData()).rejects.toThrow("RPC mappings file not found");
    });

    it("throws error when JS mappings file does not exist", async () => {
      mockFs.existsSync
        .mockReturnValueOnce(true)  // RPC file exists
        .mockReturnValueOnce(false); // JS file does not exist
      
      mockFs.readFileSync.mockReturnValueOnce("rpc_name,rpc_class\ntestRI,jp.co.testRIclass");
      
      await expect(csvManager.loadCsvData()).rejects.toThrow("JS mappings file not found");
    });
  });

  describe("searchRpc", () => {
    beforeEach(async () => {
      const mockRpcCsv = "rpc_name,rpc_class\ntestRI,jp.co.testRIclass";
      const mockJsCsv = "rpc_name,js_class,file_path\ntestRI,test_js,test\\common\\test_js.js";
      
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync
        .mockReturnValueOnce(mockRpcCsv)
        .mockReturnValueOnce(mockJsCsv);
      
      await csvManager.loadCsvData();
    });

    it("returns search result for existing RPC class", async () => {
      const result = await csvManager.searchRpc("jp.co.testRIclass");
      
      expect(result).toEqual({
        rpcClass: "jp.co.testRIclass",
        rpcName: "testRI",
        jsClass: "test_js",
        filePath: "test\\common\\test_js.js",
      });
    });

    it("returns null for empty query", async () => {
      const result = await csvManager.searchRpc("");
      expect(result).toBeNull();
    });

    it("throws error for non-existent RPC class", async () => {
      await expect(csvManager.searchRpc("nonexistent")).rejects.toThrow("RPC Class not found");
    });
  });

  describe("getSuggestions", () => {
    beforeEach(async () => {
      const mockRpcCsv = "rpc_name,rpc_class\ntestRI,jp.co.testRIclass\nanotherRI,jp.co.anotherClass";
      const mockJsCsv = "rpc_name,js_class,file_path\ntestRI,test_js,test\\common\\test_js.js";
      
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync
        .mockReturnValueOnce(mockRpcCsv)
        .mockReturnValueOnce(mockJsCsv);
      
      await csvManager.loadCsvData();
    });

    it("returns suggestions for partial match", async () => {
      const suggestions = await csvManager.getSuggestions("test");
      
      expect(suggestions).toContain("jp.co.testRIclass");
      expect(suggestions).toHaveLength(1);
    });

    it("returns empty array for empty query", async () => {
      const suggestions = await csvManager.getSuggestions("");
      expect(suggestions).toEqual([]);
    });

    it("returns case-insensitive suggestions", async () => {
      const suggestions = await csvManager.getSuggestions("TEST");
      
      expect(suggestions).toContain("jp.co.testRIclass");
    });
  });
});