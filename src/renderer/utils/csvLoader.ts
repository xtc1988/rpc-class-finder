import Papa from "papaparse";
import { RpcMapping, JsMapping } from "@shared/types";

export interface CsvData {
  rpcMappings: RpcMapping[];
  jsMappings: JsMapping[];
}

export class CsvLoader {
  private static instance: CsvLoader;
  private cachedData: CsvData | null = null;
  private lastLoadTime: number = 0;
  private readonly CACHE_DURATION = 5000; // 5秒間キャッシュ

  private constructor() {}

  static getInstance(): CsvLoader {
    if (!CsvLoader.instance) {
      CsvLoader.instance = new CsvLoader();
    }
    return CsvLoader.instance;
  }

  async loadCsvData(forceReload = false): Promise<CsvData> {
    const now = Date.now();
    
    // キャッシュが有効な場合は返す
    if (!forceReload && this.cachedData && (now - this.lastLoadTime) < this.CACHE_DURATION) {
      console.log('Using cached CSV data');
      return this.cachedData;
    }

    console.log('Loading CSV files...');
    try {
      // 並列でCSVファイルを読み込む
      const basePath = import.meta.env.BASE_URL || '/';
      const [rpcResponse, jsResponse] = await Promise.all([
        fetch(`${basePath}data/rpc-mappings.csv`),
        fetch(`${basePath}data/js-mappings.csv`)
      ]);

      console.log('CSV fetch responses:', { 
        rpc: rpcResponse.status, 
        js: jsResponse.status 
      });

      if (!rpcResponse.ok || !jsResponse.ok) {
        throw new Error('CSVファイルの読み込みに失敗しました');
      }

      const [rpcText, jsText] = await Promise.all([
        rpcResponse.text(),
        jsResponse.text()
      ]);

      // CSVをパース
      const rpcResult = Papa.parse<any>(rpcText, {
        header: true,
        skipEmptyLines: true
      });

      const jsResult = Papa.parse<any>(jsText, {
        header: true,
        skipEmptyLines: true
      });

      if (rpcResult.errors.length > 0 || jsResult.errors.length > 0) {
        console.error('CSV parsing errors:', { rpc: rpcResult.errors, js: jsResult.errors });
        throw new Error('CSVファイルの解析に失敗しました');
      }

      // データを変換
      const rpcMappings: RpcMapping[] = rpcResult.data
        .filter((row: any) => row.rpc_name && row.rpc_class)
        .map((row: any) => ({
          rpcName: row.rpc_name,
          rpcClass: row.rpc_class
        }));

      const jsMappings: JsMapping[] = jsResult.data
        .filter((row: any) => row.rpc_name && row.js_class && row.file_path)
        .map((row: any) => ({
          rpcName: row.rpc_name,
          jsClass: row.js_class,
          filePath: row.file_path
        }));

      this.cachedData = { rpcMappings, jsMappings };
      this.lastLoadTime = now;

      console.log('CSV data loaded:', {
        rpcCount: rpcMappings.length,
        jsCount: jsMappings.length,
        rpcSample: rpcMappings.slice(0, 3),
        jsSample: jsMappings.slice(0, 3)
      });

      return this.cachedData;
    } catch (error) {
      console.error('Failed to load CSV data:', error);
      throw error;
    }
  }

  clearCache(): void {
    console.log('Clearing CSV cache');
    this.cachedData = null;
    this.lastLoadTime = 0;
  }
}