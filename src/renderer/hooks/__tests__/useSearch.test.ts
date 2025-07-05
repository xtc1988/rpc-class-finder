import { renderHook, act } from "@testing-library/react";
import { useSearch } from "../useSearch";

// Mock electron API
const mockElectronAPI = {
  search: {
    rpc: jest.fn(),
    suggestions: jest.fn(),
  },
};

Object.defineProperty(window, "electronAPI", {
  value: mockElectronAPI,
});

describe("useSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("search", () => {
    it("returns search result on successful search", async () => {
      const mockResult = {
        rpcClass: "jp.co.testRIclass",
        rpcName: "testRI",
        jsClass: "test_js",
        filePath: "test\\common\\test_js.js",
      };
      
      mockElectronAPI.search.rpc.mockResolvedValue({
        success: true,
        result: mockResult,
      });
      
      const { result } = renderHook(() => useSearch());
      
      let searchResult;
      await act(async () => {
        searchResult = await result.current.search("jp.co.testRIclass");
      });
      
      expect(searchResult).toEqual(mockResult);
      expect(mockElectronAPI.search.rpc).toHaveBeenCalledWith("jp.co.testRIclass");
    });

    it("throws error on failed search", async () => {
      mockElectronAPI.search.rpc.mockResolvedValue({
        success: false,
        error: "RPC Class not found",
      });
      
      const { result } = renderHook(() => useSearch());
      
      await act(async () => {
        await expect(result.current.search("nonexistent")).rejects.toThrow("RPC Class not found");
      });
    });

    it("sets loading state during search", async () => {
      mockElectronAPI.search.rpc.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ success: true, result: {} }), 100))
      );
      
      const { result } = renderHook(() => useSearch());
      
      act(() => {
        result.current.search("test");
      });
      
      expect(result.current.isLoading).toBe(true);
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });
      
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("getSuggestions", () => {
    it("returns suggestions on successful request", async () => {
      const mockSuggestions = ["jp.co.testRIclass", "jp.co.anotherClass"];
      
      mockElectronAPI.search.suggestions.mockResolvedValue({
        success: true,
        suggestions: mockSuggestions,
      });
      
      const { result } = renderHook(() => useSearch());
      
      let suggestions;
      await act(async () => {
        suggestions = await result.current.getSuggestions("test");
      });
      
      expect(suggestions).toEqual(mockSuggestions);
      expect(mockElectronAPI.search.suggestions).toHaveBeenCalledWith("test");
    });

    it("returns empty array on failed request", async () => {
      mockElectronAPI.search.suggestions.mockResolvedValue({
        success: false,
        error: "Failed to get suggestions",
      });
      
      const { result } = renderHook(() => useSearch());
      
      let suggestions;
      await act(async () => {
        suggestions = await result.current.getSuggestions("test");
      });
      
      expect(suggestions).toEqual([]);
    });

    it("returns empty array on exception", async () => {
      mockElectronAPI.search.suggestions.mockRejectedValue(new Error("Network error"));
      
      const { result } = renderHook(() => useSearch());
      
      let suggestions;
      await act(async () => {
        suggestions = await result.current.getSuggestions("test");
      });
      
      expect(suggestions).toEqual([]);
    });
  });
});
