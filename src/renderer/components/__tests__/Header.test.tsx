import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import { Header } from "../Header";

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe("Header", () => {
  const mockOnThemeToggle = jest.fn();
  const mockOnCsvReload = jest.fn();

  const defaultProps = {
    onThemeToggle: mockOnThemeToggle,
    onCsvReload: mockOnCsvReload,
    currentTheme: "light" as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders application title", () => {
    renderWithTheme(<Header {...defaultProps} />);
    
    expect(screen.getByText("RPC Class Finder")).toBeInTheDocument();
  });

  it("renders refresh button with tooltip", () => {
    renderWithTheme(<Header {...defaultProps} />);
    
    const refreshButton = screen.getByRole("button", { name: /CSVデータを更新/i });
    expect(refreshButton).toBeInTheDocument();
  });

  it("renders settings button with tooltip", () => {
    renderWithTheme(<Header {...defaultProps} />);
    
    const settingsButton = screen.getByRole("button", { name: /設定/i });
    expect(settingsButton).toBeInTheDocument();
  });

  it("calls onCsvReload when refresh button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Header {...defaultProps} />);
    
    const refreshButton = screen.getByRole("button", { name: /CSVデータを更新/i });
    await user.click(refreshButton);
    
    expect(mockOnCsvReload).toHaveBeenCalledTimes(1);
  });

  it("renders theme toggle switch", () => {
    renderWithTheme(<Header {...defaultProps} />);
    
    const themeSwitch = screen.getByRole("checkbox");
    expect(themeSwitch).toBeInTheDocument();
  });

  it("calls onThemeToggle when theme switch is toggled", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Header {...defaultProps} />);
    
    const themeSwitch = screen.getByRole("checkbox");
    await user.click(themeSwitch);
    
    expect(mockOnThemeToggle).toHaveBeenCalledTimes(1);
  });

  it("shows correct theme switch state for light theme", () => {
    renderWithTheme(<Header {...defaultProps} currentTheme="light" />);
    
    const themeSwitch = screen.getByRole("checkbox");
    expect(themeSwitch).not.toBeChecked();
  });

  it("shows correct theme switch state for dark theme", () => {
    renderWithTheme(<Header {...defaultProps} currentTheme="dark" />);
    
    const themeSwitch = screen.getByRole("checkbox");
    expect(themeSwitch).toBeChecked();
  });

  it("renders light and dark mode icons", () => {
    renderWithTheme(<Header {...defaultProps} />);
    
    expect(screen.getByTestId("LightModeIcon")).toBeInTheDocument();
    expect(screen.getByTestId("DarkModeIcon")).toBeInTheDocument();
  });
});
