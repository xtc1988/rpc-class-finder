import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions: string[];
  onSuggestionSelect: (suggestion: string) => void;
  isLoading: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  suggestions,
  onSuggestionSelect,
  isLoading,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setShowSuggestions(suggestions.length > 0 && value.length > 0);
    setSelectedIndex(-1);
  }, [suggestions, value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        onSuggestionSelect(suggestions[selectedIndex]);
        setShowSuggestions(false);
      } else {
        onSearch(value);
        setShowSuggestions(false);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (event.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionSelect(suggestion);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleFocus = () => {
    if (suggestions.length > 0 && value.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <TextField
        ref={inputRef}
        fullWidth
        variant="outlined"
        placeholder="RPC Classを入力してください (例: jp.co.testRIclass)"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {isLoading ? (
                <CircularProgress size={20} />
              ) : (
                <SearchIcon />
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            fontSize: "1.1rem",
            padding: "12px 14px",
          },
        }}
      />
      
      {showSuggestions && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 200,
            overflow: "auto",
            mt: 1,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <List sx={{ py: 0 }}>
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={suggestion}
                button
                selected={index === selectedIndex}
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                      {suggestion}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};
