import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import { ResultCard } from "../ResultCard";
import { SearchResult } from "@shared/types";

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe("ResultCard", () => {
  const mockOnFileOpen = jest.fn();
  const mockOnCopyPath = jest.fn();

  const mockResult: SearchResult = {
    rpcClass: "jp.co.testRIclass",
    rpcName: "testRI",
    jsClass: "test_js",
    filePath: "test\\common\\test_js.js",
  };

  const defaultProps = {
    result: mockResult,
    onFileOpen: mockOnFileOpen,
    onCopyPath: mockOnCopyPath,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders search result data correctly", () => {
    renderWithTheme(<ResultCard {...defaultProps} />);
    
    expect(screen.getByText("検索結果")).toBeInTheDocument();
    expect(screen.getByText("jp.co.testRIclass")).toBeInTheDocument();
    expect(screen.getByText("testRI")).toBeInTheDocument();
    expect(screen.getByText("test_js")).toBeInTheDocument();
    expect(screen.getByText("test\\common\\test_js.js")).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    renderWithTheme(<ResultCard {...defaultProps} />);
    
    expect(screen.getByRole("button", { name: /ファイルを開く/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /パスをコピー/i })).toBeInTheDocument();
  });

  it("calls onFileOpen when file open button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ResultCard {...defaultProps} />);
    
    const openButton = screen.getByRole("button", { name: /ファイルを開く/i });
    await user.click(openButton);
    
    expect(mockOnFileOpen).toHaveBeenCalledWith("test\\common\\test_js.js");
  });

  it("calls onCopyPath when copy path button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ResultCard {...defaultProps} />);
    
    const copyButton = screen.getByRole("button", { name: /パスをコピー/i });
    await user.click(copyButton);
    
    expect(mockOnCopyPath).toHaveBeenCalledWith("test\\common\\test_js.js");
  });

  it("displays correct section labels", () => {
    renderWithTheme(<ResultCard {...defaultProps} />);
    
    expect(screen.getByText("RPC CLASS")).toBeInTheDocument();
    expect(screen.getByText("RPC NAME")).toBeInTheDocument();
    expect(screen.getByText("JAVASCRIPT CLASS")).toBeInTheDocument();
    expect(screen.getByText("FILE PATH")).toBeInTheDocument();
  });

  it("displays success icon", () => {
    renderWithTheme(<ResultCard {...defaultProps} />);
    
    const successIcon = screen.getByTestId("CheckCircleIcon");
    expect(successIcon).toBeInTheDocument();
  });

  it("displays file chip", () => {
    renderWithTheme(<ResultCard {...defaultProps} />);
    
    expect(screen.getByText("ファイル")).toBeInTheDocument();
  });
});
