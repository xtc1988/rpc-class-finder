import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import { SearchInput } from "../SearchInput";

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe("SearchInput", () => {
  const mockOnChange = jest.fn();
  const mockOnSearch = jest.fn();
  const mockOnSuggestionSelect = jest.fn();

  const defaultProps = {
    value: "",
    onChange: mockOnChange,
    onSearch: mockOnSearch,
    suggestions: [],
    onSuggestionSelect: mockOnSuggestionSelect,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input field with placeholder", () => {
    renderWithTheme(<SearchInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText(/RPC Classを入力してください/i);
    expect(input).toBeInTheDocument();
  });

  it("calls onChange when input value changes", async () => {
    const user = userEvent.setup();
    renderWithTheme(<SearchInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText(/RPC Classを入力してください/i);
    await user.type(input, "test");
    
    expect(mockOnChange).toHaveBeenCalledWith("test");
  });

  it("calls onSearch when Enter key is pressed", async () => {
    const user = userEvent.setup();
    renderWithTheme(<SearchInput {...defaultProps} value="test query" />);
    
    const input = screen.getByPlaceholderText(/RPC Classを入力してください/i);
    await user.type(input, "{enter}");
    
    expect(mockOnSearch).toHaveBeenCalledWith("test query");
  });

  it("displays suggestions when provided", () => {
    const suggestions = ["jp.co.testRIclass", "jp.co.anotherClass"];
    renderWithTheme(
      <SearchInput {...defaultProps} suggestions={suggestions} value="test" />
    );
    
    expect(screen.getByText("jp.co.testRIclass")).toBeInTheDocument();
    expect(screen.getByText("jp.co.anotherClass")).toBeInTheDocument();
  });

  it("calls onSuggestionSelect when suggestion is clicked", async () => {
    const user = userEvent.setup();
    const suggestions = ["jp.co.testRIclass"];
    renderWithTheme(
      <SearchInput {...defaultProps} suggestions={suggestions} value="test" />
    );
    
    const suggestion = screen.getByText("jp.co.testRIclass");
    await user.click(suggestion);
    
    expect(mockOnSuggestionSelect).toHaveBeenCalledWith("jp.co.testRIclass");
  });

  it("navigates suggestions with arrow keys", async () => {
    const user = userEvent.setup();
    const suggestions = ["jp.co.testRIclass", "jp.co.anotherClass"];
    renderWithTheme(
      <SearchInput {...defaultProps} suggestions={suggestions} value="test" />
    );
    
    const input = screen.getByPlaceholderText(/RPC Classを入力してください/i);
    await user.type(input, "{arrowdown}");
    
    const firstSuggestion = screen.getByText("jp.co.testRIclass");
    expect(firstSuggestion.closest("li")).toHaveClass("Mui-selected");
  });

  it("shows loading indicator when isLoading is true", () => {
    renderWithTheme(<SearchInput {...defaultProps} isLoading={true} />);
    
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("hides suggestions when Escape key is pressed", async () => {
    const user = userEvent.setup();
    const suggestions = ["jp.co.testRIclass"];
    renderWithTheme(
      <SearchInput {...defaultProps} suggestions={suggestions} value="test" />
    );
    
    const input = screen.getByPlaceholderText(/RPC Classを入力してください/i);
    await user.type(input, "{escape}");
    
    await waitFor(() => {
      expect(screen.queryByText("jp.co.testRIclass")).not.toBeInTheDocument();
    });
  });
});
