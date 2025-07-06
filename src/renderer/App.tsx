import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { Header } from "./components/Header";
import { SearchInput } from "./components/SearchInput";
import { ResultCard } from "./components/ResultCard";
import { useSearch } from "./hooks/useSearch";
import { useTheme } from "./hooks/useTheme";
import { SearchResult } from "@shared/types";

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult |  null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { search, getSuggestions } = useSearch();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const loadCsvData = async () => {
      try {
        setIsLoading(true);
        const result = await window.electronAPI.csv.load();
        if (\!result.success) {
          setError(result.error);
        }
      } catch (error) {
        setError("CSVデータの読み込みに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    loadCsvData();
  }, []);

  const handleSearch = async (query: string) => {
    if (\!query.trim()) {
      setSearchResult(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await search(query);
      setSearchResult(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "検索に失敗しました");
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = async (value: string) => {
    setSearchQuery(value);
    
    if (value.trim().length > 0) {
      try {
        const suggestions = await getSuggestions(value);
        setSuggestions(suggestions);
      } catch (error) {
        console.error("Failed to get suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setSearchResult(null);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    handleSearch(suggestion);
  };


  const handleCopyPath = async (filePath: string) => {
    try {
      const result = await window.electronAPI.file.copyPath(filePath);
      if (result.success) {
        setSnackbarMessage("パスをコピーしました");
        setShowSnackbar(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("パスのコピーに失敗しました");
    }
  };

  const handleCsvReload = async () => {
    try {
      setIsLoading(true);
      const result = await window.electronAPI.csv.reload();
      if (result.success) {
        setSnackbarMessage("CSVデータを更新しました");
        setShowSnackbar(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("CSVデータの更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header
        onThemeToggle={toggleTheme}
        onCsvReload={handleCsvReload}
        currentTheme={theme}
      />
      
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            RPC Class Finder
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            RPC Classを入力してJavaScript Classとファイルパスを検索
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <SearchInput
            value={searchQuery}
            onChange={handleInputChange}
            onSearch={handleSearch}
            suggestions={suggestions}
            onSuggestionSelect={handleSuggestionSelect}
            isLoading={isLoading}
          />
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {isLoading && (
          <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {searchResult && \!isLoading && (
          <ResultCard
            result={searchResult}
            onCopyPath={handleCopyPath}
          />
        )}

        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={() => setShowSnackbar(false)}
          message={snackbarMessage}
        />
      </Container>
    </Box>
  );
};
