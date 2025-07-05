import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      gradient: string;
      borderRadius: number;
    };
  }
  
  interface ThemeOptions {
    custom?: {
      gradient?: string;
      borderRadius?: number;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#E57CD8",
      dark: "#C863FF",
    },
    secondary: {
      main: "#2C3E50",
    },
    background: {
      default: "#FAFBFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2C3E50",
      secondary: "#6B7C93",
    },
    divider: "#E3E8EE",
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      "sans-serif",
    ].join(","),
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    body1: {
      fontSize: "1rem",
    },
    code: {
      fontFamily: ["SF Mono", "Monaco", "Consolas", "monospace"].join(","),
    },
  },
  shape: {
    borderRadius: 16,
  },
  custom: {
    gradient: "linear-gradient(135deg, #C863FF 0%, #E57CD8 100%)",
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          padding: "8px 24px",
          fontWeight: 500,
        },
        contained: {
          background: "linear-gradient(135deg, #C863FF 0%, #E57CD8 100%)",
          color: "white",
          "&:hover": {
            background: "linear-gradient(135deg, #B855E6 0%, #D670CC 100%)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            "& fieldset": {
              borderColor: "#E3E8EE",
            },
            "&:hover fieldset": {
              borderColor: "#E57CD8",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#E57CD8",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
        },
      },
    },
  },
});
