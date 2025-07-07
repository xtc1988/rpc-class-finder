class SearchManager {
  constructor() {
    this.csvLoader = CsvLoader.getInstance();
    this.csvData = null;
    this.isLoading = false;
    this.dataLoading = true;
  }

  async initialize() {
    try {
      this.dataLoading = true;
      this.csvData = await this.csvLoader.loadCsvData();
      this.dataLoading = false;
      console.log('SearchManager initialized with data:', this.csvData);
    } catch (error) {
      console.error('Failed to initialize SearchManager:', error);
      this.dataLoading = false;
      throw error;
    }
  }

  async search(query) {
    if (!this.csvData) {
      throw new Error('データが読み込まれていません');
    }

    this.isLoading = true;
    try {
      // 検索の遅延をシミュレート
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const rpcMapping = this.csvData.rpcMappings.find(
        mapping => mapping.rpcClass.toLowerCase() === query.toLowerCase()
      );
      
      if (!rpcMapping) {
        throw new Error(`RPC Class not found: ${query}`);
      }
      
      const jsMapping = this.csvData.jsMappings.find(
        mapping => mapping.rpcName === rpcMapping.rpcName
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
    } finally {
      this.isLoading = false;
    }
  }

  async getSuggestions(query) {
    console.log('getSuggestions called with query:', query, 'csvData:', this.csvData ? 'loaded' : 'not loaded');
    
    if (!this.csvData) {
      console.warn('CSV data not loaded yet');
      return [];
    }

    try {
      if (!query || query.trim() === "") {
        return [];
      }
      
      // 候補取得の遅延をシミュレート
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const lowerQuery = query.toLowerCase();
      const suggestions = this.csvData.rpcMappings
        .filter(mapping => mapping.rpcClass.toLowerCase().includes(lowerQuery))
        .map(mapping => mapping.rpcClass)
        .slice(0, 10);
      
      console.log('Suggestions found:', suggestions);
      return suggestions;
    } catch (error) {
      console.error("Failed to get suggestions:", error);
      return [];
    }
  }

  async reloadCsvData() {
    await this.csvLoader.clearCache();
    await this.initialize();
  }

  getIsLoading() {
    return this.isLoading;
  }

  getDataLoading() {
    return this.dataLoading;
  }
}

// グローバルに公開
window.SearchManager = SearchManager;