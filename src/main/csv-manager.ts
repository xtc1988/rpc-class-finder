import * as fs from "fs";
import * as path from "path";
import * as Papa from "papaparse";
import { RpcMapping, JsMapping, SearchResult } from "../shared/types";

export class CsvManager {
  private rpcMappings: RpcMapping[] = [];
  private jsMappings: JsMapping[] = [];
  private lastUpdated: Date = new Date();

  private readonly CSV1_PATH = path.join(process.cwd(), "data", "rpc-mappings.csv");
  private readonly CSV2_PATH = path.join(process.cwd(), "data", "js-mappings.csv");

  async loadCsvData(): Promise<{ rpcMappings: RpcMapping[]; jsMappings: JsMapping[] }> {
    try {
      const [rpcMappings, jsMappings] = await Promise.all([
        this.loadRpcMappings(),
        this.loadJsMappings(),
      ]);

      this.rpcMappings = rpcMappings;
      this.jsMappings = jsMappings;
      this.lastUpdated = new Date();

      return { rpcMappings, jsMappings };
    } catch (error) {
      console.error("Failed to load CSV data:", error);
      throw new Error(`CSVデータの読み込みに失敗しました: ${(error as Error).message}`);
    }
  }

  async reloadCsvData(): Promise<{ rpcMappings: RpcMapping[]; jsMappings: JsMapping[] }> {
    return this.loadCsvData();
  }

  private async loadRpcMappings(): Promise<RpcMapping[]> {
    if (!fs.existsSync(this.CSV1_PATH)) {
      throw new Error(`RPC mappings file not found: ${this.CSV1_PATH}`);
    }

    const csvContent = fs.readFileSync(this.CSV1_PATH, "utf-8");
    const parseResult = Papa.parse<RpcMapping>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        const headerMap: { [key: string]: string } = {
          "rpc_name": "rpcName",
          "rpc_class": "rpcClass",
        };
        return headerMap[header] || header;
      },
    });

    if (parseResult.errors.length > 0) {
      throw new Error(`RPC mappings CSV parsing error: ${parseResult.errors[0].message}`);
    }

    return parseResult.data.filter(item => item.rpcName && item.rpcClass);
  }

  private async loadJsMappings(): Promise<JsMapping[]> {
    if (!fs.existsSync(this.CSV2_PATH)) {
      throw new Error(`JS mappings file not found: ${this.CSV2_PATH}`);
    }

    const csvContent = fs.readFileSync(this.CSV2_PATH, "utf-8");
    const parseResult = Papa.parse<JsMapping>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        const headerMap: { [key: string]: string } = {
          "rpc_name": "rpcName",
          "js_class": "jsClass",
          "file_path": "filePath",
        };
        return headerMap[header] || header;
      },
    });

    if (parseResult.errors.length > 0) {
      throw new Error(`JS mappings CSV parsing error: ${parseResult.errors[0].message}`);
    }

    return parseResult.data.filter(item => item.rpcName && item.jsClass && item.filePath);
  }

  async searchRpc(rpcClass: string): Promise<SearchResult |  null> {
    if (!rpcClass || rpcClass.trim() === "") {
      return null;
    }

    const rpcMapping = this.rpcMappings.find(
      (mapping) => mapping.rpcClass.toLowerCase() === rpcClass.toLowerCase()
    );

    if (!rpcMapping) {
      throw new Error(`RPC Class not found: ${rpcClass}`);
    }

    const jsMapping = this.jsMappings.find(
      (mapping) => mapping.rpcName === rpcMapping.rpcName
    );

    if (!jsMapping) {
      throw new Error(`JavaScript mapping not found for RPC: ${rpcMapping.rpcName}`);
    }

    return {
      rpcClass: rpcMapping.rpcClass,
      rpcName: rpcMapping.rpcName,
      jsClass: jsMapping.jsClass,
      filePath: jsMapping.filePath,
    };
  }

  async getSuggestions(query: string): Promise<string[]> {
    if (!query || query.trim() === "") {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    const suggestions = this.rpcMappings
      .filter((mapping) => mapping.rpcClass.toLowerCase().includes(lowerQuery))
      .map((mapping) => mapping.rpcClass)
      .slice(0, 10);

    return suggestions;
  }

  getLastUpdated(): Date {
    return this.lastUpdated;
  }

  getDataCount(): { rpcMappings: number; jsMappings: number } {
    return {
      rpcMappings: this.rpcMappings.length,
      jsMappings: this.jsMappings.length,
    };
  }
}
