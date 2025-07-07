export interface RpcMapping {
    rpcName: string;
    rpcClass: string;
}
export interface JsMapping {
    rpcName: string;
    jsClass: string;
    filePath: string;
}
export interface SearchResult {
    rpcClass: string;
    rpcName: string;
    jsClass: string;
    filePath: string;
}
export interface AppState {
    theme: "light" | "dark";
    searchQuery: string;
    suggestions: string[];
    searchResult: SearchResult | null;
    isLoading: boolean;
    error: string | null;
    csvData: {
        rpcMappings: RpcMapping[];
        jsMappings: JsMapping[];
        lastUpdated: Date;
    };
}
export interface CsvManagerEvents {
    "data-loaded": {
        rpcMappings: RpcMapping[];
        jsMappings: JsMapping[];
    };
    "error": {
        message: string;
        type: "file-not-found" | "invalid-format" | "permission-denied";
    };
}
//# sourceMappingURL=types.d.ts.map