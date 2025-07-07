class CsvLoader {
  constructor() {
    this.cachedData = null;
    this.lastLoadTime = 0;
    this.CACHE_DURATION = 5000; // 5秒間キャッシュ
  }

  static getInstance() {
    if (!CsvLoader.instance) {
      CsvLoader.instance = new CsvLoader();
    }
    return CsvLoader.instance;
  }

  async loadCsvData(forceReload = false) {
    const now = Date.now();
    
    // キャッシュが有効な場合は返す
    if (!forceReload && this.cachedData && (now - this.lastLoadTime) < this.CACHE_DURATION) {
      console.log('Using cached CSV data');
      return this.cachedData;
    }

    console.log('Loading CSV files...');
    try {
      // baseパスを取得
      const basePath = window.location.pathname.includes('/rpc-class-finder/') ? '/rpc-class-finder/' : '/';
      
      // 並列でCSVファイルを読み込む
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
      const rpcMappings = this.parseCSV(rpcText, ['rpc_name', 'rpc_class']);
      const jsMappings = this.parseCSV(jsText, ['rpc_name', 'js_class', 'file_path']);

      // データを変換
      const processedRpcMappings = rpcMappings
        .filter(row => row.rpc_name && row.rpc_class)
        .map(row => ({
          rpcName: row.rpc_name,
          rpcClass: row.rpc_class
        }));

      const processedJsMappings = jsMappings
        .filter(row => row.rpc_name && row.js_class && row.file_path)
        .map(row => ({
          rpcName: row.rpc_name,
          jsClass: row.js_class,
          filePath: row.file_path
        }));

      this.cachedData = { 
        rpcMappings: processedRpcMappings, 
        jsMappings: processedJsMappings 
      };
      this.lastLoadTime = now;

      console.log('CSV data loaded:', {
        rpcCount: processedRpcMappings.length,
        jsCount: processedJsMappings.length,
        rpcSample: processedRpcMappings.slice(0, 3),
        jsSample: processedJsMappings.slice(0, 3)
      });

      return this.cachedData;
    } catch (error) {
      console.error('Failed to load CSV data:', error);
      throw error;
    }
  }

  parseCSV(text, expectedHeaders = []) {
    const lines = text.trim().split('\n');
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = this.parseCSVLine(line);
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    }).filter(obj => Object.values(obj).some(v => v && v.length > 0));
  }

  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/"/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim().replace(/"/g, ''));
    return result;
  }

  clearCache() {
    console.log('Clearing CSV cache');
    this.cachedData = null;
    this.lastLoadTime = 0;
  }
}

// グローバルに公開
window.CsvLoader = CsvLoader;