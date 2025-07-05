import { useState, useCallback, useEffect } from "react";
import { SearchResult } from "@shared/types";
import { CsvLoader, CsvData } from "../utils/csvLoader";

export const useSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const csvLoader = CsvLoader.getInstance();

  // CSVデータを初期ロード
  useEffect(() => {
    loadCsvData();
  }, []);

  const loadCsvData = async () => {
    try {
      setDataLoading(true);
      const data = await csvLoader.loadCsvData();
      setCsvData(data);
    } catch (error) {
      console.error("Failed to load CSV data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const search = useCallback(async (query: string): Promise<SearchResult> => {
    if (!csvData) {
      throw new Error("データが読み込まれていません");
    }

    setIsLoading(true);
    try {
      // 検索の遅延をシミュレート
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const rpcMapping = csvData.rpcMappings.find(
        mapping => mapping.rpcClass.toLowerCase() === query.toLowerCase()
      );
      
      if (!rpcMapping) {
        throw new Error(`RPC Class not found: ${query}`);
      }
      
      const jsMapping = csvData.jsMappings.find(
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
      setIsLoading(false);
    }
  }, [csvData]);

  const getSuggestions = useCallback(async (query: string): Promise<string[]> => {
    console.log('getSuggestions called with query:', query, 'csvData:', csvData ? 'loaded' : 'not loaded');
    
    if (!csvData) {
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
      const suggestions = csvData.rpcMappings
        .filter(mapping => mapping.rpcClass.toLowerCase().includes(lowerQuery))
        .map(mapping => mapping.rpcClass)
        .slice(0, 10);
      
      console.log('Suggestions found:', suggestions);
      return suggestions;
    } catch (error) {
      console.error("Failed to get suggestions:", error);
      return [];
    }
  }, [csvData]);

  const reloadCsvData = useCallback(async () => {
    await csvLoader.clearCache();
    await loadCsvData();
  }, []);

  return {
    search,
    getSuggestions,
    isLoading,
    dataLoading,
    reloadCsvData,
  };
};
