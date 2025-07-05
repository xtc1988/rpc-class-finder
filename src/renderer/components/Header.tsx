import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Switch,
  Tooltip,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";

interface HeaderProps {
  onThemeToggle: () => void;
  onCsvReload: () => void;
  currentTheme: "light" | "dark";
}

export const Header: React.FC<HeaderProps> = ({
  onThemeToggle,
  onCsvReload,
  currentTheme,
}) => {
  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: "background.paper" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "text.primary" }}>
          RPC Class Finder
        </Typography>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="CSVデータを更新">
            <IconButton onClick={onCsvReload} color="inherit">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="設定">
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LightModeIcon />
            <Switch
              checked={currentTheme === "dark"}
              onChange={onThemeToggle}
              color="primary"
            />
            <DarkModeIcon />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
